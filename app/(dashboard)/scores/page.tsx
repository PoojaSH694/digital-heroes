import { createClient } from '@/lib/supabase/server';
import ScoreManager from '@/components/dashboard/ScoreManager';

export default async function ScoresPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return null;

  const { data: scores } = await supabase
    .from('golf_scores')
    .select('*')
    .eq('user_id', session.user.id)
    .order('played_date', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <ScoreManager initialScores={scores || []} userId={session.user.id} />
    </div>
  );
}
