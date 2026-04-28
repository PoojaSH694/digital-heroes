import { createClient } from '@/lib/supabase/server';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  CreditCard, 
  Calendar, 
  Trophy, 
  Heart, 
  Plus,
  Ticket
} from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return null;

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, charities(name)')
    .eq('id', session.user.id)
    .single();

  // Fetch last 5 scores
  const { data: scores } = await supabase
    .from('golf_scores')
    .select('*')
    .eq('user_id', session.user.id)
    .order('played_date', { ascending: false })
    .limit(5);

  // Stats
  const stats = [
    { 
      label: 'Status', 
      value: profile?.subscription_status || 'Inactive', 
      icon: CreditCard,
      color: profile?.subscription_status === 'active' ? 'text-green-500' : 'text-amber-500',
      bg: profile?.subscription_status === 'active' ? 'bg-green-50' : 'bg-amber-50'
    },
    { 
      label: 'Renewal', 
      value: profile?.subscription_renewal_date ? formatDate(profile.subscription_renewal_date) : 'N/A', 
      icon: Calendar,
      color: 'text-primary',
      bg: 'bg-[#F7F5F0]'
    },
    { 
      label: 'Winnings', 
      value: formatCurrency(0), 
      icon: Trophy,
      color: 'text-accent',
      bg: 'bg-accent/10'
    },
    { 
      label: 'Impact', 
      value: formatCurrency(0), 
      icon: Heart,
      color: 'text-red-500',
      bg: 'bg-red-50'
    },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Welcome back, {profile?.full_name?.split(' ')[0]}</h1>
          <p className="text-gray-500">Here's what's happening with your golf performance.</p>
        </div>
        <Link href="/scores" className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add New Score
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={stat.color} size={20} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-lg font-bold text-primary truncate capitalize">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score Summary Widget */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-primary">Recent Scores</h3>
            <Link href="/scores" className="text-accent text-sm font-bold hover:underline">View All</Link>
          </div>
          
          <div className="space-y-6">
            {scores && scores.length > 0 ? (
              scores.map((score, i) => (
                <div key={score.id} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-400 w-24">{formatDate(score.played_date)}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                      style={{ width: `${(score.score / 45) * 100}%` }}
                    />
                  </div>
                  <span className="text-lg font-black text-primary w-8 text-right font-serif">{score.score}</span>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-400 italic">No scores entered yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Draw Widget */}
        <div className="bg-primary text-white rounded-[32px] p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Ticket size={120} />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-6">Upcoming Draw</h3>
            <p className="text-accent-light text-sm font-bold uppercase tracking-widest mb-2">Next Draw Date</p>
            <p className="text-3xl font-black mb-8 font-serif">15 May 2026</p>
            
            <div className="space-y-4">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Your Entry Numbers</p>
              <div className="flex gap-2">
                {scores && scores.length > 0 ? (
                  scores.map((s, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center font-bold text-accent text-sm">
                      {s.score}
                    </div>
                  ))
                ) : (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20">
                      ?
                    </div>
                  ))
                )}
              </div>
              {scores?.length !== 5 && (
                <p className="text-[10px] text-amber-400 italic mt-2">
                  * Enter 5 scores to be eligible for the draw
                </p>
              )}
            </div>
          </div>

          <Link href="/draws" className="btn-ghost border-white/20 text-white hover:bg-white/10 w-full text-center mt-12 py-3">
            View Past Draws
          </Link>
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
