import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: 'admin@admin.com'
      }
    });
    
    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists',
        user: {
          id: existingAdmin.id,
          email: existingAdmin.email,
          name: existingAdmin.name,
          role: existingAdmin.role
        }
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('123456789', 10);
    
    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'ADMIN',
        updatedAt: new Date(),
        createdAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    });
    
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create admin user',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check if admin user exists and return status
    const adminUser = await prisma.user.findUnique({
      where: {
        email: 'admin@admin.com'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    if (adminUser) {
      return NextResponse.json({
        exists: true,
        user: adminUser
      });
    } else {
      return NextResponse.json({
        exists: false,
        message: 'Admin user not found'
      });
    }
    
  } catch (error: any) {
    console.error('Error checking admin user:', error);
    return NextResponse.json(
      { 
        exists: false, 
        error: 'Failed to check admin user',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}