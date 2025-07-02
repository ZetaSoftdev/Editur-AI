import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Get external API base URL from environment (same logic as other endpoints)
    const externalApiBaseUrl = process.env.EXTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8000';
    
    console.log("🧪 Testing external API connectivity:");
    console.log(`  - EXTERNAL_API_BASE_URL: ${process.env.EXTERNAL_API_BASE_URL}`);
    console.log(`  - NEXT_PUBLIC_API_ENDPOINT: ${process.env.NEXT_PUBLIC_API_ENDPOINT}`);
    console.log(`  - Final URL: ${externalApiBaseUrl}`);

    // Test a simple health check to the external API
    const testUrl = `${externalApiBaseUrl}/health`;
    
    try {
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log(`🌐 External API health check: ${response.status} ${response.statusText}`);
      
      const responseText = await response.text();
      console.log(`📝 External API response: ${responseText}`);
      
      return NextResponse.json({
        success: true,
        externalApiBaseUrl,
        testUrl,
        externalApiStatus: response.status,
        externalApiResponse: responseText,
        environment: {
          EXTERNAL_API_BASE_URL: process.env.EXTERNAL_API_BASE_URL,
          NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT
        }
      });
      
    } catch (fetchError: any) {
      console.error("❌ External API fetch error:", fetchError);
      
      return NextResponse.json({
        success: false,
        error: "Failed to connect to external API",
        externalApiBaseUrl,
        testUrl,
        details: fetchError.message,
        environment: {
          EXTERNAL_API_BASE_URL: process.env.EXTERNAL_API_BASE_URL,
          NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT
        }
      });
    }

  } catch (error: any) {
    console.error("❌ Test endpoint error:", error);
    return NextResponse.json(
      { error: "Test endpoint failed", details: error.message },
      { status: 500 }
    );
  }
} 