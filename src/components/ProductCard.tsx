import { Plus, Minus, Star, ShoppingCart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Product } from '../data/products';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { cart, addToCart, updateQuantity, darkMode } = useStore();
  const cartItem = cart.find(i => i.product.id === product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

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

  return (
    <div className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      darkMode
        ? 'bg-gray-800 border-gray-700 hover:border-green-500'
        : 'bg-white border-gray-200 hover:border-green-400'
    } ${!product.inStock ? 'opacity-60' : ''}`}>
      {/* Badge */}
      {product.badge && (
        <div className={`absolute top-2 left-2 z-10 ${badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow`}>
          {product.badge}
        </div>
      )}

      {/* Discount */}
      {discount >= 5 && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
          {discount}% OFF
        </div>
      )}

      {/* Image */}
      <div className={`relative aspect-square overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={e => {
            const target = e.target as HTMLImageElement;
            const initials = product.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
            target.src = `https://placehold.co/200x200/16a34a/ffffff?text=${encodeURIComponent(initials)}`;
          }}
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-black/70 px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* Category */}
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide truncate">{product.subcategory}</p>

        {/* Name */}
        <p className={`font-semibold text-sm leading-snug line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {product.name}
        </p>

        {/* Unit */}
        <p className="text-xs text-gray-500">{product.unit}</p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <Star
                key={s}
                size={10}
                className={s <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-green-600 font-bold text-base">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-gray-400 text-xs line-through">₹{product.mrp}</span>
          )}
        </div>

        {/* Add to cart */}
        <div className="mt-auto">
          {!cartItem ? (
            <button
              onClick={() => product.inStock && addToCart(product)}
              disabled={!product.inStock}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-sm transition-all ${
                product.inStock
                  ? 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-md'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={14} />
              Add
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                className="flex-1 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors font-bold flex items-center justify-center"
              >
                <Minus size={14} />
              </button>
              <span className={`font-bold text-base min-w-[2rem] text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                className="flex-1 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors font-bold flex items-center justify-center"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
