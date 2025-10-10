import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seeding process...')

  // Clean up existing data if needed
  await prisma.subscriptionPlan.deleteMany({})
  
  console.log('Creating subscription plans...')
  
  // Create subscription plans
  await prisma.subscriptionPlan.createMany({
    data: [
      {
        id: "01",
        name: "Basic",
        description: "Add professional quality subtitles to your shorts, very quickly",
        monthlyPrice: 15,
        yearlyPrice: 19,
        features: [
          '1000 credits per month',
          'Input processing: ~100 minutes',
          'Output generation: ~330 minutes', 
          'Cropping from long videos',
          '300 MB/video',
          'Import music and sound effects',
          'Import your own video',
          'Captions with styling',
        ],
        minutesAllowed: 100, // Legacy field
        creditsAllowed: 1000, // New credit system
        maxFileSize: 300,
        maxConcurrentRequests: 2,
        storageDuration: 7,
        isActive: true
      },
      {
        id: "02",
        name: "Advanced",
        description: "Turn your long-form videos into multiple shorts with a few clicks",
        monthlyPrice: 23,
        yearlyPrice: 29,
        features: [
          '2500 credits per month',
          'Input processing: ~250 minutes',
          'Output generation: ~830 minutes',
          'Auto-Crop to vertical format (9:16)',
          '1GB and 2 hours / long video',
          'Import long video by local file or YouTube link',
          'Faceless video: 10 per week',
        ],
        minutesAllowed: 200, // Legacy field
        creditsAllowed: 2500, // New credit system
        maxFileSize: 1000,
        maxConcurrentRequests: 5,
        storageDuration: 14,
        isActive: true
      },
      {
        id: "03",
        name: "Expert",
        description: "Create, plan, publish and save incredible amounts of time",
        monthlyPrice: 47,
        yearlyPrice: 59,
        features: [
          '6000 credits per month',
          'Input processing: ~600 minutes',
          'Output generation: ~2000 minutes',
          'Program & Publish to all platforms (YouTube, TikTok, Instagram, etc)',
          'Analyze content performance',
          'Faceless video: 30 per week',
          'Priority support',
        ],
        minutesAllowed: 500, // Legacy field
        creditsAllowed: 6000, // New credit system
        maxFileSize: 2000,
        maxConcurrentRequests: 10,
        storageDuration: 30,
        isActive: true
      }
    ]
  })

  // Create admin user
  console.log('Creating admin user...')
  
  // Hash the password
  const hashedPassword = await bcrypt.hash('123456789', 10)
  
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: 'admin@admin.com'
    }
  })
  
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: 'admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'ADMIN',
        updatedAt: new Date(),
        createdAt: new Date()
      }
    })
    console.log('Admin user created successfully')
  } else {
    console.log('Admin user already exists')
  }

  // Create a test trial user for demonstration
  console.log('Creating test trial user...')
  
  const existingTrialUser = await prisma.user.findUnique({
    where: {
      email: 'trial@test.com'
    }
  })
  
  if (!existingTrialUser) {
    const trialUser = await prisma.user.create({
      data: {
        name: 'Trial User',
        email: 'trial@test.com',
        password: await bcrypt.hash('password123', 10),
        role: 'USER',
        trialCreditsUsed: 0,
        hasRequiredPayment: false,
        updatedAt: new Date(),
        createdAt: new Date()
      }
    })
    
    // Give trial user 30 trial credits
    await prisma.creditTransaction.create({
      data: {
        userId: trialUser.id,
        type: 'TRIAL',
        amount: 30,
        description: 'Initial trial credits (3 free reels)',
        createdAt: new Date()
      }
    })
    
    console.log('Trial user created with 30 trial credits')
  } else {
    console.log('Trial user already exists')
  }

  console.log('Seeding completed successfully')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 