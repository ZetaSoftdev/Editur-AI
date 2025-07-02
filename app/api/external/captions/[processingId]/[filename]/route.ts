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
    
    // Construct the external API URL for captions download
    const externalApiUrl = `${externalApiBaseUrl}/api/download/captions/${processingId}/${encodedFilename}.json`;
    
    console.log(`📝 Proxying captions download:`);
    console.log(`  - Original filename: ${filename}`);
    console.log(`  - Encoded filename: ${encodedFilename}`);
    console.log(`  - External API Base URL: ${externalApiBaseUrl}`);
    console.log(`  - Full URL: ${externalApiUrl}`);

    // Fetch the captions from the external API
    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`❌ External API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: "Failed to fetch captions from external API" },
        { status: response.status }
      );
    }

    // Get the captions content
    const captionsData = await response.json();
    
    // Return the captions data with appropriate headers
    return NextResponse.json(captionsData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      }
    });

  } catch (error: any) {
    console.error("Error proxying captions download:", error);
    return NextResponse.json(
      { error: "Failed to proxy captions download", details: error.message },
      { status: 500 }
    );
  }
} 