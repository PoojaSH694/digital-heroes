"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Clock,
  ExternalLink,
  Loader2,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminWinnersPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('draw_entries')
      .select('*, profiles(full_name, email), draws(draw_month)')
      .eq('is_winner', true)
      .order('created_at', { ascending: false });
    
    if (data) setEntries(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('draw_entries')
        .update({ [field]: value })
        .eq('id', id);
      
      if (error) throw error;
      fetchWinners();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-bold text-primary mb-2">Winners & Verification</h1>
        <p className="text-gray-500">Review scorecard proofs and manage prize payouts.</p>
      </header>

      <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F7F5F0] border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase">Winner</th>
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase">Draw Month</th>
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase">Prize</th>
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase">Proof</th>
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase">Status</th>
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                  <Loader2 className="animate-spin text-accent mx-auto" />
                </td>
              </tr>
            ) : entries.length > 0 ? (
              entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-primary">{entry.profiles?.full_name}</p>
                    <p className="text-xs text-gray-400">{entry.profiles?.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-medium text-primary">
                      {new Date(entry.draws?.draw_month + '-01').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-primary font-serif">
                      {formatCurrency(entry.prize_amount)}
                    </span>
                    <p className="text-[10px] text-accent uppercase font-bold">{entry.match_count}-Number Match</p>
                  </td>
                  <td className="px-8 py-6">
                    {entry.proof_url ? (
                      <a href={entry.proof_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary font-bold hover:text-accent group">
                        <Eye size={16} className="text-gray-300 group-hover:text-accent" /> View Proof
                      </a>
                    ) : (
                      <span className="text-gray-300 italic text-sm">Not uploaded</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold",
                      entry.payment_status === 'paid' 
                        ? "bg-green-50 text-green-600 border border-green-100" 
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    )}>
                      {entry.payment_status === 'paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {entry.payment_status === 'paid' ? 'Paid' : 'Pending'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 text-xs">
                      {entry.payment_status === 'pending' && (
                        <button 
                          onClick={() => updateStatus(entry.id, 'payment_status', 'paid')}
                          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95"
                        >
                          <DollarSign size={14} /> Mark as Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-gray-400 italic">
                  No winners recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
