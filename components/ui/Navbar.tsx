"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
      isHome ? "bg-transparent" : "bg-white/80 backdrop-blur-md border-b border-gray-100"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <span className="text-accent italic font-serif">Digital</span>Heroes
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/how-it-works" className="hover:text-accent transition-colors">How it Works</Link>
          <Link href="/charities" className="hover:text-accent transition-colors">Charities</Link>
          <Link href="/login" className="hover:text-accent transition-colors">Login</Link>
          <Link href="/signup" className="btn-primary py-2 px-6">
            Join Now
          </Link>
        </div>
      </div>
    </nav>
  );
};
