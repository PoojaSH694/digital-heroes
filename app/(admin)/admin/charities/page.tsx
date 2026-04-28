"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Star,
  Loader2,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function AdminCharityPage() {
  const [charities, setCharities] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingCharity, setEditingCharity] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    website_url: '',
    is_featured: false,
    event_name: '',
    event_date: ''
  });

  const supabase = createClient();

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    setFetching(true);
    const { data } = await supabase.from('charities').select('*').order('created_at', { ascending: false });
    if (data) setCharities(data);
    setFetching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCharity) {
        const { error } = await supabase
          .from('charities')
          .update(formData)
          .eq('id', editingCharity.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('charities')
          .insert(formData);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingCharity(null);
      setFormData({ name: '', description: '', image_url: '', website_url: '', is_featured: false, event_name: '', event_date: '' });
      fetchCharities();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCharity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this charity?')) return;
    try {
      await supabase.from('charities').delete().eq('id', id);
      fetchCharities();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Charity Partners</h1>
          <p className="text-gray-500">Manage organizations and their featured impact events.</p>
        </div>
        <button 
          onClick={() => {
            setEditingCharity(null);
            setFormData({ name: '', description: '', image_url: '', website_url: '', is_featured: false, event_name: '', event_date: '' });
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Add New Charity
        </button>
      </header>

      {fetching ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-accent" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {charities.map((charity) => (
            <div key={charity.id} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm flex flex-col group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={charity.image_url || 'https://via.placeholder.com/400x250'} 
                  alt={charity.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {charity.is_featured && (
                  <div className="absolute top-4 left-4 bg-accent text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> Featured
                  </div>
                )}
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-primary mb-3">{charity.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">{charity.description}</p>
                
                {charity.event_name && (
                  <div className="mb-6 p-4 bg-[#F7F5F0] rounded-xl border border-gray-100">
                    <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">Upcoming Event</p>
                    <p className="text-xs font-bold text-primary">{charity.event_name}</p>
                    <p className="text-[10px] text-gray-400">{charity.event_date}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                  <a href={charity.website_url} target="_blank" rel="noreferrer" className="text-accent hover:text-primary transition-colors">
                    <ExternalLink size={18} />
                  </a>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingCharity(charity);
                        setFormData({
                          name: charity.name,
                          description: charity.description,
                          image_url: charity.image_url,
                          website_url: charity.website_url,
                          is_featured: charity.is_featured,
                          event_name: charity.event_name || '',
                          event_date: charity.event_date || ''
                        });
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => deleteCharity(charity.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-2xl rounded-[40px] p-10 relative shadow-2xl my-auto"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>

            <h3 className="text-3xl font-bold text-primary mb-2">
              {editingCharity ? 'Edit Charity' : 'Add New Charity'}
            </h3>
            <p className="text-gray-500 text-sm mb-10">Define the impact cause and its unique story.</p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Charity Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Golf for Good"
                  className="w-full px-6 py-4 bg-[#F7F5F0] border-none rounded-xl"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Tell the story of how this charity makes an impact..."
                  className="w-full px-6 py-4 bg-[#F7F5F0] border-none rounded-xl resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Image URL</label>
                <div className="relative">
                  <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input 
                    type="url" 
                    placeholder="https://..."
                    className="w-full pl-12 pr-6 py-4 bg-[#F7F5F0] border-none rounded-xl"
                    value={formData.image_url}
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Website URL</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  className="w-full px-6 py-4 bg-[#F7F5F0] border-none rounded-xl"
                  value={formData.website_url}
                  onChange={e => setFormData({...formData, website_url: e.target.value})}
                />
              </div>

              <div className="p-6 bg-primary rounded-2xl md:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-white font-bold">Promotion & Events</h4>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Featured</span>
                    <div 
                      onClick={() => setFormData({...formData, is_featured: !formData.is_featured})}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-all",
                        formData.is_featured ? "bg-accent" : "bg-white/10"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                        formData.is_featured ? "left-7" : "left-1"
                      )} />
                    </div>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Event Name (Optional)"
                    className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl outline-none"
                    value={formData.event_name}
                    onChange={e => setFormData({...formData, event_name: e.target.value})}
                  />
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl outline-none"
                    value={formData.event_date}
                    onChange={e => setFormData({...formData, event_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-5 text-lg font-black uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" /> : null}
                  {editingCharity ? 'Update Charity' : 'Add Charity Partner'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
