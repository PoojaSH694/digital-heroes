"use client";

import { motion } from 'framer-motion';
import { UserPlus, Trophy, Heart } from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "Subscribe",
    description: "Join our community with a monthly or yearly plan. Your journey starts here.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Enter Scores",
    description: "Input your 5 best Stableford scores from the month. These become your lucky numbers.",
    icon: Trophy,
  },
  {
    number: "03",
    title: "Win & Support",
    description: "Enter the monthly draw to win huge prizes. 10% goes directly to your chosen charity.",
    icon: Heart,
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">How It Works</h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute -top-10 -left-6 text-8xl font-serif font-black text-gray-50 group-hover:text-accent/10 transition-colors duration-500">
                {step.number}
              </div>
              <div className="relative p-8 rounded-2xl bg-[#F7F5F0] border border-gray-100 group-hover:border-accent/30 transition-all duration-300 group-hover:shadow-xl">
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
