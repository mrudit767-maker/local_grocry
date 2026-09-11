import { useState } from 'react';
import { Plus, Minus, Star, ShoppingCart, Heart, Bell, Zap } from 'lucide-react';
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
    'Best Seller': 'bg-amber-500 text-white',
    'Popular': 'bg-blue-600 text-white',
    'Premium': 'bg-purple-600 text-white',
    'Organic': 'bg-emerald-600 text-white',
    'Healthy': 'bg-teal-600 text-white',
    'Fresh': 'bg-emerald-500 text-white',
    'Iconic': 'bg-rose-600 text-white',
    'Value Pack': 'bg-amber-600 text-white',
    'Imported': 'bg-indigo-600 text-white',
    'Seasonal': 'bg-pink-600 text-white',
    'Daily': 'bg-sky-600 text-white',
    'Desi': 'bg-yellow-600 text-white',
  };

  const badgeColor = product.badge ? (badgeColors[product.badge] || 'bg-gray-700 text-white') : '';

  const handleCardClick = () => {
    addToRecentlyViewed(product.id);
    setSelectedProductId(product.id);
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
          darkMode
            ? 'bg-gray-850/90 border-gray-750 hover:border-emerald-500/50'
            : 'bg-white border-gray-150/90 hover:border-emerald-400 hover:shadow-emerald-500/5'
        } ${!product.inStock ? 'opacity-70' : ''}`}
      >
        {/* Badges Stack (Top Left) */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start pointer-events-none">
          {discount >= 5 && (
            <span className="bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
              {discount}% OFF
            </span>
          )}
          {product.badge && (
            <span className={`${badgeColor} text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 z-20 p-1.5 rounded-full shadow-sm backdrop-blur-md cursor-pointer transition-all duration-200 active:scale-90 ${
            isWishlisted
              ? 'bg-red-500 text-white'
              : darkMode
              ? 'bg-gray-900/80 border border-gray-700 text-gray-400 hover:text-red-400'
              : 'bg-white/90 border border-gray-200 text-gray-400 hover:text-red-500'
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart size={13} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Product Image Area */}
        <div className={`relative aspect-square overflow-hidden flex items-center justify-center p-3.5 ${
          darkMode ? 'bg-gray-900/60' : 'bg-gradient-to-b from-gray-50/90 to-gray-100/30'
        }`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-1 group-hover:scale-108 transition-transform duration-300"
            loading="lazy"
            onError={e => {
              const target = e.target as HTMLImageElement;
              const initials = product.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
              target.src = `https://placehold.co/200x200/2ecc71/ffffff?text=${encodeURIComponent(initials)}`;
            }}
          />

          {/* 15 Mins Delivery Micro-pill */}
          <div className="absolute bottom-2 left-2 z-10">
            <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-tight px-1.5 py-0.5 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-200 shadow-xs border border-gray-200/50 dark:border-gray-700/50">
              <Zap size={9} className="text-emerald-500 fill-emerald-500" />
              15 MINS
            </span>
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px] flex items-center justify-center">
              <span className="text-white font-black text-[10px] uppercase bg-black/80 px-3 py-1 rounded-full tracking-wider border border-white/20">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-2.5 sm:p-3.5 flex flex-col gap-1.5 flex-1">
          {/* Subcategory & Seller */}
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wide gap-1">
            <span className="truncate">{product.subcategory || product.category}</span>
            <span className="text-[9px] normal-case bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded font-semibold truncate max-w-[50%]" title={`Seller: ${seller.name}`}>
              {seller.name.replace(' (Main Branch)', '')}
            </span>
          </div>

          {/* Product Name */}
          <h3 className={`font-bold text-xs leading-snug line-clamp-2 h-8 transition-colors ${
            darkMode ? 'text-gray-100 group-hover:text-emerald-400' : 'text-gray-900 group-hover:text-emerald-600'
          }`}>
            {product.name}
          </h3>

          {/* Unit & Rating Row */}
          <div className="flex items-center justify-between text-[10px] pt-0.5">
            <span className="text-gray-500 dark:text-gray-400 font-semibold">{product.unit}</span>
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.2 rounded font-bold">
              <Star size={9} className="fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400 text-[9px]">({product.reviews})</span>
            </div>
          </div>

          {/* Price & Action Row */}
          <div className="mt-auto pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm sm:text-base tracking-tight">
                  ₹{product.price}
                </span>
                {product.mrp > product.price && (
                  <span className="text-gray-400 dark:text-gray-500 text-[10px] sm:text-[11px] line-through font-bold">
                    ₹{product.mrp}
                  </span>
                )}
              </div>
            </div>

            <div className="w-full sm:w-20 md:w-22 shrink-0">
              {!product.inStock ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifyModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-1 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs transition-all cursor-pointer bg-orange-50 dark:bg-orange-950/20 text-orange-600 border border-orange-200 dark:border-orange-900/50 hover:bg-orange-600 hover:text-white whitespace-nowrap"
                >
                  <Bell size={10} />
                  <span>Notify</span>
                </button>
              ) : !cartItem ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg sm:rounded-xl font-black text-xs transition-all cursor-pointer bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-600/80 hover:bg-emerald-600 hover:text-white hover:shadow-sm active:scale-95 whitespace-nowrap"
                >
                  <Plus size={12} strokeWidth={3} />
                  <span>ADD</span>
                </button>
              ) : (
                <div className="flex items-center justify-between bg-emerald-600 text-white rounded-lg sm:rounded-xl overflow-hidden font-black text-xs border border-emerald-600 shadow-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(product.id, cartItem.quantity - 1);
                    }}
                    className="flex-1 py-1.5 hover:bg-emerald-700 transition-colors cursor-pointer flex items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={11} strokeWidth={3} />
                  </button>
                  <span className="px-1.5 font-black">{cartItem.quantity}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(product.id, cartItem.quantity + 1);
                    }}
                    className="flex-1 py-1.5 hover:bg-emerald-700 transition-colors cursor-pointer flex items-center justify-center"
                    aria-label="Increase quantity"
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
