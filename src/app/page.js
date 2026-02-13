// "use client";
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/ui/Navbar';
import ProductCard from '@/components/products/ProductCard';
import Footer from '@/components/ui/Footer';

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products?featured=true&limit=8`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
<div className="bg-[#f8fafc] min-h-screen">
      <Navbar />

      {/* --- HERO SECTION: Modern Editorial Look --- */}
      <section className="bg-white pt-16 pb-24 border-b border-black/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <div className="inline-block px-3 py-1 border border-black text-[10px] uppercase tracking-[0.3em] font-bold mb-8">
              Est. 2026
            </div>
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-10">
              Vankea <br />
              <span className="text-outline-black text-transparent">Studio</span>
            </h1>
            <p className="max-w-xl text-gray-500 text-sm md:text-base font-medium leading-relaxed mb-12">
              Focusing on form and function. Our essential collection features heavy-weight fabrics and oversized silhouettes.
            </p>
            <div className="flex gap-0 border border-black overflow-hidden">
              <Link
                href="/products"
                className="bg-black text-white px-12 py-5 text-xs uppercase font-bold tracking-widest hover:bg-zinc-800 transition-colors border-r border-black"
              >
                Shop All
              </Link>
              <Link
                href="/categories"
                className="bg-white text-black px-12 py-5 text-xs uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-all"
              >
                Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- CATEGORIES: Brutalist Grid --- */}
      {categories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-xs uppercase font-black tracking-[0.4em]">Index</h2>
              <div className="h-[1px] flex-grow bg-black/10"></div>
              <span className="text-[10px] font-mono text-gray-400">01 — CATEGORIES</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className="group relative bg-[#f9f9f9] aspect-[4/3] flex flex-col justify-end p-8 border border-black/5 hover:border-black transition-all duration-500"
                >
                  <span className="text-[10px] font-mono mb-2 text-gray-400 group-hover:text-black">/ 0{category.slug.length}</span>
                  <h3 className="text-2xl font-bold uppercase tracking-tight group-hover:pl-4 transition-all duration-500">
                    {category.name}
                  </h3>
                  <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 16L16 4M16 4H7M16 4V13" stroke="black" strokeWidth="2"/></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- FEATURED: Clean Gallery --- */}
      {featuredProducts.length > 0 && (
        <section className="py-24 border-t border-black/5">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-16">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Featured<br/>Pieces</h2>
              <Link href="/products" className="text-[10px] uppercase font-bold tracking-widest border-b border-black pb-1 mb-2">
                All Products
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- BRAND PROMISE: Minimal List --- */}
      <section className="py-32 bg-black text-white overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-20">
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-zinc-500 tracking-widest italic">Quality</span>
              <h3 className="text-xl font-bold uppercase tracking-widest">Premium Cotton</h3>
              <p className="text-zinc-500 text-sm font-light">Ethically sourced, long-staple fibers for a garment that lasts decades, not seasons.</p>
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-zinc-500 tracking-widest italic">Shipping</span>
              <h3 className="text-xl font-bold uppercase tracking-widest">Fast Logistics</h3>
              <p className="text-zinc-500 text-sm font-light">Global reach with carbon-neutral shipping options. From our studio to your door in 48h.</p>
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-zinc-500 tracking-widest italic">Ethos</span>
              <h3 className="text-xl font-bold uppercase tracking-widest">Transparent</h3>
              <p className="text-zinc-500 text-sm font-light">No hidden markups. We believe in high-quality essentials at an honest price point.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    
    </div>
  );
}