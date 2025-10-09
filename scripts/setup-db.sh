#!/bin/bash

# Railway Migration Recovery Script
echo "🔄 Starting Railway database migration recovery..."

# Check if we're in production (Railway sets NODE_ENV)
if [ "$RAILWAY_ENVIRONMENT" = "production" ]; then
    echo "📍 Running in Railway production environment"
    
    # First try to reset migrations (this will clear failed migration state)
    echo "🗑️ Attempting to reset migration state..."
    npx prisma migrate reset --force --skip-seed --skip-generate
    
    # Deploy fresh migrations
    echo "🚀 Deploying fresh migrations..."
    npx prisma migrate deploy
    
    # Generate Prisma client
    echo "⚙️ Generating Prisma client..."
    npx prisma generate
    
    # Seed the database
    echo "🌱 Seeding database..."
    npm run seed
    
    echo "✅ Database setup complete!"
else
    echo "🏠 Running in development - using regular migration"
    npx prisma migrate dev
fi