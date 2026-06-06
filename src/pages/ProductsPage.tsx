import { useState, useMemo } from 'react';
import { ChevronDown, X, SlidersHorizontal, Store } from 'lucide-react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { id: 'default', label: 'Recommended' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
  { id: 'name', label: 'Name A-Z' },
  { id: 'discount', label: 'Best Discount' },
];

const CATEGORY_IMAGES: Record<string, string> = {
  'all': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop',
  'rice-atta': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'oils-ghee': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'dal-pulses': 'https://images.unsplash.com/photo-1547050605-2f8653ac5a0d?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'spices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'biscuits-snacks': 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'beverages': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'dairy': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'fruits-veggies': 'https://images.unsplash.com/photo-1610832958506-ee5633619141?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'personal-care': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'baby-care': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'frozen': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'instant-food': 'https://images.unsplash.com/photo-1612966608967-312ba599102e?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'bread-bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'sweets': 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'stationery': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'chocolates': 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'pooja': 'https://images.unsplash.com/photo-1609137144813-90d56df42361?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop'
};

export default function ProductsPage() {
  const { 
    products, searchQuery, selectedCategory, setSelectedCategory, darkMode, categories, 
    branches = [], selectedBranchId = 'all', setSelectedBranchId, storeSettings, setCurrentPage 
  } = useStore();
  
  const activeBranches = branches.length > 0 ? branches : [
    {
      id: 'main',
      name: storeSettings?.shopName || 'Krishna Kirana (Main Branch)',
      phone: storeSettings?.phone || '+91 98934 95231',
      whatsapp: storeSettings?.whatsapp || '919893495231',
      upiId: storeSettings?.shopUpiId || 'paytmqr7247md@ptys',
      address: storeSettings?.address || '653, Vidisha Rd, Kalyan Nagar, Bhanpur, Bhopal, MP 462038',
      isActive: true
    }
  ];

  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [page, setPage] = useState(1);
  const PER_PAGE = 40;

  const filtered = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'all') {
      result = result.filter(p => {
        if (selectedCategory === 'stationery' || selectedCategory === 'stationary') {
          return p.category === 'stationery' || p.category === 'stationary';
        }
        return p.category === selectedCategory;
      });
    }

    if (selectedBranchId !== 'all') {
      result = result.filter(p => p.storeId === selectedBranchId || (selectedBranchId === 'main' && !p.storeId));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.subcategory || '').toLowerCase().includes(q)
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

    // Always sort out-of-stock items to the bottom, preserving sub-sorting order
    result = [...result].sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));

    return result;
  }, [products, selectedCategory, selectedBranchId, searchQuery, sortBy, priceRange]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice(0, page * PER_PAGE);

  const selectedCat = categories.find(c => c.id === selectedCategory);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Breadcrumb / Top Info */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-semibold text-gray-400">
          <span onClick={() => setCurrentPage('home')} className="hover:text-green-600 cursor-pointer">Home</span>
          <span>/</span>
          <span className="text-gray-500">All Products</span>
          {selectedCat && (
            <>
              <span>/</span>
              <span className="text-green-600 font-extrabold">{selectedCat.emoji} {selectedCat.name}</span>
            </>
          )}
        </div>

        <div className="flex flex-row gap-3 md:gap-6 items-start">
          
          {/* LEFT SIDEBAR: Sticky Category List (Visible on both Mobile & Desktop) */}
          <aside className="w-20 md:w-64 shrink-0 sticky top-20 md:top-28 space-y-4">
            <div className={`p-1 md:p-4 rounded-2xl md:rounded-3xl border shadow-premium ${
              darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200/60'
            }`}>
              <h3 className="hidden md:block text-xs font-black uppercase tracking-wider text-gray-400 mb-3 px-2">Categories</h3>
              <nav className="space-y-1.5 md:space-y-1 max-h-[75vh] overflow-y-auto scrollbar-hide">
                {categories.map(cat => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                      className={`w-full flex flex-col md:flex-row items-center md:justify-between p-2 md:px-3 md:py-2.5 rounded-xl text-center md:text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-green-600 text-white shadow-md'
                          : darkMode
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-2.5">
                        <div className="w-8 h-8 md:w-6 md:h-6 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-gray-800 border border-white/20 shrink-0">
                          <img 
                            src={cat.image || CATEGORY_IMAGES[cat.id] || `https://placehold.co/80x80/2ecc71/ffffff?text=${encodeURIComponent(cat.name[0])}`} 
                            alt={cat.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span className="text-[9px] md:text-xs font-bold leading-tight break-all md:break-normal">{cat.name}</span>
                      </div>
                      <span className={`hidden md:inline text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-green-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                        {products.filter(p => cat.id === 'all' || p.category === cat.id).length}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Price Filter Widget */}
            <div className={`p-4 rounded-3xl border shadow-premium ${
              darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200/60'
            }`}>
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4 px-2">Price Filter</h3>
              <div className="space-y-3 px-2">
                <div className="flex justify-between text-xs font-bold text-green-600">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={50}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-green-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
                  <span>Min</span>
                  <span>Max: ₹2000+</span>
                </div>
              </div>
            </div>

            {/* Store Location Selection inside Sidebar */}
            <div className={`p-4 rounded-3xl border shadow-premium ${
              darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200/60'
            }`}>
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 px-2 flex items-center gap-1">
                <Store size={12} /> Stores
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedBranchId('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedBranchId === 'all'
                      ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  🏪 All Stores
                </button>
                {activeBranches.map(br => (
                  <button
                    key={br.id}
                    onClick={() => setSelectedBranchId(br.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedBranchId === br.id
                        ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    🏪 {(br.name || '').replace(' (Main Branch)', '')}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN CATALOG CONTAINER */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Mobile Category Horizontal Slider replaced by vertical left sidebar */}

            {/* Catalog Toolbar & Header Info */}
            <div className={`p-4 rounded-3xl border shadow-premium flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200/60'
            }`}>
              <div>
                <h1 className="text-lg font-black dark:text-white">
                  {searchQuery ? `Search results for "${searchQuery}"` : selectedCat ? `${selectedCat.emoji} ${selectedCat.name}` : '🛍️ Grocery Catalog'}
                </h1>
                <p className="text-gray-400 text-xs font-semibold mt-0.5">
                  Showing {filtered.length} products
                </p>
              </div>

              {/* Sorting & Filter controls */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto self-stretch sm:self-auto justify-end">
                {/* Mobile Filter Trigger */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    darkMode ? 'bg-gray-850 border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-705'
                  }`}
                >
                  <SlidersHorizontal size={13} />
                  Filters
                </button>

                <div className="relative flex-1 sm:flex-initial">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className={`w-full appearance-none pl-3 pr-8 py-2 rounded-xl border text-xs font-bold cursor-pointer outline-none ${
                      darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    {SORT_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className={`md:hidden p-4 rounded-3xl border space-y-4 ${
                darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-250'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b dark:border-gray-800">
                  <h3 className="text-xs font-black uppercase tracking-wider">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="text-gray-400"><X size={15} /></button>
                </div>
                <div className="space-y-4">
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-bold mb-2">Price Limit: Up to ₹{priceRange[1]}</label>
                    <input
                      type="range"
                      min={0}
                      max={2000}
                      step={50}
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-green-600"
                    />
                  </div>
                  {/* Stores */}
                  <div>
                    <label className="block text-xs font-bold mb-2">Select Branch</label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setSelectedBranchId('all')}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold ${
                          selectedBranchId === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                        }`}
                      >
                        All
                      </button>
                      {activeBranches.map(br => (
                        <button
                          key={br.id}
                          onClick={() => setSelectedBranchId(br.id)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold ${
                            selectedBranchId === br.id ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                          }`}
                        >
                          {(br.name || '').replace(' (Main Branch)', '')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Catalog Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 max-w-md mx-auto shadow-sm">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-base font-extrabold mb-1">No matches found</h3>
                <p className="text-gray-500 text-xs px-6">We couldn't find any products fitting your active filters. Try resetting price ranges or store selection.</p>
                <button
                  onClick={() => { setSelectedCategory('all'); setPriceRange([0, 2000]); setSelectedBranchId('all'); }}
                  className="mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {paginated.map(p => <ProductCard key={p.id} product={p} />)}
                </div>

                {page < totalPages && (
                  <div className="text-center">
                    <button
                      onClick={() => setPage(p => p + 1)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      Load More Items (+{filtered.length - page * PER_PAGE} left)
                    </button>
                  </div>
                )}

                <p className="text-center text-gray-400 text-[10px] font-semibold">
                  Showing {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
