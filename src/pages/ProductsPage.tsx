import { useState, useMemo } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { id: 'default', label: 'Default' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
  { id: 'name', label: 'Name A-Z' },
  { id: 'discount', label: 'Best Discount' },
];

export default function ProductsPage() {
  const { products, searchQuery, selectedCategory, setSelectedCategory, darkMode } = useStore();
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [page, setPage] = useState(1);
  const PER_PAGE = 40;

  const filtered = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        (p.badge || '').toLowerCase().includes(q)
      );
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc': result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price-desc': result = [...result].sort((a, b) => b.price - a.price); break;
      case 'rating': result = [...result].sort((a, b) => b.rating - a.rating); break;
      case 'name': result = [...result].sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'discount': result = [...result].sort((a, b) => ((b.mrp - b.price) / b.mrp) - ((a.mrp - a.price) / a.mrp)); break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy, priceRange]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice(0, page * PER_PAGE);

  const selectedCat = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {searchQuery ? `Search: "${searchQuery}"` : selectedCat ? `${selectedCat.emoji} ${selectedCat.name}` : '🛍️ All Products'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-green-500' : 'bg-white border-gray-300 text-gray-700 hover:border-green-500'
              }`}
            >
              <Filter size={15} />
              Filters
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className={`appearance-none pl-3 pr-8 py-2 rounded-xl border text-sm font-medium cursor-pointer ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                {SORT_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className={`mb-6 p-5 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Filters</h3>
              <button onClick={() => setShowFilters(false)}><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={50}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span>
                  <span>₹2000+</span>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-green-600 text-white'
                          : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
              className={`flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                selectedCategory === cat.id
                  ? 'bg-green-600 text-white border-green-600 shadow-md'
                  : darkMode
                  ? 'bg-gray-800 text-gray-300 border-gray-700 hover:border-green-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No products found</h3>
            <p className="text-gray-500">Try different search terms or category</p>
            <button
              onClick={() => { setSelectedCategory('all'); }}
              className="mt-4 bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {paginated.map(p => <ProductCard key={p.id} product={p} />)}
            </div>

            {page < totalPages && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  Load More ({filtered.length - page * PER_PAGE} more)
                </button>
              </div>
            )}

            <p className="text-center text-gray-500 text-sm mt-4">
              Showing {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} products
            </p>
          </>
        )}
      </div>
    </div>
  );
}
