# Credit System Redesign Plan

## Current Problems
1. Only tracks input minutes (video upload time)
2. No tracking of output minutes (generated clips)
3. No credit-based system - uses direct minute allocation
4. No additional credit purchase capability
5. Trial allows 5 videos without requiring card details

## Proposed Credit System

### Credit Structure
**Input Credits (Heavy GPU usage)**
- Video upload & processing: 10 credits per minute
- Reason: Heavy GPU processing for video analysis, format conversion, AI processing

**Output Credits (Light GPU usage)**  
- Clip generation/editing: 3 credits per minute
- Reason: Less intensive - mostly cropping, trimming, basic editing

### Trial System
- **3 Free Reels**: Equivalent to ~30 credits (enough for 3 output reels)
- **No card required initially**: Allow users to experience the product
- **Card required after trial**: Must provide payment info to continue

### Credit Plans
**Basic Plan**: 1000 credits/month
- ~100 minutes input processing OR ~333 minutes output processing
- Price: $15/month

**Advanced Plan**: 2500 credits/month  
- ~250 minutes input OR ~833 minutes output
- Price: $29/month

**Expert Plan**: 6000 credits/month
- ~600 minutes input OR ~2000 minutes output  
- Price: $59/month

### Additional Credit Purchase
- **Credit Packs**: 500 credits for $10, 1200 credits for $20, etc.
- **Rollover**: Unused plan credits roll over for 1 month
- **Add-on credits**: Don't expire, used after plan credits

## Database Schema Changes Required

### New Credit Tracking Table
```sql
model CreditTransaction {
  id          String   @id @default(cuid())
  userId      String
  type        CreditType // INPUT, OUTPUT, PURCHASE, TRIAL
  amount      Int      // Positive for addition, negative for usage
  description String   // "Video upload: 5 min", "Clip generation: 2 min"
  videoId     String?  // Reference to related video
  clipId      String?  // Reference to related clip
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([createdAt])
}

enum CreditType {
  INPUT      // Heavy processing (upload/analysis)
  OUTPUT     // Light processing (clip generation)
  PURCHASE   // Bought credits
  TRIAL      // Free trial credits
  PLAN       // Monthly plan allocation
}
```

### Updated User/Subscription Models
```sql
model User {
  // ... existing fields
  trialCreditsUsed     Int     @default(0)
  hasRequiredPayment   Boolean @default(false)
  creditTransactions   CreditTransaction[]
}

model Subscription {
  // ... existing fields
  creditsAllowed       Int     // Monthly credit allocation
  creditsUsed          Int     @default(0)
  additionalCredits    Int     @default(0) // Purchased credits
}
```

## Implementation Phases

### Phase 1: Database Migration
1. Create credit tracking table
2. Migrate existing minute data to credits
3. Add new fields to User/Subscription

### Phase 2: Credit Management System
1. Credit calculation functions
2. Usage tracking middleware
3. Trial credit allocation

### Phase 3: Payment Integration
1. Trial completion detection
2. Payment requirement enforcement
3. Additional credit purchase

### Phase 4: Admin & Monitoring
1. Admin credit management
2. Usage analytics
3. Credit transaction logs

## Credit Calculation Examples

**Example 1: 5-minute video upload**
- Credits deducted: 5 × 10 = 50 credits
- Generates 3 clips of 30 seconds each
- Additional credits: 3 × 0.5 × 3 = 4.5 ≈ 5 credits
- **Total: 55 credits**

**Example 2: Trial user (30 credits)**
- Can upload 3 minutes of video (30 credits)
- OR generate 10 minutes of clips (30 credits)  
- OR mixed usage

**Example 3: Basic plan user (1000 credits)**
- Heavy usage: ~18 × 5-minute videos (900 credits) + some editing
- Light usage: ~90 × 3-minute clips (810 credits) + some uploads
- Balanced: ~10 uploads (500 credits) + ~50 clips (500 credits)