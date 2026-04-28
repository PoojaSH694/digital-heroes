"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    let query = supabase
      .from('profiles')
      .select('*, charities(name)')
      .order('created_at', { ascending: false });
    
    if (statusFilter !== 'all') {
      query = query.eq('subscription_status', statusFilter);
    }

    const { data } = await query;
    if (data) setUsers(data);
    setLoading(false);
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">User Management</h1>
          <p className="text-gray-500">Monitor subscriptions, charity choices, and golfer performance.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..."
              className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-accent w-64"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-6 py-3 bg-white border border-gray-100 rounded-xl shadow-sm outline-none font-bold text-primary text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="cancelled">Cancelled</option>
            <option value="lapsed">Lapsed</option>
          </select>
        </div>
      </header>

      <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F7F5F0] border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Golfer</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Plan & Status</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Charity Impact</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Joined</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <Loader2 className="animate-spin text-accent mx-auto" />
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-primary">{user.full_name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black uppercase text-primary/40">{user.subscription_plan}</span>
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit",
                        user.subscription_status === 'active' ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-100 text-gray-400"
                      )}>
                        {user.subscription_status}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-primary">{user.charities?.name || 'Unset'}</p>
                    <p className="text-[10px] text-accent font-bold">{user.charity_contribution_percent}% Contribution</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm text-gray-500 font-medium">{formatDate(user.created_at)}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-gray-300 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-gray-400 italic">
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination placeholder */}
        <div className="bg-[#F7F5F0] px-8 py-4 flex justify-between items-center text-xs text-gray-500 font-bold border-t border-gray-100">
          <p>Showing {filteredUsers.length} results</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center hover:bg-white disabled:opacity-30" disabled><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center hover:bg-white disabled:opacity-30" disabled><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
