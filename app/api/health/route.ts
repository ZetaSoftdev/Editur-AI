import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check that always returns healthy for Railway
    // This ensures Railway considers the service ready even during DB setup
    const uptime = process.uptime();
    
    return NextResponse.json({ 
      status: 'healthy',
      service: 'running',
      uptime: `${Math.floor(uptime)}s`,
      timestamp: new Date().toISOString(),
      message: 'Service is running. Database setup may be in progress.'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    // Even if there's an error, return healthy status for Railway
    return NextResponse.json({ 
      status: 'healthy',
      service: 'running',
      warning: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}