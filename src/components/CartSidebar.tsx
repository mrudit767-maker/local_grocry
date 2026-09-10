import { X, ShoppingCart, Plus, Minus, Trash2, Tag, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function CartSidebar() {
  const {
    cart, cartOpen, toggleCart, updateQuantity, removeFromCart,
    getCartTotal, clearCart, darkMode, setCurrentPage, storeSettings
  } = useStore();

  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= storeSettings.freeDeliveryAbove ? 0 : storeSettings.deliveryFee;
  const total = subtotal + deliveryFee;

  const totalSavings = cart.reduce((sum, item) => {
    const savingsPerUnit = Math.max(0, item.product.mrp - item.product.price);
    return sum + savingsPerUnit * item.quantity;
  }, 0);

  if (!cartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={toggleCart}
      />

      {/* Sidebar Drawer */}
      <div className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col shadow-2xl transition-transform duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
        
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-800 bg-gray-900/90' : 'border-gray-100 bg-white'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600">
              <ShoppingCart size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base">My Cart</h2>
                {cart.length > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                    {cart.reduce((s, i) => s + i.quantity, 0)} items
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                <Zap size={11} className="fill-emerald-500" />
                <span>Delivery in 10-15 mins</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-700 font-bold px-2.5 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              onClick={toggleCart}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Free Delivery / Threshold Banner */}
        {subtotal > 0 && (
          <div className={`px-4 py-2.5 border-b ${
            subtotal >= storeSettings.freeDeliveryAbove
              ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-300'
          }`}>
            {subtotal >= storeSettings.freeDeliveryAbove ? (
              <div className="flex items-center gap-2 text-xs font-black">
                <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Yay! You've unlocked FREE Delivery</span>
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold flex items-center gap-1.5">
                  <Tag size={12} />
                  <span>Add ₹{storeSettings.freeDeliveryAbove - subtotal} more for <strong className="font-black">FREE Delivery</strong></span>
                </p>
                <div className="mt-1.5 h-1.5 rounded-full bg-amber-200/60 dark:bg-amber-950 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / storeSettings.freeDeliveryAbove) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600">
                <ShoppingCart size={36} />
              </div>
              <div className="space-y-1">
                <p className="font-black text-base">Your cart is empty</p>
                <p className="text-gray-400 text-xs max-w-xs">Explore fresh staples, milk, snacks, and daily essentials delivered in 15 mins!</p>
              </div>
              <button
                onClick={() => { toggleCart(); setCurrentPage('products'); }}
                className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.product.id}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  darkMode ? 'bg-gray-850 border-gray-800' : 'bg-gray-50/70 border-gray-150/80 hover:bg-white hover:shadow-xs'
                }`}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 p-1 flex items-center justify-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                    onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/64x64/16a34a/ffffff?text=${item.product.name[0]}`; }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs leading-snug line-clamp-2">{item.product.name}</p>
                  <p className="text-gray-400 text-[10px] font-medium mt-0.5">{item.product.unit}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-emerald-600 font-black text-xs">₹{item.product.price}</span>
                    {item.product.mrp > item.product.price && (
                      <span className="text-gray-400 text-[10px] line-through">₹{item.product.mrp}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 size={13} />
                  </button>
                  
                  {/* Stepper */}
                  <div className="flex items-center bg-emerald-600 text-white rounded-xl overflow-hidden font-black text-xs border border-emerald-600 shadow-xs">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-emerald-700 transition-colors cursor-pointer"
                      aria-label="Decrease"
                    >
                      <Minus size={10} strokeWidth={3} />
                    </button>
                    <span className="px-1.5 text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-emerald-700 transition-colors cursor-pointer"
                      aria-label="Increase"
                    >
                      <Plus size={10} strokeWidth={3} />
                    </button>
                  </div>

                  <p className="text-xs font-black text-gray-900 dark:text-gray-100">
                    ₹{(item.product.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bill Summary & Sticky Checkout CTA */}
        {cart.length > 0 && (
          <div className={`border-t p-4 space-y-3.5 ${darkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-150 bg-white'}`}>
            
            {/* Savings Callout Banner */}
            {totalSavings > 0 && (
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/50 px-3 py-1.5 rounded-xl text-[11px] font-black text-emerald-700 dark:text-emerald-300">
                <span>Total Savings on this order</span>
                <span>₹{totalSavings} OFF</span>
              </div>
            )}

            {/* Bill Details */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Items Subtotal</span>
                <span className="font-bold text-gray-900 dark:text-white">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'text-emerald-600 font-black tracking-wide uppercase text-[11px]' : 'font-bold text-gray-900 dark:text-white'}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black pt-1.5 border-t border-gray-100 dark:border-gray-800">
                <span>Grand Total</span>
                <span className="text-emerald-600 text-base">₹{total}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => { toggleCart(); setCurrentPage('checkout'); }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-3.5 px-4 rounded-2xl font-black text-sm transition-all shadow-lg hover:shadow-emerald-600/30 flex items-center justify-between cursor-pointer"
            >
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] uppercase font-bold text-emerald-100">Pay Total</span>
                <span className="text-sm font-black">₹{total}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-extrabold">
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
