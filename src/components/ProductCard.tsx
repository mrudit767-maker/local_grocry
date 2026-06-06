import { useState } from 'react';
import { Plus, Minus, Star, ShoppingCart, Heart, Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Product } from '../data/products';
import NotifyMeModal from './NotifyMeModal';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const { 
    cart = [], addToCart, updateQuantity, darkMode, branches = [], storeSettings,
    wishlistIds = [], toggleWishlist, addToRecentlyViewed, setSelectedProductId
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

  const seller = activeBranches.find(b => b.id === product.storeId) || activeBranches.find(b => b.id === 'main') || { name: storeSettings?.shopName || 'Krishna Kirana' };
  const cartItem = cart.find(i => i.product.id === product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const isWishlisted = wishlistIds.includes(product.id);

  const badgeColors: Record<string, string> = {
    'Best Seller': 'bg-orange-500',
    'Popular': 'bg-blue-500',
    'Premium': 'bg-purple-500',
    'Organic': 'bg-green-600',
    'Healthy': 'bg-emerald-500',
    'Fresh': 'bg-teal-500',
    'Iconic': 'bg-red-500',
    'Value Pack': 'bg-amber-500',
    'Imported': 'bg-indigo-500',
    'Seasonal': 'bg-pink-500',
    'Daily': 'bg-sky-500',
    'Desi': 'bg-yellow-600',
    'Ayurvedic': 'bg-lime-600',
    'Herbal': 'bg-lime-500',
    'Germ Kill': 'bg-red-600',
    'High Protein': 'bg-purple-600',
    'Homestyle': 'bg-amber-600',
    'Trusted': 'bg-blue-600',
    'SPF 50': 'bg-pink-600',
    'Gentle': 'bg-rose-400',
    'Nutrition': 'bg-orange-600',
    'Sensitive': 'bg-violet-500',
    'Power': 'bg-red-700',
    'Pure': 'bg-amber-700',
    'Spicy': 'bg-orange-700',
    'Fresh Frozen': 'bg-cyan-600',
  };

  const badgeColor = product.badge ? (badgeColors[product.badge] || 'bg-gray-500') : '';

  const handleCardClick = () => {
    addToRecentlyViewed(product.id);
    setSelectedProductId(product.id);
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
      className={`group relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-premium hover:-translate-y-1 ${
        darkMode
          ? 'bg-gray-800 border-gray-700 hover:border-green-500/50'
          : 'bg-white border-gray-200/80 hover:border-green-400 hover:shadow-md'
      } ${!product.inStock ? 'opacity-65' : ''}`}
    >
      {/* Badges Stack (Top Left) */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
        {product.badge && (
          <div className={`${badgeColor} text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm`}>
            {product.badge}
          </div>
        )}
        {discount >= 5 && (
          <div className="bg-gradient-to-r from-red-650 to-[#FF6B35] text-white text-[8px] font-black uppercase tracking-wider px-2.5 py-0.8 rounded-lg shadow-md">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Wishlist Button (Top Right) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-2 right-2 z-20 p-1.5 rounded-full shadow-sm backdrop-blur-sm cursor-pointer transition-all duration-300 active:scale-90 ${
          isWishlisted
            ? 'bg-red-500 text-white'
            : darkMode
            ? 'bg-gray-900/80 border border-gray-700 text-gray-400 hover:text-red-400'
            : 'bg-white/80 border border-gray-150 text-gray-400 hover:text-red-550'
        }`}
        title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
      >
        <Heart size={12} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      {/* Product Image */}
      <div className={`relative aspect-square overflow-hidden flex items-center justify-center p-3 ${
        darkMode ? 'bg-gray-900/40' : 'bg-gray-50/50'
      }`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={e => {
            const target = e.target as HTMLImageElement;
            const initials = product.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
            target.src = `https://placehold.co/200x200/2ecc71/ffffff?text=${encodeURIComponent(initials)}`;
          }}
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-extrabold text-[10px] uppercase bg-black/80 px-3 py-1 rounded-full tracking-wide">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col gap-2 flex-1">
        {/* Category & Seller info */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wide gap-2">
          <span className="truncate">{product.subcategory}</span>
          <span className="text-[9px] normal-case bg-green-50 dark:bg-gray-700 text-[#2ECC71] dark:text-green-400 px-2 py-0.5 rounded font-black truncate max-w-[60%] border border-green-100 dark:border-gray-650" title={`Sold by: ${seller.name}`}>
            {seller.name.replace(' (Main Branch)', '')}
          </span>
        </div>

        {/* Product Name */}
        <h3 className={`font-bold text-xs leading-snug line-clamp-2 h-8 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {product.name}
        </h3>

        {/* Unit */}
        <p className="text-[10px] text-gray-500 font-semibold">{product.unit}</p>

        {/* Rating and reviews */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(s => (
              <Star
                key={s}
                size={8}
                className={s <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}
              />
            ))}
          </div>
          <span className="text-[9px] text-gray-450 dark:text-gray-500 font-semibold">({product.reviews})</span>
        </div>

        {/* Price and Cart Buttons */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[#2ECC71] font-black text-sm">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-gray-400 text-[10px] line-through font-medium">₹{product.mrp}</span>
            )}
          </div>

          <div className="w-24 shrink-0">
            {!product.inStock ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifyModal(true);
                }}
                className="w-full flex items-center justify-center gap-1 py-1.8 rounded-xl font-extrabold text-[10px] sm:text-xs transition-all cursor-pointer bg-orange-50 dark:bg-orange-950/20 text-orange-600 border border-orange-200 dark:border-orange-900/50 hover:bg-orange-600 hover:text-white hover:border-orange-600 hover:shadow-md"
              >
                <Bell size={11} />
                Notify Me
              </button>
            ) : !cartItem ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.8 rounded-xl font-extrabold text-xs transition-all cursor-pointer bg-emerald-50 dark:bg-[#2ECC71]/5 text-[#2ECC71] border border-[#2ECC71]/30 hover:bg-[#FF6B35] hover:text-white hover:border-[#FF6B35] hover:shadow-md"
              >
                <ShoppingCart size={11} />
                ADD
              </button>
            ) : (
              <div className="flex items-center justify-between bg-[#2ECC71] text-white rounded-xl overflow-hidden font-black text-xs border border-[#2ECC71] shadow-sm animate-express-pulse">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, cartItem.quantity - 1);
                  }}
                  className="px-2.5 py-1.8 hover:bg-[#1db85b] transition-colors cursor-pointer text-left"
                >
                  <Minus size={11} strokeWidth={3} />
                </button>
                <span className="px-1">{cartItem.quantity}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, cartItem.quantity + 1);
                  }}
                  className="px-2.5 py-1.8 hover:bg-[#1db85b] transition-colors cursor-pointer text-right"
                >
                  <Plus size={11} strokeWidth={3} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      {showNotifyModal && (
        <NotifyMeModal
          product={product}
          onClose={() => setShowNotifyModal(false)}
        />
      )}
    </>
  );
}
