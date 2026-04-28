"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-primary px-6">
      {/* Animated Background Numbers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        {mounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
            animate={{
              y: '-20vh',
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
            className="absolute text-accent font-serif text-4xl font-bold"
          >
            {Math.floor(Math.random() * 45) + 1}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Play Golf. Win Prizes. <br />
          <span className="text-accent italic">Change Lives.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light"
        >
          Enter your scores each month. Join the draw. <br />
          Support the charity you love.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup" className="btn-primary w-full sm:w-auto px-8 py-4 text-lg">
            Subscribe Now
          </Link>
          <Link href="/how-it-works" className="btn-ghost border-white text-white hover:bg-white/10 w-full sm:w-auto px-8 py-4 text-lg">
            How it Works
          </Link>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2">
          <div className="w-1 h-2 bg-white/40 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};
