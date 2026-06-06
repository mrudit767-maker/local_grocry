import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistIds = [], products = [], setCurrentPage, darkMode } = useStore();

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className={`min-h-screen py-10 ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500">
            <Heart size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-2xl font-black">My Wishlist</h1>
            <p className="text-gray-500 text-xs mt-0.5">{wishlistProducts.length} items saved</p>
          </div>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 max-w-md mx-auto shadow-sm">
            <div className="text-5xl mb-4">❤️</div>
            <h2 className="text-lg font-bold mb-1">Your wishlist is empty</h2>
            <p className="text-gray-500 text-xs px-6">Explore our catalog and click on the heart icon on any product to save it here.</p>
            <button
              onClick={() => setCurrentPage('products')}
              className="mt-6 inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all"
            >
              Start Browsing <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wishlistProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
