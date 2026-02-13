'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    draftProducts: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const productsRes = await fetch('/api/admin/products?limit=1000', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const productsData = await productsRes.json();
      const categoriesRes = await fetch('/api/categories');
      const categoriesData = await categoriesRes.json();

      if (productsData.success) {
        const products = productsData.data;
        setStats({
          totalProducts: products.length,
          activeProducts: products.filter(p => p.status === 'active').length,
          draftProducts: products.filter(p => p.status === 'draft').length,
          totalCategories: categoriesData.success ? categoriesData.data.length : 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Inventory Total', value: stats.totalProducts, label: 'Units', link: '/admin/products' },
    { title: 'Market Active', value: stats.activeProducts, label: 'Live', link: '/admin/products' },
    { title: 'Draft Queue', value: stats.draftProducts, label: 'Pending', link: '/admin/products' },
    { title: 'Collections', value: stats.totalCategories, label: 'Categories', link: '/admin/categories' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Overview</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Studio Performance Metrics</p>
      </div>

      {/* Stats Grid - Minimalist Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Link key={index} href={stat.link} className="group">
            <div className="bg-white border border-black/5 p-8 transition-all duration-300 group-hover:border-black group-hover:shadow-sm">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-6 group-hover:text-black transition-colors">
                {stat.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                <span className="text-[9px] uppercase font-mono text-gray-300">{stat.label}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-black/5 p-10">
          <h2 className="text-xs uppercase tracking-[0.4em] font-black mb-10 border-b border-black/5 pb-4">
            System Control
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/products/add"
              className="group flex flex-col justify-center border border-black p-6 hover:bg-black transition-all duration-500"
            >
              <span className="text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-gray-500 mb-1">Action 01</span>
              <span className="text-sm font-black uppercase tracking-widest group-hover:text-white">Create Product</span>
            </Link>
            <Link
              href="/admin/products"
              className="group flex flex-col justify-center border border-black/10 p-6 hover:border-black transition-all duration-500"
            >
              <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Action 02</span>
              <span className="text-sm font-black uppercase tracking-widest">Database Audit</span>
            </Link>
          </div>
        </div>

        {/* Studio Status Sidebar in Dashboard */}
        <div className="bg-black text-white p-10 flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-black mb-6 opacity-50">System Status</h3>
            <div className="space-y-6">
               <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-[10px] uppercase tracking-widest">API Latency</span>
                  <span className="text-[10px] font-mono text-green-500">Normal</span>
               </div>
               <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-[10px] uppercase tracking-widest">Database</span>
                  <span className="text-[10px] font-mono text-green-500">Synced</span>
               </div>
            </div>
          </div>
          <div className="mt-12">
            <p className="text-[8px] uppercase tracking-[0.2em] leading-relaxed opacity-30">
              Vankea Studio Admin <br /> Build v2.0.4-stable
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}