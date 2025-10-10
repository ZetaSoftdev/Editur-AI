import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@admin.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    // Count total users
    const userCount = await prisma.user.count();
    
    // Count subscription plans
    const planCount = await prisma.subscriptionPlan.count();
    
    // Check for credit transactions
    const creditTransactionCount = await prisma.creditTransaction.count();

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      adminUser: adminUser ? {
        exists: true,
        ...adminUser
      } : {
        exists: false,
        message: 'Admin user not found - run /api/admin/setup to create'
      },
      stats: {
        totalUsers: userCount,
        subscriptionPlans: planCount,
        creditTransactions: creditTransactionCount
      },
      setupInstructions: {
        createAdmin: 'POST /api/admin/setup',
        seedDatabase: 'POST /api/admin/seed',
        checkStatus: 'GET /api/admin/status'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Admin status check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
      suggestions: [
        'Check DATABASE_URL environment variable',
        'Ensure database is accessible',
        'Run database migrations: npx prisma migrate deploy',
        'Seed database: POST /api/admin/seed'
      ],
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}