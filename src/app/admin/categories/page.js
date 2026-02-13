'use client';

import { useEffect, useState } from 'react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setFormData({ name: '', description: '' });
        setShowForm(false);
        fetchCategories();
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const inputStyles = "w-full px-4 py-3 bg-[#f8fafc] border border-black/10 text-[11px] uppercase tracking-widest font-bold focus:outline-none focus:border-black transition-all rounded-none placeholder:font-normal";
  const labelStyles = "block text-[10px] uppercase tracking-[0.2em] font-black mb-2 text-gray-400";

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-black/5 pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Collections</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-1">Management Portal</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-8 py-3 text-[10px] uppercase font-black tracking-[0.2em] transition-all duration-300 ${
            showForm ? 'bg-zinc-100 text-black' : 'bg-black text-white hover:bg-zinc-800'
          }`}
        >
          {showForm ? '[ Close ]' : 'Add New Category'}
        </button>
      </div>

      {/* Add Category Form - Animated Dropdown style */}
      {showForm && (
        <div className="bg-white border border-black p-10 max-w-2xl">
          <h2 className="text-xs uppercase tracking-[0.4em] font-black mb-8 italic">// New Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelStyles}>Identification Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className={inputStyles}
                placeholder="e.g. OVERSIZED SERIES"
              />
            </div>

            <div>
              <label className={labelStyles}>Editorial Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={inputStyles}
                placeholder="Describe the aesthetic..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 text-[10px] uppercase font-black tracking-[0.3em] hover:bg-zinc-800 transition-all"
            >
              Initialize Category
            </button>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="border border-dashed border-black/10 p-20 text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-400">Database Empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/5 border border-black/5">
          {categories.map((category) => (
            <div key={category._id} className="bg-white p-8 group hover:bg-[#fafafa] transition-colors">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[9px] font-mono text-gray-300">ID: {category._id.slice(-6).toUpperCase()}</span>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-black uppercase tracking-tighter hover:text-red-600">
                  Delete
                </button>
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter mb-1">{category.name}</h3>
              <p className="text-[9px] font-mono text-blue-500 uppercase tracking-widest mb-4">/{category.slug}</p>

              <div className="h-16 overflow-hidden">
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {category.description || "No editorial description provided for this collection."}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-black/5 flex justify-between items-center">
                <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-gray-300">
                  EST: {new Date(category.createdAt).toLocaleDateString()}
                </span>
                <span className="w-2 h-2 bg-black"></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}