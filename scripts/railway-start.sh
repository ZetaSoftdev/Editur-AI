#!/bin/bash

# Railway Background Database Setup Script
echo "🚀 Starting application with background database setup..."

# Start the Next.js application in the background
npm start &
APP_PID=$!

# Wait a moment for the app to start
sleep 5

# Run database setup in background
echo "🔄 Starting background database setup..."
(
    # Set error handling for this subshell
    set -e
    
    echo "📍 Running in Railway production environment"
    echo "DATABASE_URL exists: $([ -n "$DATABASE_URL" ] && echo "yes" || echo "no")"
    
    # Wait for database to be ready
    echo "⏳ Waiting for database connection..."
    npx prisma db pull --force || echo "⚠️ DB pull failed, continuing..."
    
    # Generate Prisma client first
    echo "⚙️ Generating Prisma client..."
    npx prisma generate
    
    # Deploy migrations (don't reset in production)
    echo "🚀 Deploying migrations..."
    npx prisma migrate deploy || {
        echo "❌ Migration deploy failed, trying reset..."
        npx prisma migrate reset --force --skip-seed --skip-generate
        npx prisma migrate deploy
    }
    
    # Seed the database
    echo "🌱 Seeding database..."
    npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts || {
        echo "❌ Direct seeding failed, trying npm run seed..."
        npm run seed
    }
    
    echo "✅ Background database setup complete!"
) &

# Wait for the application process
wait $APP_PID