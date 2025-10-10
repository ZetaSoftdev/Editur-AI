# Admin User Setup and Database Seeding for Railway

## Issue: Admin user not found in production

The admin user (`admin@admin.com`) is created by the database seed script, but it might not have run properly on Railway deployment.

## Solution: Multiple approaches to create the admin user

### Method 1: Automatic API Seeding (Recommended)

After your application is deployed to Railway, call these endpoints:

#### 1. Check current status:
```bash
GET https://your-railway-domain.com/api/admin/status
```

#### 2. Create admin user only:
```bash
POST https://your-railway-domain.com/api/admin/setup
```

#### 3. Full database seeding (creates admin + plans + trial user):
```bash
POST https://your-railway-domain.com/api/admin/seed
```

### Method 2: Railway CLI Manual Seeding

If you have Railway CLI installed:

```bash
# Connect to your Railway project
railway login
railway link

# Run the seed script manually
railway run npm run seed

# Or create admin user specifically
railway run npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

### Method 3: Database Direct Access

If you can access the Railway database directly:

```sql
-- Insert admin user manually
INSERT INTO "User" (
  id, email, name, password, role, "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'admin@admin.com', 
  'admin',
  '$2a$10$8K1p/a0dUrziVHDuq8XF2uJZjKUiWYdeHR8CQf4KjBZQNqQLQ4qZG', -- hashed '123456789'
  'ADMIN',
  NOW(),
  NOW()
);
```

## Admin Credentials

Once created, you can login with:
- **Email**: `admin@admin.com`
- **Password**: `123456789`
- **Role**: ADMIN

## Troubleshooting

### If seeding fails:

1. **Check database connection**:
   ```bash
   railway run npx prisma db pull
   ```

2. **Reset and redeploy migrations**:
   ```bash
   railway run npx prisma migrate reset --force
   railway run npx prisma migrate deploy
   ```

3. **Manual seed**:
   ```bash
   railway run npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
   ```

### Check environment variables in Railway:

Ensure these are set:
- `DATABASE_URL` (automatically provided by Railway PostgreSQL)
- `NEXTAUTH_SECRET`
- `NODE_ENV=production`

## API Endpoints Created

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/status` | GET | Check admin user and database status |
| `/api/admin/setup` | POST | Create admin user only |
| `/api/admin/seed` | POST | Full database seeding |
| `/api/health` | GET | Basic health check |

## Expected Response

After successful seeding, `/api/admin/status` should return:

```json
{
  "status": "healthy",
  "database": "connected",
  "adminUser": {
    "exists": true,
    "id": "...",
    "email": "admin@admin.com",
    "name": "admin",
    "role": "ADMIN",
    "createdAt": "..."
  },
  "stats": {
    "totalUsers": 2,
    "subscriptionPlans": 3,
    "creditTransactions": 1
  }
}
```

## Railway Deployment Configuration

The updated `railway.json` ensures:
- Proper build command with Prisma generation
- Database setup script runs on deployment
- Extended healthcheck timeout for setup
- Proper error handling and retries

## Files Updated

- `scripts/setup-db.sh` - Enhanced Railway setup script
- `railway.json` - Improved build and deploy configuration
- `app/api/admin/setup/route.ts` - Admin user creation endpoint
- `app/api/admin/seed/route.ts` - Full database seeding endpoint  
- `app/api/admin/status/route.ts` - Status check endpoint