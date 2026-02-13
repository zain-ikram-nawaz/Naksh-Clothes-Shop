'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const discountPercentage = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug || product._id}`} className="group block bg-white">
      <div className="relative overflow-hidden border border-black/5 group-hover:border-black/20 transition-colors duration-500">

        {/* Product Image - Clean & Fixed Aspect Ratio */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f9f9f9]">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-400">
              No Image
            </div>
          )}

          {/* Minimalist Badges - Top Right */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
            {product.featured && (
              <span className="bg-black text-white text-[8px] uppercase font-bold px-2 py-1 tracking-tighter">
                Featured
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-white text-black border border-black text-[8px] uppercase font-bold px-2 py-1 tracking-tighter">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Quick View Overlay (Visual only for now) */}
          <div className="absolute bottom-0 left-0 w-full bg-black text-white py-3 text-[10px] uppercase font-bold tracking-[0.2em] text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            View Details
          </div>
        </div>

        {/* Product Info */}
        <div className="py-5 px-1">
          <div className="flex justify-between items-start mb-1">
            {/* Category */}
            {product.category && (
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                {product.category.name}
              </p>
            )}

            {/* Rating - Subtle dots instead of stars if preferred, but kept minimal stars here */}
            {product.rating > 0 && (
              <div className="flex items-center text-[10px] text-black font-bold tracking-tighter">
                ★ {product.rating}
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-bold uppercase tracking-tight mb-3 line-clamp-1 group-hover:underline underline-offset-4 decoration-1">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-black">
              ₹{product.price}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-gray-400 line-through font-light">
                ₹{product.comparePrice}
              </span>
            )}
          </div>

          {/* Color Indicators - Tiny squares instead of circles for a sharper look */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5 mt-4">
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 border border-black/10 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: color.hexCode }}
                  title={color.name}
                ></div>
              ))}
              {product.colors.length > 4 && (
                <span className="text-[9px] text-gray-400 font-mono">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}