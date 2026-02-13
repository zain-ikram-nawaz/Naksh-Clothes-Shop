import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProductGallery from '@/components/products/ProductGallery';
import AddToCartButton from '@/components/products/AddToCartButton';
async function getProduct(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      // This prevents the "Unexpected end of JSON" error
      console.error(`Fetch failed with status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params; // ✅ Await params
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Vankea`,
    description: product.shortDescription || product.description,
  };
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params; // ✅ Await params
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products" className="text-blue-600 hover:underline">
            Back to Products
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const discountPercentage = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600">({product.numReviews} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                {product.comparePrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">₹{product.comparePrice}</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-700 mb-6">{product.shortDescription}</p>
            )}

            {/* Product Type & Category */}
            <div className="mb-6 space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Type:</span>{' '}
                <span className="capitalize">{product.productType.replace('-', ' ')}</span>
              </p>
              {product.category && (
                <p className="text-sm">
                  <span className="font-semibold">Category:</span>{' '}
                  <Link href={`/categories/${product.category.slug}`} className="text-blue-600 hover:underline">
                    {product.category.name}
                  </Link>
                </p>
              )}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Available Colors:</h3>
                <div className="flex gap-3">
                  {product.colors.map((color, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div
                        className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer hover:border-blue-600"
                        style={{ backgroundColor: color.hexCode }}
                        title={color.name}
                      ></div>
                      <span className="text-xs text-gray-600">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Available Sizes:</h3>
                <div className="flex gap-3">
                  {product.sizes.map((sizeObj, index) => (
                    <div
                      key={index}
                      className={`border-2 px-4 py-2 rounded-lg ${
                        sizeObj.stock > 0
                          ? 'border-gray-300 hover:border-blue-600 cursor-pointer'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {sizeObj.size}
                      {sizeObj.stock === 0 && <span className="block text-xs">Out of stock</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Material & Care */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Material & Care:</h3>
              <p className="text-sm text-gray-700 mb-2">{product.material}</p>
              {product.careInstructions && product.careInstructions.length > 0 && (
                <ul className="text-sm text-gray-600 space-y-1">
                  {product.careInstructions.map((instruction, index) => (
                    <li key={index}>• {instruction}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Features:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add to Cart */}
            <AddToCartButton product={product} />

            {/* Additional Info */}
            <div className="mt-8 border-t pt-6 space-y-2 text-sm text-gray-600">
              {product.sku && <p><span className="font-semibold">SKU:</span> {product.sku}</p>}
              {product.brand && <p><span className="font-semibold">Brand:</span> {product.brand}</p>}
              {product.madeIn && <p><span className="font-semibold">Made In:</span> {product.madeIn}</p>}
            </div>
          </div>
        </div>

        {/* Full Description */}
        {product.description && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-4">Product Description</h2>
            <div className="prose max-w-none text-gray-700">
              {product.description}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}