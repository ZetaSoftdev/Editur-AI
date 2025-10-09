# Database Migration Troubleshooting for Railway

## Issue: P3009 Migration Error

When you see this error:
```
Error: P3009
migrate found failed migrations in the target database, new migrations will not be applied.
The `20250625092414_initial` migration started at 2025-10-09 11:24:46.382310 UTC failed
```

## Solution Options:

### Option 1: Automatic Resolution (Recommended)
The project now includes an automated database setup script that will handle this automatically during Railway deployment.

### Option 2: Manual Resolution via Railway CLI

If you need to manually resolve this issue:

1. **Connect to Railway database:**
   ```bash
   railway login
   railway connect
   ```

2. **Reset migration state:**
   ```bash
   railway run npx prisma migrate reset --force --skip-seed
   ```

3. **Deploy fresh migrations:**
   ```bash
   railway run npx prisma migrate deploy
   ```

4. **Seed the database:**
   ```bash
   railway run npm run seed
   ```

### Option 3: Database Reset (Nuclear Option)

If the above doesn't work, you can completely reset the Railway database:

1. Go to Railway dashboard
2. Navigate to your project
3. Go to the PostgreSQL service
4. In the "Data" tab, click "Reset Database"
5. Redeploy your application

## Prevention

The `railway.json` and `scripts/setup-db.sh` files now ensure that:
- Failed migration states are automatically cleared
- Fresh migrations are applied cleanly
- Database is properly seeded after migration

## Environment Variables Required

Ensure these are set in Railway:
- `DATABASE_URL` (automatically provided by Railway PostgreSQL)
- `NEXTAUTH_SECRET`
- `STRIPE_SECRET_KEY` (if using Stripe)
- Any other environment variables your app needs