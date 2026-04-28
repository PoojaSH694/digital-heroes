"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SignupForm({ charities }: { charities: any[] }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    charityId: '',
    contributionPercent: 10,
    plan: 'monthly'
  });
  const [error, setError] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: formData.fullName,
            email: formData.email,
            selected_charity_id: formData.charityId,
            charity_contribution_percent: formData.contributionPercent,
            subscription_plan: formData.plan
          });

        if (profileError) throw profileError;

        // Redirect to Stripe Checkout API
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan: formData.plan,
            userId: authData.user.id,
            email: formData.email
          })
        });

        const { url } = await response.json();
        if (url) window.location.href = url;
        else router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-[32px] shadow-2xl border border-gray-100">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-12">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-500",
              step >= s ? "bg-accent" : "bg-gray-100"
            )} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-2">Create Account</h2>
            <p className="text-gray-500 mb-8">Join the Digital Heroes community today.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full px-6 py-4 bg-[#F7F5F0] border-none rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  className="w-full px-6 py-4 bg-[#F7F5F0] border-none rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-[#F7F5F0] border-none rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <button 
                onClick={handleNext}
                disabled={!formData.fullName || !formData.email || !formData.password}
                className="btn-primary w-full py-4 text-lg mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Next Step <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-2">Choose Your Charity</h2>
            <p className="text-gray-500 mb-8">Select the cause you want to support with every subscription.</p>
            
            <div className="grid grid-cols-1 gap-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {charities.map((charity) => (
                <div 
                  key={charity.id}
                  onClick={() => setFormData({...formData, charityId: charity.id})}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4",
                    formData.charityId === charity.id 
                      ? "border-accent bg-accent/5 ring-1 ring-accent" 
                      : "border-gray-100 hover:border-gray-200"
                  )}
                >
                  <img src={charity.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-primary">{charity.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{charity.description}</p>
                  </div>
                  {formData.charityId === charity.id && <Check className="text-accent" size={20} />}
                </div>
              ))}
            </div>

            <div className="mb-8 p-6 bg-[#F7F5F0] rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-bold text-primary">Contribution Amount</label>
                <span className="text-accent font-black">{formData.contributionPercent}%</span>
              </div>
              <input 
                type="range"
                min="10"
                max="50"
                step="5"
                className="w-full accent-accent"
                value={formData.contributionPercent}
                onChange={e => setFormData({...formData, contributionPercent: parseInt(e.target.value)})}
              />
              <p className="text-[10px] text-gray-400 mt-2 italic text-center">Minimum 10% — Maximum 50% contribution</p>
            </div>

            <div className="flex gap-4">
              <button onClick={handleBack} className="btn-ghost flex-1 py-4">Back</button>
              <button 
                onClick={handleNext}
                disabled={!formData.charityId}
                className="btn-primary flex-[2] py-4 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-2">Select Your Plan</h2>
            <p className="text-gray-500 mb-8">Join the monthly draw and start tracking your progress.</p>
            
            <div className="space-y-4 mb-8">
              {[
                { id: 'monthly', name: 'Monthly Plan', price: '£19.99/mo' },
                { id: 'yearly', name: 'Yearly Plan', price: '£199.00/yr', tag: 'Best Value' }
              ].map((p) => (
                <div 
                  key={p.id}
                  onClick={() => setFormData({...formData, plan: p.id})}
                  className={cn(
                    "p-6 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden",
                    formData.plan === p.id 
                      ? "border-primary bg-primary text-white" 
                      : "border-gray-100 hover:border-gray-200"
                  )}
                >
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <h4 className="font-bold text-lg">{p.name}</h4>
                      {p.tag && <span className="text-[10px] font-black uppercase text-accent">{p.tag}</span>}
                    </div>
                    <span className="text-2xl font-black">{p.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>}

            <div className="flex gap-4">
              <button onClick={handleBack} className="btn-ghost flex-1 py-4">Back</button>
              <button 
                onClick={handleSignup}
                disabled={loading}
                className="btn-primary flex-[2] py-4 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" /> : null}
                {loading ? 'Creating Account...' : 'Complete & Subscribe'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
