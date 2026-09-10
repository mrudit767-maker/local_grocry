import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Heart, Sparkles, ShoppingBag, Flame, ChevronRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistIds = [], products = [], setCurrentPage, darkMode } = useStore();

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  // Recommended products to show when wishlist is empty or at the bottom
  const recommendedProducts = [...products]
    .filter(p => !wishlistIds.includes(p.id) && (p.badge === 'Best Seller' || p.badge === 'Popular' || p.rating >= 4.5))
    .slice(0, 8);

  return (
    <div className={`min-h-screen py-6 sm:py-10 transition-colors duration-200 ${
      darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50/80 text-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-6">
          <button 
            onClick={() => setCurrentPage('home')} 
            className="hover:text-emerald-600 transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">My Wishlist</span>
        </div>

        {/* Page Header */}
        <div className={`p-5 sm:p-6 rounded-3xl border mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
          darkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white border-gray-200/80'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Heart size={22} className="fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">My Wishlist</h1>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/50">
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-1">
                Products you saved to buy later or track prices
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('products')}
            className="inline-flex items-center justify-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200/60 dark:border-emerald-800/40 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <ShoppingBag size={14} />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Main Content */}
        {wishlistProducts.length === 0 ? (
          /* Empty State */
          <div className="space-y-12">
            <div className={`text-center py-14 sm:py-16 px-6 rounded-3xl border max-w-lg mx-auto shadow-sm relative overflow-hidden ${
              darkMode 
                ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-gray-800 text-white' 
                : 'bg-gradient-to-b from-rose-50/40 via-white to-gray-50/50 border-gray-200/80 text-gray-900'
            }`}>
              {/* Soft decorative glow */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Icon */}
              <div className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center text-rose-500 shadow-inner">
                <Heart size={36} className="fill-rose-500 stroke-rose-500 animate-pulse" />
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-rose-100 dark:border-rose-900 shadow flex items-center justify-center text-amber-500">
                  <Sparkles size={13} />
                </span>
              </div>

              {/* Text */}
              <h2 className="text-xl font-black mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed font-medium">
                You haven't saved any items yet. Tap the heart icon on any product to save it here for later purchase!
              </p>

              {/* Action */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentPage('products')}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-102 transition-all cursor-pointer"
                >
                  <span>Explore Grocery Catalog</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Recommended Products Carousel/Grid */}
            {recommendedProducts.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame size={20} className="text-amber-500" />
                    <h2 className="text-base sm:text-lg font-black tracking-tight">Popular Items You Might Like</h2>
                  </div>
                  <button
                    onClick={() => setCurrentPage('products')}
                    className="text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
                  {recommendedProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="space-y-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
              {wishlistProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Recommendations below saved items */}
            {recommendedProducts.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-gray-200/70 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame size={20} className="text-amber-500" />
                    <h2 className="text-base sm:text-lg font-black tracking-tight">More Popular Items</h2>
                  </div>
                  <button
                    onClick={() => setCurrentPage('products')}
                    className="text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
                  {recommendedProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
