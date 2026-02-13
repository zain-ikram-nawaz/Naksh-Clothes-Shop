'use client';

export default function FilterSidebar({ categories, filters, onFilterChange }) {
  const productTypes = [
    'polo', 'half-sleeve', 'full-sleeve', 'v-neck', 'round-neck', 'henley', 'tank-top',
  ];

  const inputStyles = "w-full px-4 py-3 bg-[#f9f9f9] border border-black/5 text-[11px] uppercase tracking-widest font-bold focus:outline-none focus:border-black transition-all duration-300 placeholder:text-gray-400 placeholder:font-normal";

  const labelStyles = "block text-[10px] uppercase tracking-[0.2em] font-black mb-3 text-gray-500";

  return (
    <div className="bg-white border border-black/5 p-8 sticky top-24 space-y-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black uppercase tracking-[0.3em]">Refine By</h3>
        <span className="text-[10px] font-mono text-gray-300">/ FILTERS</span>
      </div>

      {/* Search */}
      <div>
        <label className={labelStyles}>Keyword</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className={inputStyles}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className={labelStyles}>Category</label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className={`${inputStyles} cursor-pointer appearance-none rounded-none`}
        >
          <option value="">All Collections</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Product Type Filter */}
      <div>
        <label className={labelStyles}>Silhouette</label>
        <select
          value={filters.type}
          onChange={(e) => onFilterChange({ type: e.target.value })}
          className={`${inputStyles} cursor-pointer appearance-none rounded-none`}
        >
          <option value="">All Fits</option>
          {productTypes.map((type) => (
            <option key={type} value={type}>
              {type.replace('-', ' ').toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className={labelStyles}>Price Range (₹)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            className={inputStyles}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            className={inputStyles}
          />
        </div>
      </div>

      {/* Clear Filters - Pure Minimalist Button */}
      <button
        onClick={() =>
          onFilterChange({
            category: '',
            type: '',
            minPrice: '',
            maxPrice: '',
            search: '',
          })
        }
        className="w-full border border-black text-black py-4 text-[10px] uppercase font-black tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500"
      >
        Reset Filters
      </button>

      {/* Decorative Brand Text */}
      <div className="pt-4 opacity-10 pointer-events-none">
        <p className="text-[40px] font-black leading-none uppercase tracking-tighter">Vankea<br/>Essentials</p>
      </div>
    </div>
  );
}