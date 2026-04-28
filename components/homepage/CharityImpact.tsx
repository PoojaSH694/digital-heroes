"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const charities = [
  {
    name: "Heart For Children",
    description: "Supporting pediatric heart research and providing care for families across the UK.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&h=250&auto=format&fit=crop",
    featured: true
  },
  {
    name: "Green Fairways",
    description: "Environmental conservation focusing on reforestation and local community gardens.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&h=250&auto=format&fit=crop",
    featured: false
  },
  {
    name: "Youth Sports Fund",
    description: "Bringing sports equipment and coaching to underprivileged communities.",
    image: "https://images.unsplash.com/photo-1510531704581-5b2870972060?q=80&w=400&h=250&auto=format&fit=crop",
    featured: false
  }
];

export const CharityImpact = () => {
  return (
    <section className="py-24 bg-[#F7F5F0] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-accent font-semibold uppercase tracking-widest text-sm mb-4 block"
          >
            Play with Purpose
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">10% of Every Subscription <br /> Goes to Charity</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-10">
            We believe in giving back. Every month, a portion of your subscription is sent directly to a charity of your choice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {charities.map((charity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={charity.image} 
                  alt={charity.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                {charity.featured && (
                  <span className="absolute top-4 left-4 bg-accent text-[#0A2E1E] text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-3">{charity.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {charity.description}
                  </p>
                </div>
                <Link href="/charities" className="text-accent font-bold flex items-center gap-2 hover:gap-3 transition-all group-hover:text-primary">
                  Learn More <span>&rarr;</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/charities" className="btn-primary px-12">
            Choose Your Charity &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};
