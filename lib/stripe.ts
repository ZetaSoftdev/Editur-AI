import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// Type assertion to avoid TypeScript errors with the new model
const prismaAny = prisma as any;

// Initialize with empty values, will be replaced with actual settings
let stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
let stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Create Stripe instance only if we have a valid API key
function createStripeInstance(apiKey: string): Stripe | null {
  if (!apiKey || apiKey.trim() === '') {
    console.warn('Stripe API key is not available, Stripe instance will not be created');
    return null;
  }
  
  try {
    return new Stripe(apiKey, {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
      typescript: true,
    });
  } catch (error) {
    console.error('Failed to create Stripe instance:', error);
    return null;
  }
}

// Create initial Stripe instance (may be null)
export let stripe = createStripeInstance(stripeSecretKey);

export let webhookSecret = stripeWebhookSecret;

// Function to initialize Stripe with database settings
export async function initializeStripe() {
  try {
    // Get the latest app settings
    const settings = await prismaAny.appSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (settings) {
      // Use database settings if available
      if (settings.stripeSecretKey) {
        stripeSecretKey = settings.stripeSecretKey;
        
        // Update the Stripe instance with the new key
        stripe = createStripeInstance(stripeSecretKey);
        
        if (stripe) {
          console.log('Stripe client initialized with database settings');
        }
      }

      if (settings.stripeWebhookSecret) {
        webhookSecret = settings.stripeWebhookSecret;
        console.log('Stripe webhook secret initialized with database settings');
      }
    }
  } catch (error) {
    console.error('Failed to initialize Stripe with database settings:', error);
    console.log('Using environment variables as fallback for Stripe configuration');
  }
}

// Helper function to ensure Stripe is available
export function ensureStripe(): Stripe {
  if (!stripe) {
    throw new Error('Stripe is not initialized. Please check your Stripe configuration.');
  }
  return stripe;
}

// Initialize Stripe on import (but don't fail if it's not available)
if (typeof window === 'undefined') {
  // Only initialize during server-side execution, not during build
  initializeStripe().catch(console.error);
} 