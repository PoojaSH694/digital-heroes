import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    name: 'Monthly',
    amount: 1999, // £19.99
  },
  yearly: {
    priceId: process.env.STRIPE_YEARLY_PRICE_ID!,
    name: 'Yearly',
    amount: 19900, // £199.00
  }
};
