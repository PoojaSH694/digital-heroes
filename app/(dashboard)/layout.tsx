"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Trophy, 
  Ticket, 
  Heart, 
  UserCircle2, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Scores', href: '/scores', icon: Trophy },
  { label: 'Draws', href: '/draws', icon: Ticket },
  { label: 'My Charity', href: '/dashboard/charity', icon: Heart },
  { label: 'Account', href: '/account', icon: UserCircle2 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-primary text-white p-8 sticky top-0 h-screen">
        <Link href="/" className="text-2xl font-bold mb-12">
          <span className="text-accent italic font-serif">Digital</span>Heroes
        </Link>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                pathname === item.href 
                  ? "bg-accent text-primary font-bold" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} className={cn(pathname === item.href ? "text-primary" : "text-gray-400 group-hover:text-accent")} />
              {item.label}
              {pathname === item.href && <ChevronRight className="ml-auto" size={16} />}
            </Link>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-auto"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 mb-20 md:mb-0">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50">
        {navItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1",
              pathname === item.href ? "text-accent" : "text-gray-400"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
