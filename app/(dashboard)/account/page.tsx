import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { 
  User, 
  Mail, 
  CreditCard, 
  Heart, 
  Settings,
  ShieldCheck
} from 'lucide-react';

export default async function AccountPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, charities(name)')
    .eq('id', session.user.id)
    .single();

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-4xl font-bold text-primary mb-2">My Account</h1>
        <p className="text-gray-500">Manage your profile, subscription, and charity preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Personal Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-8 flex items-center gap-3">
              <User size={20} className="text-accent" /> Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
                <div className="flex items-center gap-3 p-4 bg-[#F7F5F0] rounded-xl font-bold text-primary">
                  {profile?.full_name}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <div className="flex items-center gap-3 p-4 bg-[#F7F5F0] rounded-xl font-bold text-primary overflow-hidden text-ellipsis">
                  {profile?.email}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-8 flex items-center gap-3">
              <Heart size={20} className="text-red-500" /> Charity Preference
            </h3>
            
            <div className="flex items-center justify-between p-6 bg-red-50/50 border border-red-100 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Current Beneficiary</p>
                <h4 className="text-xl font-bold text-primary">{profile?.charities?.name}</h4>
                <p className="text-sm font-medium text-primary/60">{profile?.charity_contribution_percent}% of your sub goes here</p>
              </div>
              <button className="text-accent font-black text-xs uppercase tracking-widest hover:underline">Change Charity</button>
            </div>
          </div>
        </div>

        {/* Subscription Sidebar */}
        <div className="space-y-6">
          <div className="bg-primary text-white p-10 rounded-[32px] shadow-xl relative overflow-hidden">
            <div className="absolute -top-4 -right-4 opacity-5 rotate-12">
              <CreditCard size={120} />
            </div>
            
            <h3 className="text-lg font-bold mb-8 relative z-10">Subscription</h3>
            
            <div className="mb-10">
              <span className="text-4xl font-black font-serif capitalize">{profile?.subscription_status}</span>
              <p className="text-accent-light text-xs font-bold uppercase tracking-widest mt-1">Status</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Plan</span>
                <span className="font-bold capitalize">{profile?.subscription_plan}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Next Billing</span>
                <span className="font-bold">{profile?.subscription_renewal_date ? formatDate(profile.subscription_renewal_date) : 'N/A'}</span>
              </div>
            </div>

            <button className="btn-primary w-full py-4 mt-10 shadow-none text-sm">
              Manage Billing
            </button>
          </div>

          <div className="p-6 bg-white border border-gray-100 rounded-[24px] shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="font-bold text-sm text-primary">Secure Account</p>
              <p className="text-[10px] text-gray-400">Your data is protected with 256-bit encryption.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
