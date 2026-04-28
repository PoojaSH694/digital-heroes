import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';
import { 
  Users, 
  Ticket, 
  Heart, 
  TrendingUp,
  Play,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = createClient();

  // Fetch some stats
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: activeSubs } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active');
  const { data: pendingWinners } = await supabase.from('draw_entries').select('*').eq('is_winner', true).eq('payment_status', 'pending');

  const stats = [
    { label: 'Total Users', value: userCount || 0, icon: Users, color: 'text-blue-500' },
    { label: 'Active Subscribers', value: activeSubs || 0, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Prize Pool (Current)', value: formatCurrency(activeSubs ? activeSubs * 10 : 0), icon: Ticket, color: 'text-accent' },
    { label: 'Pending Winners', value: pendingWinners?.length || 0, icon: AlertCircle, color: 'text-red-500' },
  ];

  const actions = [
    { label: 'Run Draw Simulation', href: '/admin/draws', icon: Play, desc: 'Preview results for the current month' },
    { label: 'Verify Winners', href: '/admin/winners', icon: CheckCircle2, desc: 'Review scorecard proofs and payouts' },
    { label: 'Manage Charities', href: '/admin/charities', icon: Heart, desc: 'Add or edit partner organizations' },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-bold text-primary mb-2">Admin Control Center</h1>
        <p className="text-gray-500">Manage the Digital Heroes platform and oversee monthly draws.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <stat.icon className={stat.color} size={24} />
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">Live</span>
            </div>
            <p className="text-sm font-bold text-gray-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-primary mb-8">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4">
              {actions.map((action) => (
                <Link 
                  key={action.href}
                  href={action.href}
                  className="group flex items-center gap-6 p-6 rounded-2xl hover:bg-[#F7F5F0] border border-transparent hover:border-gray-100 transition-all"
                >
                  <div className="w-14 h-14 bg-primary text-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <action.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-primary">{action.label}</h4>
                    <p className="text-sm text-gray-400">{action.desc}</p>
                  </div>
                  <ChevronRight size={20} className="ml-auto text-gray-300 group-hover:text-accent" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-primary text-white rounded-[32px] p-10 flex flex-col justify-center text-center">
          <h4 className="text-sm font-bold text-accent uppercase tracking-widest mb-4">Platform Health</h4>
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
              <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={Math.PI * 120} strokeDashoffset={Math.PI * 120 * (1 - 0.98)} className="text-accent" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-black">98%</div>
          </div>
          <p className="text-sm text-gray-400">All systems operational. Next automated cleanup in 4 hours.</p>
        </div>
      </div>
    </div>
  );
}

import { ChevronRight } from 'lucide-react';
