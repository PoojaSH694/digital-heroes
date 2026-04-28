"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import {
  Trophy,
  Trash2,
  Edit3,
  Plus,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ScoreManager({ initialScores, userId }: { initialScores: any[], userId: string }) {
  const [scores, setScores] = useState(initialScores);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newScore, setNewScore] = useState({ score: '', date: new Date().toISOString().split('T')[0] });
  const [editingId, setEditingId] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const val = parseInt(newScore.score);
    if (val < 1 || val > 45) {
      setError('Score must be between 1 and 45.');
      setLoading(false);
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('golf_scores')
          .update({ score: val, played_date: newScore.date })
          .eq('id', editingId);
        if (error) throw error;
      } else {
        // Business logic: rolling 5 scores
        if (scores.length >= 5) {
          // Sort current scores by date ascending to find the oldest
          const sorted = [...scores].sort((a, b) => new Date(a.played_date).getTime() - new Date(b.played_date).getTime());
          const oldest = sorted[0];
          await supabase.from('golf_scores').delete().eq('id', oldest.id);
        }

        const { error } = await supabase
          .from('golf_scores')
          .insert({
            user_id: userId,
            score: val,
            played_date: newScore.date
          });

        if (error) {
          if (error.code === '23505') throw new Error('A score already exists for this date.');
          throw error;
        }
      }

      router.refresh();
      setIsModalOpen(false);
      setNewScore({ score: '', date: new Date().toISOString().split('T')[0] });
      setEditingId(null);

      // Refresh local state (simplified, better to just router.refresh() but this is more responsive)
      const { data } = await supabase
        .from('golf_scores')
        .select('*')
        .eq('user_id', userId)
        .order('played_date', { ascending: false })
        .limit(5);
      if (data) setScores(data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this score?')) return;

    try {
      await supabase.from('golf_scores').delete().eq('id', id);
      setScores(s => s.filter(item => item.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
            <Trophy className="text-accent" /> My Scores
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage your 5 monthly draw entries.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setNewScore({ score: '', date: new Date().toISOString().split('T')[0] });
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Add Score
        </button>
      </div>

      <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F7F5F0] border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Date Played</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Score (Stableford)</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {scores.length > 0 ? (
              scores.map((score) => (
                <tr key={score.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 text-primary font-medium">{formatDate(score.played_date)}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-40 bg-gray-100 rounded-full h-2">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${(score.score / 45) * 100}%` }}
                        />
                      </div>
                      <span className="font-serif font-black text-primary">{score.score}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingId(score.id);
                          setNewScore({ score: score.score.toString(), date: score.played_date });
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(score.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-8 py-20 text-center text-gray-400 italic">
                  No scores found. Start by adding your first score.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {scores.length === 5 && (
        <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
          <AlertCircle className="text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Limit Reached:</strong> You already have 5 scores. Adding a new one will automatically remove the oldest score ({formatDate([...scores].sort((a, b) => new Date(a.played_date).getTime() - new Date(b.played_date).getTime())[0].played_date)}).
          </p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-[32px] p-10 relative shadow-2xl"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold text-primary mb-2">
              {editingId ? 'Edit Score' : 'Add New Score'}
            </h3>
            <p className="text-gray-500 text-sm mb-8">Enter your Stableford score from the course.</p>

            <form onSubmit={handleAddScore} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Played Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-6 py-4 bg-[#F7F5F0] border-none rounded-xl focus:ring-2 focus:ring-accent outline-none"
                  value={newScore.date}
                  onChange={e => setNewScore({ ...newScore, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Score (1-45)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="45"
                  placeholder="e.g. 36"
                  className="w-full px-6 py-4 bg-[#F7F5F0] border-none rounded-xl focus:ring-2 focus:ring-accent outline-none text-2xl font-serif font-black"
                  value={newScore.score}
                  onChange={e => setNewScore({ ...newScore, score: e.target.value })}
                />
              </div>

              {error && <p className="text-red-500 text-xs bg-red-50 p-4 rounded-xl">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-black flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : editingId ? 'Update Score' : 'Save Score'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
