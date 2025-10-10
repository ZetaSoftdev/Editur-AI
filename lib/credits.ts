import { prisma } from '@/lib/prisma';
import { CreditType } from '@prisma/client';

// Credit costs configuration
export const CREDIT_COSTS = {
  INPUT_PER_MINUTE: 10,  // Heavy GPU processing
  OUTPUT_PER_MINUTE: 3,  // Light processing
  TRIAL_CREDITS: 30,     // Enough for 3 reels
} as const;

// Credit calculation helpers
export function calculateInputCredits(durationInSeconds: number): number {
  const minutes = Math.ceil(durationInSeconds / 60);
  return minutes * CREDIT_COSTS.INPUT_PER_MINUTE;
}

export function calculateOutputCredits(durationInSeconds: number): number {
  const minutes = Math.ceil(durationInSeconds / 60);
  return minutes * CREDIT_COSTS.OUTPUT_PER_MINUTE;
}

// Credit balance calculation
export async function getUserCreditBalance(userId: string): Promise<{
  totalCredits: number;
  trialCredits: number;
  planCredits: number;
  additionalCredits: number;
  hasActiveSubscription: boolean;
}> {
  try {
    // Get user with subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        subscription: true,
        creditTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 100 // Recent transactions for calculation
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate credits from transactions
    let trialCredits = 0;
    let planCredits = 0;
    let additionalCredits = 0;

    for (const transaction of user.creditTransactions) {
      switch (transaction.type) {
        case 'TRIAL':
          trialCredits += transaction.amount;
          break;
        case 'PLAN':
          planCredits += transaction.amount;
          break;
        case 'PURCHASE':
          additionalCredits += transaction.amount;
          break;
        case 'INPUT':
        case 'OUTPUT':
          // These should be negative amounts (usage)
          if (trialCredits > 0) {
            const deduction = Math.min(Math.abs(transaction.amount), trialCredits);
            trialCredits -= deduction;
            const remaining = Math.abs(transaction.amount) - deduction;
            if (remaining > 0) {
              if (planCredits > 0) {
                const planDeduction = Math.min(remaining, planCredits);
                planCredits -= planDeduction;
                const stillRemaining = remaining - planDeduction;
                if (stillRemaining > 0) {
                  additionalCredits -= stillRemaining;
                }
              } else {
                additionalCredits -= remaining;
              }
            }
          } else if (planCredits > 0) {
            const deduction = Math.min(Math.abs(transaction.amount), planCredits);
            planCredits -= deduction;
            const remaining = Math.abs(transaction.amount) - deduction;
            if (remaining > 0) {
              additionalCredits -= remaining;
            }
          } else {
            additionalCredits -= Math.abs(transaction.amount);
          }
          break;
      }
    }

    const totalCredits = Math.max(0, trialCredits + planCredits + additionalCredits);
    const hasActiveSubscription = user.isSubscribed && 
      user.stripeCurrentPeriodEnd && 
      user.stripeCurrentPeriodEnd > new Date();

    return {
      totalCredits,
      trialCredits: Math.max(0, trialCredits),
      planCredits: Math.max(0, planCredits),
      additionalCredits: Math.max(0, additionalCredits),
      hasActiveSubscription
    };
  } catch (error) {
    console.error('Error calculating user credit balance:', error);
    throw error;
  }
}

// Credit usage tracking
export async function deductCredits(
  userId: string,
  amount: number,
  type: CreditType,
  description: string,
  videoId?: string,
  clipId?: string
): Promise<{ success: boolean; remainingCredits: number; error?: string }> {
  try {
    const balance = await getUserCreditBalance(userId);
    
    if (balance.totalCredits < amount) {
      return {
        success: false,
        remainingCredits: balance.totalCredits,
        error: `Insufficient credits. Required: ${amount}, Available: ${balance.totalCredits}`
      };
    }

    // Record the credit usage
    await prisma.creditTransaction.create({
      data: {
        userId,
        type,
        amount: -amount, // Negative for usage
        description,
        videoId,
        clipId,
        createdAt: new Date()
      }
    });

    // Update subscription credits used if applicable
    if (balance.hasActiveSubscription) {
      await prisma.subscription.updateMany({
        where: { userId },
        data: {
          creditsUsed: {
            increment: amount
          }
        }
      });
    }

    const newBalance = await getUserCreditBalance(userId);
    return {
      success: true,
      remainingCredits: newBalance.totalCredits
    };
  } catch (error) {
    console.error('Error deducting credits:', error);
    return {
      success: false,
      remainingCredits: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Credit allocation (for plans, purchases, etc.)
export async function addCredits(
  userId: string,
  amount: number,
  type: CreditType,
  description: string
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  try {
    // Record the credit addition
    await prisma.creditTransaction.create({
      data: {
        userId,
        type,
        amount, // Positive for addition
        description,
        createdAt: new Date()
      }
    });

    // Update subscription additional credits if it's a purchase
    if (type === 'PURCHASE') {
      await prisma.subscription.updateMany({
        where: { userId },
        data: {
          additionalCredits: {
            increment: amount
          }
        }
      });
    }

    const balance = await getUserCreditBalance(userId);
    return {
      success: true,
      newBalance: balance.totalCredits
    };
  } catch (error) {
    console.error('Error adding credits:', error);
    return {
      success: false,
      newBalance: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Trial credit management
export async function allocateTrialCredits(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { creditTransactions: true }
    });

    if (!user) return false;

    // Check if user already has trial credits
    const hasTrialCredits = user.creditTransactions.some(
      t => t.type === 'TRIAL'
    );

    if (hasTrialCredits) return false; // Already allocated

    // Allocate trial credits
    await addCredits(
      userId, 
      CREDIT_COSTS.TRIAL_CREDITS, 
      'TRIAL', 
      'Initial trial credits (3 free reels)'
    );

    return true;
  } catch (error) {
    console.error('Error allocating trial credits:', error);
    return false;
  }
}

// Check if user needs payment info
export async function checkPaymentRequired(userId: string): Promise<boolean> {
  try {
    const balance = await getUserCreditBalance(userId);
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) return true;

    // If user has active subscription, no payment required
    if (balance.hasActiveSubscription) return false;

    // If user has trial credits remaining, no payment required
    if (balance.trialCredits > 0) return false;

    // If user has already provided payment info, it's optional
    if (user.hasRequiredPayment) return false;

    // Otherwise, payment is required
    return true;
  } catch (error) {
    console.error('Error checking payment requirement:', error);
    return true;
  }
}

// Get credit usage statistics
export async function getCreditUsageStats(userId: string, days: number = 30) {
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const transactions = await prisma.creditTransaction.findMany({
      where: {
        userId,
        createdAt: {
          gte: since
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const stats = {
      totalUsed: 0,
      inputCredits: 0,
      outputCredits: 0,
      byDay: {} as Record<string, number>
    };

    for (const transaction of transactions) {
      if (transaction.amount < 0) { // Usage transactions
        const amount = Math.abs(transaction.amount);
        stats.totalUsed += amount;
        
        if (transaction.type === 'INPUT') {
          stats.inputCredits += amount;
        } else if (transaction.type === 'OUTPUT') {
          stats.outputCredits += amount;
        }

        const day = transaction.createdAt.toISOString().split('T')[0];
        stats.byDay[day] = (stats.byDay[day] || 0) + amount;
      }
    }

    return stats;
  } catch (error) {
    console.error('Error getting credit usage stats:', error);
    return null;
  }
}