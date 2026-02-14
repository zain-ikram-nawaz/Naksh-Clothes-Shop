'use client';
import { useEffect, useState } from 'react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (data.success) setCategories(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if ((await res.json()).success) {
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchCategories();
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end border-b border-black/5 pb-10">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Collections</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-300 font-bold mt-2">Database Indexing</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all">
          {showForm ? '[ Close ]' : 'Create New'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-black p-12 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Label</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-b border-black/10 py-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-black transition-colors" placeholder="COLLECTION NAME" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Context</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-b border-black/10 py-4 text-sm focus:outline-none focus:border-black transition-colors min-h-[100px]" placeholder="Editorial notes..." />
            </div>
            <button className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.3em]">Initialize Collection</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/5 border border-black/5">
        {categories.map((c) => (
          <div key={c._id} className="bg-white p-10 flex flex-col justify-between group">
            <div>
              <p className="text-[8px] font-mono text-gray-300 mb-6 uppercase tracking-widest">Ref: {c._id.slice(-6)}</p>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2">{c.name}</h3>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-6">/{c.slug}</p>
              <p className="text-xs text-gray-500 leading-relaxed italic line-clamp-3">{c.description || "No description provided."}</p>
            </div>
            <div className="mt-12 flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity">
               <span className="text-[9px] font-black uppercase tracking-widest">View Catalog</span>
               <div className="w-2 h-2 bg-black"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}