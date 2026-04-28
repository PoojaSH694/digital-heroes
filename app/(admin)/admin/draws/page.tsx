"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { generateRandomDraw, generateAlgorithmicDraw, calculateMatches, calculatePrizePools } from '@/lib/draw-engine';
import { formatCurrency } from '@/lib/utils';
import { 
  Play, 
  RefreshCw, 
  Send, 
  Trophy, 
  Users,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDrawPage() {
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [simulation, setSimulation] = useState<any>(null);
  const [drawMonth, setDrawMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [drawType, setDrawType] = useState<'random' | 'algorithmic'>('random');
  const supabase = createClient();

  const runSimulation = async () => {
    setLoading(true);
    try {
      // 1. Fetch all active subscribers
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('subscription_status', 'active');

      if (!profiles || profiles.length === 0) throw new Error('No active subscribers found.');

      // 2. Fetch all scores for these users
      const { data: scores } = await supabase
        .from('golf_scores')
        .select('user_id, score')
        .in('user_id', profiles.map(p => p.id));

      // Group scores by user and enforce 5-score limit
      const userEntries: Record<string, number[]> = {};
      scores?.forEach(s => {
        if (!userEntries[s.user_id]) userEntries[s.user_id] = [];
        if (userEntries[s.user_id].length < 5) userEntries[s.user_id].push(s.score);
      });

      // Filter users who have exactly 5 scores
      const eligibleUsers = Object.keys(userEntries).filter(uid => userEntries[uid].length === 5);
      const allUserScores = eligibleUsers.map(uid => userEntries[uid]);

      // 3. Generate Draw Numbers
      const drawNumbers = drawType === 'random' 
        ? generateRandomDraw() 
        : generateAlgorithmicDraw(allUserScores);

      // 4. Calculate Winning Stats
      const results = eligibleUsers.map(uid => {
        const matches = calculateMatches(userEntries[uid], drawNumbers);
        return { uid, matches, entry: userEntries[uid] };
      });

      const jackpotWinners = results.filter(r => r.matches === 5);
      const fourMatchWinners = results.filter(r => r.matches === 4);
      const threeMatchWinners = results.filter(r => r.matches === 3);

      const pools = calculatePrizePools(profiles.length);

      setSimulation({
        drawNumbers,
        subscriberCount: profiles.length,
        eligibleCount: eligibleUsers.length,
        jackpotWinners: jackpotWinners.length,
        fourMatchWinners: fourMatchWinners.length,
        threeMatchWinners: threeMatchWinners.length,
        pools,
        winnerData: { jackpotWinners, fourMatchWinners, threeMatchWinners }
      });

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const publishDraw = async () => {
    if (!simulation) return;
    if (!confirm('Are you sure you want to publish these results? This cannot be undone and will notify all winners.')) return;

    setPublishing(true);
    try {
      // 1. Create Draw Record
      const { data: draw, error: drawError } = await supabase
        .from('draws')
        .insert({
          draw_month: drawMonth,
          draw_numbers: simulation.drawNumbers,
          draw_type: drawType,
          status: 'published',
          total_prize_pool: simulation.pools.total,
          jackpot_pool: simulation.pools.jackpot,
          four_match_pool: simulation.pools.fourMatch,
          three_match_pool: simulation.pools.threeMatch,
          published_at: new Date().toISOString()
        })
        .select()
        .single();

      if (drawError) throw drawError;

      // 2. Create Entry Records for all eligible users
      // This would normally be done in a batch or via a database function for performance
      // For demo purposes, we'll focus on winners
      const allWinners = [
        ...simulation.winnerData.jackpotWinners.map((w: any) => ({ ...w, tier: 5, prize: simulation.pools.jackpot / (simulation.winnerData.jackpotWinners.length || 1) })),
        ...simulation.winnerData.fourMatchWinners.map((w: any) => ({ ...w, tier: 4, prize: simulation.pools.fourMatch / (simulation.winnerData.fourMatchWinners.length || 1) })),
        ...simulation.winnerData.threeMatchWinners.map((w: any) => ({ ...w, tier: 3, prize: simulation.pools.threeMatch / (simulation.winnerData.threeMatchWinners.length || 1) }))
      ];

      const entriesToInsert = allWinners.map(w => ({
        draw_id: draw.id,
        user_id: w.uid,
        entry_numbers: w.entry,
        match_count: w.matches,
        is_winner: true,
        prize_amount: w.prize
      }));

      if (entriesToInsert.length > 0) {
        const { error: entryError } = await supabase
          .from('draw_entries')
          .insert(entriesToInsert);
        
        if (entryError) throw entryError;
      }

      alert('Draw results published successfully!');
      setSimulation(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-bold text-primary mb-2">Draw Management</h1>
        <p className="text-gray-500">Run simulations and finalize monthly winners.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-fit">
          <h3 className="text-xl font-bold text-primary mb-6">Step 1: Configure Draw</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">Draw Month</label>
              <input 
                type="month" 
                className="w-full px-6 py-4 bg-[#F7F5F0] border-none rounded-xl"
                value={drawMonth}
                onChange={e => setDrawMonth(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">Draw Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setDrawType('random')}
                  className={cn(
                    "py-3 rounded-xl font-bold text-sm transition-all",
                    drawType === 'random' ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                  )}
                >
                  Random
                </button>
                <button 
                  onClick={() => setDrawType('algorithmic')}
                  className={cn(
                    "py-3 rounded-xl font-bold text-sm transition-all",
                    drawType === 'algorithmic' ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                  )}
                >
                  Weighted
                </button>
              </div>
            </div>

            <button 
              onClick={runSimulation}
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Play />}
              {loading ? 'Simulating...' : 'Run Simulation'}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {simulation ? (
            <div className="space-y-8">
              <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-bold text-primary">Simulation Results</h3>
                  <div className="flex gap-2">
                    {simulation.drawNumbers.map((n: number, i: number) => (
                      <div key={i} className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center font-black text-lg shadow-inner">
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Subscribers</p>
                    <p className="text-2xl font-bold text-primary">{simulation.subscriberCount}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Eligible Entries</p>
                    <p className="text-2xl font-bold text-primary">{simulation.eligibleCount}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pool</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(simulation.pools.total)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Winners</p>
                    <p className="text-2xl font-bold text-primary">
                      {simulation.jackpotWinners + simulation.fourMatchWinners + simulation.threeMatchWinners}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-6 border border-gray-100 rounded-2xl flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Trophy className="text-accent" />
                      <div>
                        <h4 className="font-bold text-primary">5-Match (Jackpot)</h4>
                        <p className="text-sm text-gray-400">{simulation.jackpotWinners} winners</p>
                      </div>
                    </div>
                    <span className="font-serif font-black text-xl text-primary">{formatCurrency(simulation.pools.jackpot)}</span>
                  </div>
                  <div className="p-6 border border-gray-100 rounded-2xl flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Trophy className="text-primary/40" />
                      <div>
                        <h4 className="font-bold text-primary">4-Match</h4>
                        <p className="text-sm text-gray-400">{simulation.fourMatchWinners} winners</p>
                      </div>
                    </div>
                    <span className="font-serif font-black text-xl text-primary">{formatCurrency(simulation.pools.fourMatch)}</span>
                  </div>
                  <div className="p-6 border border-gray-100 rounded-2xl flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Trophy className="text-primary/20" />
                      <div>
                        <h4 className="font-bold text-primary">3-Match</h4>
                        <p className="text-sm text-gray-400">{simulation.threeMatchWinners} winners</p>
                      </div>
                    </div>
                    <span className="font-serif font-black text-xl text-primary">{formatCurrency(simulation.pools.threeMatch)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary text-white p-10 rounded-[32px] flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Send className="text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Ready to Publish?</h3>
                    <p className="text-gray-400">Winning numbers and prizes will be visible to all users.</p>
                  </div>
                </div>
                <button 
                  onClick={publishDraw}
                  disabled={publishing}
                  className="btn-primary py-4 px-10 flex items-center gap-3 disabled:opacity-50"
                >
                  {publishing ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                  Publish Results
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#F7F5F0] border-2 border-dashed border-gray-200 rounded-[32px] p-20 text-center flex flex-col items-center">
              <Users size={48} className="text-gray-300 mb-6" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No Simulation Active</h3>
              <p className="text-gray-400 max-w-sm">Select a month and click "Run Simulation" to see projected winnings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
