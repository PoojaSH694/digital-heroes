"use client";

import { motion } from 'framer-motion';
import { Award, Star, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

const tiers = [
  {
    title: "5-Number Match",
    percent: "40%",
    subtitle: "The Jackpot",
    description: "Rolls over if not won. Huge potential for life-changing wins.",
    icon: Star,
    color: "bg-accent",
    textColor: "text-white",
    rank: "🥇"
  },
  {
    title: "4-Number Match",
    percent: "35%",
    subtitle: "Runner Up",
    description: "Substantial prize pool shared among all 4-number matches.",
    icon: Award,
    color: "bg-primary",
    textColor: "text-white",
    rank: "🥈"
  },
  {
    title: "3-Number Match",
    percent: "25%",
    subtitle: "Supporter Tier",
    description: "Consistent wins for many players every single month.",
    icon: Medal,
    color: "bg-surface",
    textColor: "text-primary",
    rank: "🥉"
  }
];

export const PrizePool = () => {
  return (
    <section className="py-24 bg-primary px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Monthly Prize Pool</h2>
            <p className="text-gray-400 text-lg">Predict your scores. Match the draw. Win your share.</p>
          </div>
          <div className="bg-accent/10 border border-accent/20 px-8 py-4 rounded-2xl">
            <span className="text-accent text-sm font-semibold uppercase tracking-widest block mb-1">Estimated Pool</span>
            <span className="text-3xl font-bold text-accent font-serif">£12,450.00</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className={cn(
                "p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between h-[400px]",
                tier.color,
                tier.textColor
              )}
            >
              <div className="absolute top-4 right-6 text-6xl opacity-20">{tier.rank}</div>
              <div>
                <tier.icon size={48} className="mb-6 opacity-80" />
                <h3 className="text-3xl font-bold mb-2">{tier.title}</h3>
                <p className="opacity-70 mb-6">{tier.subtitle}</p>
                <div className="text-5xl font-serif font-black mb-4">
                  {tier.percent}
                  <span className="text-sm font-sans font-normal opacity-60 ml-2">of pool</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed opacity-80 border-t border-white/10 pt-6">
                {tier.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
