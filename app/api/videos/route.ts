import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { VideoWithExternalFields, ProcessingStatusResponse } from "@/types/database";

// POST request handler to create a new video record
export async function POST(req: NextRequest) {
  try {
    console.log("=== POST /api/videos - Saving new video ===");
    
    // Get the user session
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      console.error("Unauthorized access attempt - no valid session");
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
    
    console.log("User authenticated:", session.user.id);

    // Get video data from request body
    let data;
    try {
      data = await req.json();
      console.log("Received video data:", {
        title: data.title,
        fileSize: data.fileSize,
        duration: data.duration,
        status: data.status,
        externalJobId: data.externalJobId,
        aspectRatio: data.aspectRatio,
        numClipsRequested: data.numClipsRequested
      });
    } catch (parseError: any) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request body", details: parseError.message },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['title', 'originalUrl', 'duration', 'fileSize', 'status', 'uploadPath'];
    for (const field of requiredFields) {
      if (!data[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Always use the authenticated session user ID for security
    const userId = session.user.id;
    console.log("Using authenticated user ID:", userId);

    // Verify that the user exists and get subscription information
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true }
      });
    } catch (dbError: any) {
      console.error("Database error when finding user:", dbError);
      return NextResponse.json(
        { error: "Database error when finding user", details: dbError.message },
        { status: 500 }
      );
    }

    if (!user) {
      console.error("User not found:", userId);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    console.log("User found, subscription status:", user.subscription?.status || "no subscription");

    // Create the video record in the database using a transaction
    let video;
    try {
      console.log("Starting database transaction to save video");
      video = await prisma.$transaction(async (tx) => {
        // Create video record with new fields
        console.log("Creating video record");
        const newVideo = await tx.video.create({
          data: {
            userId,
            title: data.title,
            description: data.description || "",
            originalUrl: data.originalUrl,
            duration: data.duration,
            fileSize: data.fileSize,
            status: data.status,
            uploadPath: data.uploadPath,
            // Store processing_id from new API
            externalJobId: data.externalJobId as string | undefined,
            // Add new fields for aspect ratio and clip count
            aspectRatio: data.aspectRatio as string | undefined,
            numClipsRequested: data.numClipsRequested as number | undefined,
            // Add the initial status check timestamp
            lastStatusCheck: new Date() as any
          }
        });
        console.log("Video record created successfully with ID:", newVideo.id);

        // Update user's subscription minutes used if they have an active subscription
        if (user.subscription && user.subscription.status === 'active') {
          // Convert seconds to minutes (rounded up)
          const minutesUsed = Math.ceil(data.duration / 60);
          
          console.log(`===== UPDATING SUBSCRIPTION MINUTES USED =====`);
          console.log(`User ID: ${userId}`);
          console.log(`Video duration: ${data.duration} seconds`);
          console.log(`Minutes to add: ${minutesUsed}`);
          console.log(`Current minutes used: ${user.subscription.minutesUsed}`);
          console.log(`New minutes used will be: ${user.subscription.minutesUsed + minutesUsed}`);
          console.log(`Minutes allowed in plan: ${user.subscription.minutesAllowed}`);
          
          // Update subscription record with minutes used
          await tx.subscription.update({
            where: { id: user.subscription.id },
            data: {
              minutesUsed: {
                increment: minutesUsed
              }
            }
          });
          
          console.log(`✅ Successfully updated subscription minutes used`);
        }
        
        return newVideo;
      });
      console.log("Database transaction completed successfully");
    } catch (txError: any) {
      console.error("Transaction error when saving video:", txError);
      return NextResponse.json(
        { error: "Database transaction failed", details: txError.message },
        { status: 500 }
      );
    }

    console.log("Video saved successfully, returning response");
    return NextResponse.json(
      { 
        success: true, 
        message: "Video saved to database", 
        video 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Unhandled error saving video:", error);
    return NextResponse.json(
      { error: "Failed to save video", details: error.message },
      { status: 500 }
    );
  }
}

// GET request handler to list videos for the current user
export async function GET(req: NextRequest) {
  try {
    // Get the user session
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Parse query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const status = url.searchParams.get("status");
    const skipStatusCheck = url.searchParams.get("skipStatusCheck") === "true";

    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Build the where clause
    const where = {
      userId: session.user.id,
      ...(status ? { status } : {})
    };

    // Count total videos
    const total = await prisma.video.count({ where });

    // Get videos with pagination
    const videos = await prisma.video.findMany({
      where,
      orderBy: {
        uploadedAt: "desc"
      },
      skip,
      take: limit
    });

    // Cast videos to our custom type for TypeScript compatibility
    const videosWithExternalFields = videos as unknown as VideoWithExternalFields[];

    // Check for processing videos and update status if needed (with new API)
    if (!skipStatusCheck) {
      try {
        const processingVideos = videosWithExternalFields.filter(
          (video) => video.status === "processing" && video.externalJobId
        );

        // If we have processing videos, check their status
        for (const video of processingVideos) {
          try {
            // Only check if not checked recently (last 30 seconds)
            const lastChecked = video.lastStatusCheck || new Date(0);
            if (Date.now() - lastChecked.getTime() < 30000) continue;

            // Update last check time first to prevent concurrent checks
            await prisma.video.update({
              where: { id: video.id },
              data: { 
                lastStatusCheck: new Date() as any
              }
            });

            // Get API endpoint from environment
            const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8000';
            
            // Check job status with new API
            const response = await fetch(`${API_ENDPOINT}/api/status/${video.externalJobId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              },
              // Add timeout to prevent long waiting periods
              signal: AbortSignal.timeout(10000) // 10 second timeout
            });

            if (response.ok) {
              const statusData: ProcessingStatusResponse = await response.json();
              
              if (statusData.status === "completed") {
                // Update video status
                await prisma.video.update({
                  where: { id: video.id },
                  data: {
                    status: "completed",
                    processedAt: new Date()
                  }
                });

                // Save clips to database if there are results
                if (statusData.clips && statusData.clips.length > 0) {
                  // Save clips using transaction
                  await prisma.$transaction(async (tx) => {
                    for (const clip of statusData.clips!) {
                      await tx.clip.create({
                        data: {
                          videoId: video.id,
                          title: clip.preview_text || `Clip ${clip.clip_id}`,
                          url: clip.download_url,
                          startTime: clip.start_time,
                          endTime: clip.end_time,
                          duration: clip.duration,
                          filename: clip.filename,
                          fileSize: clip.file_size,
                          // Add new fields for captions
                          subtitleUrl: clip.captions_url,
                          clipId: clip.clip_id.toString(),
                          previewText: clip.preview_text
                        }
                      });
                    }
                  });
                }
              } else if (statusData.status === "failed") {
                // Update video with error status
                await prisma.video.update({
                  where: { id: video.id },
                  data: {
                    status: "failed",
                    error: statusData.error || "Processing failed"
                  }
                });
              }
            }
          } catch (error: any) {
            console.error(`Error checking status for video ${video.id}:`, error);
            
            // If the error is a timeout or API down, skip further checks
            if (error.message?.includes("timed out") || error.name === "AbortError") {
              console.error("External API appears to be down - skipping further checks");
              break;
            }
          }
        }

        // Refresh videos list if any processing videos were checked
        if (processingVideos.length > 0) {
          // Get fresh videos with updated status
          const refreshedVideos = await prisma.video.findMany({
            where,
            orderBy: {
              uploadedAt: "desc"
            },
            skip,
            take: limit
          });
          
          // Return refreshed videos
          return NextResponse.json({
            videos: refreshedVideos,
            pagination: {
              total,
              page,
              limit,
              totalPages: Math.ceil(total / limit)
            },
            externalApiStatus: "checked"
          });
        }
      } catch (apiCheckError: any) {
        console.error("Error during external API check:", apiCheckError);
        // Don't fail the entire request if the API check fails
      }
    }

    // Return videos
    return NextResponse.json({
      videos: videosWithExternalFields,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      externalApiStatus: skipStatusCheck ? "skipped" : "checked"
    });
  } catch (error: any) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos", details: error.message },
      { status: 500 }
    );
  }
} 