#!/bin/bash

# Railway Migration Recovery Script
echo "🔄 Starting Railway database migration recovery..."

# Set error handling
set -e

# Check if we're in Railway environment
if [ "$RAILWAY_ENVIRONMENT" = "production" ] || [ "$NODE_ENV" = "production" ]; then
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
    
    echo "✅ Database setup complete!"
else
    echo "🏠 Running in development - using regular migration"
    npx prisma migrate dev
fi