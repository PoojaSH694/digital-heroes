import { Navbar } from '@/components/ui/Navbar';
import { Hero } from '@/components/homepage/Hero';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { PrizePool } from '@/components/homepage/PrizePool';
import { CharityImpact } from '@/components/homepage/CharityImpact';
import { SubscriptionPlans } from '@/components/homepage/SubscriptionPlans';
import { Testimonials } from '@/components/homepage/Testimonials';
import { Footer } from '@/components/ui/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <PrizePool />
      <CharityImpact />
      <SubscriptionPlans />
      <Testimonials />
      <Footer />
    </main>
  );
}
