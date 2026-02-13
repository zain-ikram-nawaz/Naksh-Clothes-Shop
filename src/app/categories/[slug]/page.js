import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import ProductCard from '@/components/products/ProductCard';
import Footer from '@/components/ui/Footer';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

async function getData(slug) {
  try {
    await connectDB();
    const category = await Category.findOne({ slug }).lean();
    if (!category) return { category: null, products: [] };

    const products = await Product.find({ category: category._id, status: 'active' })
      .limit(20)
      .lean();

    return {
      category: JSON.parse(JSON.stringify(category)),
      products: JSON.parse(JSON.stringify(products)),
    };
  } catch (error) {
    return { category: null, products: [] };
  }
}

export default async function CategoryPage({ params }) {
 const resolvedParams = await params;
  const { category, products } = await getData(resolvedParams.slug);
  if (!category) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <h1 className="text-2xl font-bold text-slate-800">Category Not Found</h1>
          <Link href="/categories" className="mt-4 text-blue-600 font-medium hover:underline">← Back to all categories</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-6 py-10 flex-grow">
        {/* Breadcrumb */}
        <nav className="flex text-xs font-medium text-slate-400 uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-3">/</span>
          <Link href="/categories" className="hover:text-blue-600">Categories</Link>
          <span className="mx-3">/</span>
          <span className="text-slate-800">{category.name}</span>
        </nav>

        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{category.name}</h1>
          {category.description && <p className="text-slate-500 max-w-2xl text-lg">{category.description}</p>}
        </header>

        {products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-20 text-center shadow-sm">
            <p className="text-slate-400 text-lg">No products available in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}