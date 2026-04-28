"use client";

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: "James Anderson",
    location: "Surrey, UK",
    text: "Won £400 last March and my charity got £18 too — love this platform. It's so much more meaningful than just playing for myself.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
  },
  {
    name: "Sarah Miller",
    location: "Manchester, UK",
    text: "The interface is beautiful and entering my scores takes seconds. Plus, knowing my local charity benefits is a huge win.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    name: "David Thorne",
    location: "Edinburgh, UK",
    text: "I've been a member for 6 months. It has actually improved my game because I'm more focused on my Stableford scores for the draw!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-surface px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">What Our Members Say</h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#F7F5F0] p-10 rounded-[32px] relative group hover:bg-primary transition-all duration-500 hover:scale-105"
            >
              <Quote size={40} className="text-accent mb-6 opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              <p className="text-gray-600 mb-8 italic group-hover:text-white transition-colors">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4 border-t border-gray-200 group-hover:border-white/10 pt-6">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full bg-white border-2 border-accent" />
                <div>
                  <h4 className="font-bold text-primary group-hover:text-white transition-colors">{t.name}</h4>
                  <p className="text-xs text-gray-500 group-hover:text-accent font-medium leading-none">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
