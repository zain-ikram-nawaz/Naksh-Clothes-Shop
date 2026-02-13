import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProductGallery from '@/components/products/ProductGallery';
import AddToCartButton from '@/components/products/AddToCartButton';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

async function getProduct(id) {
  try {
    await connectDB();
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    let product;
    if (isObjectId) {
      product = await Product.findById(id).populate('category').lean();
    } else {
      product = await Product.findOne({ slug: id }).populate('category').lean();
    }
    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} — Vankea Studio`,
    description: product.shortDescription || product.description,
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
       <div className="bg-[#f8fafc] min-h-screen flex flex-col justify-center items-center">
         <h1 className="text-4xl font-black">PIECE NOT FOUND</h1>
         <Link href="/products" className="mt-4 underline text-xs tracking-widest">BACK TO COLLECTION</Link>
       </div>
    );
  }

  const discountPercentage = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        {/* Minimal Breadcrumb */}
        <nav className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-10 flex gap-2">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black">Products</Link>
          <span>/</span>
          <span className="text-black italic">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left: Gallery */}
          <div className="lg:col-span-7">
            <div className="sticky top-28">
               <ProductGallery images={product.images} productName={product.name} />
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-5 space-y-10">
            <section>
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-600 mb-2 block">
                {product.brand || 'Vankea Original'}
              </span>
              <h1 className="text-5xl font-black uppercase tracking-tighter leading-none text-slate-900 mb-6">
                {product.name}
              </h1>

              {/* Rating Mini */}
              {product.rating > 0 && (
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-slate-200"}>★</span>
                  ))}
                  <span className="text-[10px] font-bold text-slate-400 ml-2">({product.numReviews} REVIEWS)</span>
                </div>
              )}

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{product.price}</span>
                {product.comparePrice && (
                  <span className="text-xl text-slate-300 line-through font-medium">₹{product.comparePrice}</span>
                )}
                {discountPercentage > 0 && (
                  <span className="text-[10px] font-black bg-red-50 text-red-500 px-2 py-1 uppercase">-{discountPercentage}%</span>
                )}
              </div>
            </section>

            {/* Colors Section */}
            {product.colors?.length > 0 && (
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-black mb-4 text-slate-400">Available Palette</h3>
                <div className="flex gap-4">
                  {product.colors.map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-slate-200 p-0.5 hover:scale-110 transition-all cursor-pointer">
                        <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hexCode }} />
                      </div>
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Section
            {product.sizes?.length > 0 && (
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-black mb-4 text-slate-400">Select Dimension</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s, i) => (
                    <button
                      key={i}
                      disabled={s.stock === 0}
                      className={`px-6 py-3 text-xs font-black border transition-all ${
                        s.stock > 0
                        ? 'border-slate-200 hover:border-black hover:bg-black hover:text-white'
                        : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through'
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )} */}

            {/* Features (Checklist style) */}
            {product.features?.length > 0 && (
              <div className="py-6 border-t border-slate-100">
                <h3 className="text-[10px] uppercase tracking-widest font-black mb-4 text-slate-400">Key Attributes</h3>
                <ul className="grid grid-cols-2 gap-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="text-[11px] font-bold text-slate-600 flex items-center gap-2">
                      <span className="text-blue-500 text-lg">·</span> {feature.toUpperCase()}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <AddToCartButton product={product} />

            {/* Material & Care Card */}
            <div className="bg-white border border-slate-100 p-6 space-y-4">
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Material Composition</h3>
                <p className="text-xs font-bold text-slate-800">{product.material || 'NOT SPECIFIED'}</p>
              </div>
              {product.careInstructions?.length > 0 && (
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Care Guide</h3>
                  <div className="text-[10px] font-medium text-slate-500 space-y-1">
                    {product.careInstructions.map((ins, i) => <p key={i}>• {ins}</p>)}
                  </div>
                </div>
              )}
            </div>

            {/* Minimalist Specs Table */}
            <div className="pt-6 space-y-3">
               {[
                 { label: 'SKU', value: product.sku },
                 { label: 'Category', value: product.category?.name, link: `/categories/${product.category?.slug}` },
                 { label: 'Origin', value: product.madeIn },
                 { label: 'Type', value: product.productType?.replace('-', ' ') }
               ].map((spec, i) => spec.value && (
                 <div key={i} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest py-2 border-b border-slate-50">
                   <span className="text-slate-400">{spec.label}</span>
                   {spec.link ? (
                     <Link href={spec.link} className="text-blue-600 hover:underline">{spec.value}</Link>
                   ) : (
                     <span className="text-slate-900">{spec.value}</span>
                   )}
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Studio Notes (Full Description) */}
        <div className="mt-32 max-w-4xl mx-auto border-t border-slate-200 pt-20 text-center">
          <h2 className="text-[11px] uppercase font-black tracking-[0.5em] mb-12 text-slate-400">Studio Notes & Composition</h2>
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium italic text-lg">
             "{product.description}"
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}