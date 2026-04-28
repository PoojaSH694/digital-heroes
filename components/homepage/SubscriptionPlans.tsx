"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    id: 'monthly',
    name: "Monthly Plan",
    price: "£19.99",
    period: "per month",
    features: [
      "1 Monthly Draw Entry",
      "Rolling 5-Score Tracking",
      "10% Charity Contribution",
      "Access to Winner Dashboard",
      "Cancel Anytime"
    ],
    recommended: false
  },
  {
    id: 'yearly',
    name: "Yearly Plan",
    price: "£199.00",
    period: "per year",
    savings: "Save £40.88 annually",
    features: [
      "12 Monthly Draw Entries",
      "Rolling 5-Score Tracking",
      "12-Month Impact for Charity",
      "Exclusive Annual Rewards",
      "Best Value Option"
    ],
    recommended: true
  }
];

export const SubscriptionPlans = () => {
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Choose Your Plan</h2>
          <p className="text-gray-600 text-lg">Start your journey today and make a difference.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={cn(
                "p-10 rounded-[32px] border transition-all duration-500",
                plan.recommended
                  ? "bg-primary text-white border-primary shadow-2xl scale-105 z-10"
                  : "bg-white text-primary border-gray-100 shadow-sm"
              )}
            >
              {plan.recommended && (
                <span className="bg-accent text-primary text-[10px] uppercase font-black px-4 py-1 rounded-full mb-6 inline-block tracking-widest">
                  Highly Recommended
                </span>
              )}
              <h3 className="text-2xl font-bold mb-4 font-serif">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className="opacity-60 ml-2">{plan.period}</span>
                {plan.savings && (
                  <p className="text-accent text-sm mt-2 font-medium">{plan.savings}</p>
                )}
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center",
                      plan.recommended ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary"
                    )}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm opacity-80">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/signup"
                className={cn(
                  "block text-center py-4 rounded-xl font-bold transition-all active:scale-95",
                  plan.recommended
                    ? "bg-accent text-primary hover:bg-accent-light"
                    : "bg-primary text-white hover:bg-primary/90"
                )}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
