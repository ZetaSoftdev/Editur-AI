import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NewApiClip } from "@/types/database";

// POST request handler to save clips from the new API
export async function POST(req: NextRequest) {
  try {
    console.log("=== POST /api/clips - Saving clips from new API ===");
    
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

    // Get data from request body
    let data;
    try {
      data = await req.json();
      console.log("Received clips data:", {
        videoId: data.videoId,
        processingId: data.processingId,
        clipsCount: data.clips?.length || 0
      });
    } catch (parseError: any) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request body", details: parseError.message },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!data.videoId || !data.processingId || !data.clips || !Array.isArray(data.clips)) {
      console.error("Missing required fields or invalid clips array");
      return NextResponse.json(
        { error: "Missing required fields: videoId, processingId, and clips array" },
        { status: 400 }
      );
    }

    // Verify that the video exists and belongs to the user
    const video = await prisma.video.findFirst({
      where: { 
        id: data.videoId,
        userId: session.user.id
      }
    });

    if (!video) {
      console.error("Video not found or doesn't belong to user:", data.videoId);
      return NextResponse.json(
        { error: "Video not found or access denied" },
        { status: 404 }
      );
    }

    console.log("Video found, creating clips...");

    // Create clips using a transaction
    const savedClips = await prisma.$transaction(async (tx) => {
      const clips = [];
      
      for (const clipData of data.clips) {
        console.log(`Creating clip with ID: ${clipData.clip_id}`);
        
        // Safely convert and map fields with proper type handling
        const fileSize = clipData.fileSize || clipData.file_size;
        const previewText = clipData.previewText || clipData.preview_text;
        const clipId = clipData.clipId || clipData.clip_id;
        const captionsUrl = clipData.captionsUrl || clipData.captions_url;
        
        console.log(`📝 Processing clip data:`, {
          originalClipId: clipData.clip_id,
          title: clipData.title || previewText,
          fileSize: fileSize,
          fileSizeType: typeof fileSize,
          url: clipData.url || clipData.download_url
        });
        
                  const clip = await tx.clip.create({
            data: {
              videoId: data.videoId,
              title: clipData.title || previewText || `Clip ${clipId || 'Unknown'}`,
              url: clipData.url || clipData.download_url || '',
              startTime: Number(clipData.startTime || clipData.start_time || 0),
              endTime: Number(clipData.endTime || clipData.end_time || 0),
              duration: Number(clipData.duration || 0),
              filename: clipData.filename || '',
              // Store processing ID for URL construction (using any cast to work around Prisma generation issue)
              processingId: data.processingId,
              // Store additional fields from new API 
              fileSize: fileSize ? String(fileSize) : null,
              previewText: previewText || null,
              clipId: clipId ? String(clipId) : null,
              // Handle captions URL
              subtitleUrl: captionsUrl || null,
              // Set default values for existing fields
              hasSrt: Boolean(captionsUrl),
              withCaptions: Boolean(captionsUrl),
              hasWordTimestamps: false, // New API doesn't provide word timestamps separately
            } as any // Type cast to work around Prisma client generation issue
          });
        
        clips.push(clip);
      }
      
      return clips;
    });

    console.log(`Successfully saved ${savedClips.length} clips`);

    return NextResponse.json(
      { 
        success: true, 
        message: "Clips saved successfully", 
        clips: savedClips,
        count: savedClips.length
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error saving clips:", error);
    return NextResponse.json(
      { error: "Failed to save clips", details: error.message },
      { status: 500 }
    );
  }
}

// GET request handler to fetch clips for a user
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
    const videoId = url.searchParams.get("videoId");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Build the where clause
    const where: any = {
      video: {
        userId: session.user.id
      }
    };

    // If videoId is provided, filter by specific video
    if (videoId) {
      where.videoId = videoId;
    }

    // Count total clips
    const total = await prisma.clip.count({ where });

    // Get clips with pagination
    const clips = await prisma.clip.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit,
      include: {
        video: {
          select: {
            id: true,
            title: true,
            externalJobId: true // Include processing ID from video
          }
        }
      }
    });

    // Add processingId to each clip for frontend URL construction
    const clipsWithProcessingId = clips.map(clip => ({
      ...clip,
      // Use processingId from clip if available, otherwise fallback to video's externalJobId
      processingId: (clip as any).processingId || clip.video?.externalJobId
    }));

    return NextResponse.json({
      clips: clipsWithProcessingId,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error("Error fetching clips:", error);
    return NextResponse.json(
      { error: "Failed to fetch clips", details: error.message },
      { status: 500 }
    );
  }
} 