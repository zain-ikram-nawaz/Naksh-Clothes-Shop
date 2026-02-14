'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import ProductCard from '@/components/products/ProductCard';
import Footer from '@/components/ui/Footer';
import FilterSidebar from '@/components/products/FilterSidebar';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1, limit: 12, total: 0, pages: 0,
  });

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [filters, pagination.page]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (error) { console.error(error); }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== '')),
      });
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setPagination(prev => ({
          ...prev, total: data.pagination.total, pages: data.pagination.pages,
        }));
      }
    } finally { setLoading(false); }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-20 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Browse Products</h1>
            <p className="text-slate-500 text-sm mt-1">Discover our latest collection and exclusive deals.</p>
          </div>

          {/* Minimal Sort Dropdown */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all group">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sort By</span>
            <div className="relative">
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange({ sortBy, sortOrder });
                }}
                className="appearance-none bg-transparent border-none text-xs font-bold text-slate-800 focus:ring-0 cursor-pointer pr-6 py-0 leading-tight uppercase tracking-widest"
              >
                <option value="createdAt-desc">Newest</option>
                <option value="price-asc">Price: Low</option>
                <option value="price-desc">Price: High</option>
                <option value="name-asc">A to Z</option>
              </select>
              {/* Custom Arrow Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-slate-400 group-hover:text-black">
                <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Compact Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <FilterSidebar
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Products Content */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-2xl h-80 animate-pulse flex flex-col p-4">
                    <div className="bg-slate-100 rounded-xl h-48 w-full mb-4" />
                    <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-white border border-slate-200 rounded-3xl">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-xl font-bold text-slate-800">No products found</p>
                <p className="text-slate-500 mt-1">Try adjusting your filters or search term.</p>
                <button
                  onClick={() => setFilters({ category: '', type: '', minPrice: '', maxPrice: '', search: '', sortBy: 'createdAt', sortOrder: 'desc' })}
                  className="mt-6 text-blue-600 font-bold hover:underline"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Modern Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-16">
                    <button
                      onClick={() => { setPagination(p => ({ ...p, page: p.page - 1 })); window.scrollTo(0, 0); }}
                      disabled={pagination.page === 1}
                      className="p-2 w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all"
                    >
                      ←
                    </button>

                    <div className="flex gap-2 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { setPagination(p => ({ ...p, page: i + 1 })); window.scrollTo(0, 0); }}
                          className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${pagination.page === i + 1
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => { setPagination(p => ({ ...p, page: p.page + 1 })); window.scrollTo(0, 0); }}
                      disabled={pagination.page === pagination.pages}
                      className="p-2 w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-all"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}