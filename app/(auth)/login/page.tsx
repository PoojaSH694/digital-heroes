"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col items-center justify-center py-20 px-6">
      <Link href="/" className="text-3xl font-bold mb-12">
        <span className="text-accent italic font-serif">Digital</span>Heroes
      </Link>

      <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-[32px] shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-bold text-primary mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-10">Track your progress and support your cause.</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-primary mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                required
                placeholder="john@example.com"
                className="w-full pl-12 pr-6 py-4 bg-[#F7F5F0] border-none rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-primary">Password</label>
              <Link href="#" className="text-xs text-accent font-bold hover:underline">Forgot Password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-6 py-4 bg-[#F7F5F0] border-none rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg mt-4 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : null}
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>

      <p className="mt-8 text-gray-500 text-sm">
        Don't have an account? <Link href="/signup" className="text-primary font-bold hover:text-accent">Join Now</Link>
      </p>
    </div>
  );
}
