import { createClient } from '@/lib/supabase/server';
import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';

export default async function SignupPage() {
  const supabase = createClient();
  
  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .order('name');

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col items-center justify-center py-20 px-6">
      <Link href="/" className="text-3xl font-bold mb-12">
        <span className="text-accent italic font-serif">Digital</span>Heroes
      </Link>
      
      <SignupForm charities={charities || []} />
      
      <p className="mt-8 text-gray-500 text-sm">
        Already have an account? <Link href="/login" className="text-primary font-bold hover:text-accent">Login here</Link>
      </p>
    </div>
  );
}
