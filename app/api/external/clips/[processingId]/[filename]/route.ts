import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { processingId: string; filename: string } }
) {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { processingId, filename } = params;
    
    // Get external API base URL from environment (fallback to same as frontend)
    const externalApiBaseUrl = process.env.EXTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8000';
    
    console.log(`🌐 Using External API Base URL: ${externalApiBaseUrl}`);
    
    if (!externalApiBaseUrl) {
      console.error("❌ External API base URL not configured");
      return NextResponse.json(
        { error: "External API not configured" },
        { status: 500 }
      );
    }
    
    // URL encode the filename to handle spaces and special characters
    const encodedFilename = encodeURIComponent(filename);
    
    // Construct the external API URL for clip download
    const externalApiUrl = `${externalApiBaseUrl}/api/download/clips/${processingId}/${encodedFilename}`;
    
    console.log(`📹 Proxying clip download:`);
    console.log(`  - Original filename: ${filename}`);
    console.log(`  - Encoded filename: ${encodedFilename}`);
    console.log(`  - External API Base URL: ${externalApiBaseUrl}`);
    console.log(`  - Full URL: ${externalApiUrl}`);

    // Fetch the clip from the external API
    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'video/*'
      }
    });

    if (!response.ok) {
      console.error(`❌ External API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: "Failed to fetch clip from external API" },
        { status: response.status }
      );
    }

    // Get the video content
    const videoBuffer = await response.arrayBuffer();
    
    // Return the video with appropriate headers
    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'video/mp4',
        'Content-Length': response.headers.get('Content-Length') || videoBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Content-Disposition': `inline; filename="${filename}"`
      }
    });

  } catch (error: any) {
    console.error("Error proxying clip download:", error);
    return NextResponse.json(
      { error: "Failed to proxy clip download", details: error.message },
      { status: 500 }
    );
  }
} 