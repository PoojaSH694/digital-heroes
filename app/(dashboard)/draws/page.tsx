import { createClient } from '@/lib/supabase/server';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Ticket, Trophy, AlertTriangle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function DrawsPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return null;

  // Fetch published draws
  const { data: draws } = await supabase
    .from('draws')
    .select('*')
    .eq('status', 'published')
    .order('draw_month', { ascending: false });

  // Fetch user entries
  const { data: entries } = await supabase
    .from('draw_entries')
    .select('*, draws(draw_month, draw_numbers)')
    .eq('user_id', session.user.id);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-bold text-primary mb-2 flex items-center gap-4">
          <Ticket size={40} className="text-accent" /> Monthly Draws
        </h1>
        <p className="text-gray-500">Check the results and see if you're a winner.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {draws && draws.length > 0 ? (
          draws.map((draw) => {
            const entry = entries?.find(e => e.draw_id === draw.id);
            const matches = entry?.match_count || 0;
            const isWinner = entry?.is_winner || false;

            return (
              <div key={draw.id} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm flex flex-col md:flex-row">
                <div className="md:w-64 bg-primary p-8 text-white flex flex-col justify-center">
                  <p className="text-accent-light text-xs font-bold uppercase tracking-widest mb-1">Draw Month</p>
                  <h3 className="text-2xl font-bold font-serif mb-4 capitalize">
                    {new Date(draw.draw_month + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mb-2">Winning Numbers</p>
                    <div className="flex gap-2 justify-between">
                      {draw.draw_numbers.map((n: number, i: number) => (
                        <span key={i} className="text-accent font-black text-sm">{n}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-lg font-bold text-primary mb-1">Your Entry</h4>
                      <div className="flex gap-2">
                        {entry ? (
                          entry.entry_numbers.map((n: number, i: number) => (
                            <div 
                              key={i} 
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                                draw.draw_numbers.includes(n) ? "bg-accent text-primary" : "bg-gray-100 text-gray-400"
                              )}
                            >
                              {n}
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-2 text-amber-500 text-sm italic">
                            <AlertTriangle size={16} /> No entry found for this month
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Result</p>
                      <div className={cn(
                        "px-4 py-2 rounded-full font-bold text-sm",
                        matches >= 3 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                      )}>
                        {matches} Matches
                      </div>
                    </div>
                  </div>

                  {isWinner ? (
                    <div className="mt-8 p-6 bg-accent/10 rounded-2xl border border-accent/20 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary">
                          <Trophy size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-primary">You won {formatCurrency(entry.prize_amount || 0)}!</p>
                          <p className="text-xs text-primary/60">Please upload proof of your scorecard to claim.</p>
                        </div>
                      </div>
                      <button className="btn-primary py-2 px-6 flex items-center gap-2 text-sm">
                        Upload Proof <ExternalLink size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center text-sm text-gray-400">
                      <p>Full Prize Pool: {formatCurrency(draw.total_prize_pool || 0)}</p>
                      <p>Jackpot: {formatCurrency(draw.jackpot_pool || 0)}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-20 rounded-[32px] border border-dashed border-gray-200 text-center">
            <Ticket size={48} className="text-gray-200 mx-auto mb-6" />
            <p className="text-gray-400 italic">No draws have been published yet. Stay tuned!</p>
          </div>
        )}
      </div>
    </div>
  );
}
