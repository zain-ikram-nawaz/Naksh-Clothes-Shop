'use client';

import ProductForm from '@/components/admin/ProductForm';
import Link from 'next/link';

export default function AddProductPage() {
  return (
    <div className="space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-black/5 pb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/products"
              className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 hover:text-black transition-colors"
            >
              ← Inventory
            </Link>
            <span className="text-[10px] text-gray-200">/</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-300">New Entry</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">
            Create Product<span className="text-blue-600 not-italic">.</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-2">
            Database Synchronization / SKU Generation
          </p>
        </div>

        {/* Quick Instructions Badge */}
        <div className="hidden lg:block bg-black text-white p-6 max-w-[240px]">
          <p className="text-[9px] uppercase tracking-widest leading-relaxed opacity-70">
            Ensure all high-resolution assets are uploaded in 3:4 aspect ratio for optimal studio display.
          </p>
        </div>
      </div>

      {/* Form Container - Sharp & Minimal */}
      <div className="max-w-5xl">
        <div className="bg-white border border-black/5 p-8 md:p-12 shadow-sm">
          <ProductForm />
        </div>

        {/* Footer Note */}
        <div className="mt-8 flex items-center gap-4 opacity-20 grayscale pointer-events-none">
          <div className="h-[1px] flex-1 bg-black"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">Vankea Studio System</span>
          <div className="h-[1px] flex-1 bg-black"></div>
        </div>
      </div>
    </div>
  );
}