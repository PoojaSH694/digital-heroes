import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Search, Heart, Star, ExternalLink, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function CharitiesPage({ searchParams }: { searchParams: { q?: string } }) {
  const supabase = createClient();
  const query = searchParams.q || '';

  let fetchQuery = supabase.from('charities').select('*');
  if (query) {
    fetchQuery = fetchQuery.ilike('name', `%${query}%`);
  }
  const { data: charities } = await fetchQuery.order('is_featured', { ascending: false });

  return (
    <main className="min-h-screen bg-[#F7F5F0]">
      <Navbar />
      
      <header className="pt-40 pb-20 bg-primary text-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Partner <br /><span className="text-accent italic">Charities</span></h1>
            <p className="text-gray-400 text-lg">Every golfer has a cause. Find yours and make an impact with every score you track.</p>
          </div>
          
          <form className="relative w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              name="q"
              defaultValue={query}
              placeholder="Search charities..."
              className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-accent transition-all"
            />
          </form>
        </div>
      </header>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {charities && charities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {charities.map((charity) => (
                <div key={charity.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group border border-transparent hover:border-accent/10">
                  <div className="relative h-64">
                    <img 
                      src={charity.image_url || 'https://via.placeholder.com/600x400'} 
                      alt={charity.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    {charity.is_featured && (
                      <div className="absolute top-6 left-6 bg-accent text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                        <Star size={14} fill="currentColor" /> Featured
                      </div>
                    )}
                  </div>
                  
                  <div className="p-10 flex-1 flex flex-col">
                    <h3 className="text-3xl font-bold text-primary mb-4">{charity.name}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm mb-8 flex-1">
                      {charity.description}
                    </p>
                    
                    {charity.event_name && (
                      <div className="flex items-center gap-3 p-4 bg-primary text-white rounded-2xl mb-8 group-hover:bg-accent group-hover:text-primary transition-colors">
                        <Calendar size={20} className="shrink-0" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-tighter opacity-60">Impact Event</p>
                          <p className="text-xs font-bold truncate">{charity.event_name}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-4 pt-8 border-t border-gray-50">
                      <a 
                        href={charity.website_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-gray-400 hover:text-accent transition-colors"
                      >
                        <ExternalLink size={24} />
                      </a>
                      <Link href="/signup" className="btn-primary py-3 px-8 text-sm">
                        Select Charity
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40">
              <Heart size={64} className="text-gray-200 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-400">No charities found</h3>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
