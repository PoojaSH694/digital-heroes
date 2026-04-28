import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { 
  UserPlus, 
  Trophy, 
  Heart, 
  CreditCard,
  Target,
  Gift
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      title: "Step 1: Join the Community",
      desc: "Choose between our monthly or yearly subscription plans. Every subscription includes entry into our massive monthly prize draws and covers all your performance tracking features.",
      icon: UserPlus,
      number: "01"
    },
    {
      title: "Step 2: Log Your Progress",
      desc: "Post your 5 best Stableford scores from any certified golf course. We keep record of your rolling history, ensuring you're always ready for the next event.",
      icon: Target,
      number: "02"
    },
    {
      title: "Step 3: Enter the Draw",
      desc: "Your latest 5 scores automatically become your entry numbers for the monthly draw. We generate or simulate numbers, and matches win substantial cash prizes.",
      icon: Trophy,
      number: "03"
    },
    {
      title: "Step 4: Make an Impact",
      desc: "10% of your subscription goes directly to the charity you selected. When you win, they win too. It's golf with a higher purpose.",
      icon: Heart,
      number: "04"
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <header className="pt-40 pb-24 bg-[#F7F5F0] px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-accent font-black uppercase tracking-widest text-sm mb-4 block">The Process</span>
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-8">How it <span className="italic font-serif">Works</span></h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            The Digital Heroes platform bridges the gap between individual sports performance, winning huge prizes, and charitable giving.
          </p>
        </div>
      </header>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-32">
          {steps.map((step, i) => (
            <div key={i} className={`flex flex-col md:items-center gap-10 md:gap-20 ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
              <div className="flex-1">
                <div className="w-16 h-16 bg-primary text-accent rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                  <step.icon size={28} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">{step.title}</h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  {step.desc}
                </p>
              </div>
              
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="text-[200px] font-black text-gray-50 font-serif leading-none select-none">
                    {step.number}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-2 border-accent/20 rounded-[40px] rotate-12 absolute" />
                    <div className="w-64 h-64 border-2 border-primary/5 rounded-[40px] -rotate-6 absolute" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-4xl font-bold mb-8">Ready to start tracking?</h3>
          <p className="text-gray-400 mb-12 text-lg">Join thousands of golfers who are winning prizes and changing lives one score at a time.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" className="btn-primary px-12 py-4">Join Now</Link>
            <Link href="/charities" className="btn-ghost border-white/20 text-white hover:bg-white/10 px-12 py-4">Explore Charities</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

import Link from 'next/link';
