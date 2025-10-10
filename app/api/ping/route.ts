import { NextResponse } from 'next/server';

export async function GET() {
  // Ultra-simple health check that always succeeds
  return NextResponse.json({ 
    ok: true,
    status: 'healthy',
    timestamp: Date.now()
  });
}