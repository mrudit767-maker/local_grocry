import { X, ShoppingCart, Plus, Minus, Trash2, Tag } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function CartSidebar() {
  const {
    cart, cartOpen, toggleCart, updateQuantity, removeFromCart,
    getCartTotal, clearCart, darkMode, setCurrentPage, storeSettings
  } = useStore();

  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= storeSettings.freeDeliveryAbove ? 0 : storeSettings.deliveryFee;
  const total = subtotal + deliveryFee;

  if (!cartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={toggleCart}
      />

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col shadow-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-green-600" size={20} />
            <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              My Cart
              {cart.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50"
              >
                Clear All
              </button>
            )}
            <button
              onClick={toggleCart}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Free delivery banner */}
        {subtotal > 0 && subtotal < storeSettings.freeDeliveryAbove && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 px-4 py-2">
            <p className="text-green-700 text-xs font-medium flex items-center gap-1">
              <Tag size={12} />
              Add ₹{storeSettings.freeDeliveryAbove - subtotal} more for FREE delivery!
              <span className="ml-1 font-bold">🚀</span>
            </p>
            <div className="mt-1.5 h-1.5 rounded-full bg-green-200 overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${(subtotal / storeSettings.freeDeliveryAbove) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingCart size={40} className="text-gray-400" />
              </div>
              <div className="text-center">
                <p className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Your cart is empty
                </p>
                <p className="text-gray-500 text-sm mt-1">Add some groceries to get started!</p>
              </div>
              <button
                onClick={() => { setCurrentPage('products'); }}
                className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Shop Now
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.product.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} group`}
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white border border-gray-200">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/64x64/16a34a/ffffff?text=${item.product.name[0]}`; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm leading-snug ${darkMode ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
                    {item.product.name}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">{item.product.unit}</p>
                  <p className="text-green-600 font-bold text-sm mt-1">₹{item.product.price}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className={`flex items-center gap-1 rounded-lg overflow-hidden border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className={`p-1.5 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    >
                      <Minus size={12} />
                    </button>
                    <span className={`px-3 text-sm font-bold ${darkMode ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ₹{(item.product.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className={`border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} p-4 space-y-3`}>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : `font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {deliveryFee === 0 ? 'FREE 🎉' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className={`flex justify-between text-base font-bold border-t pt-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>Total</span>
                <span className="text-green-600">₹{total}</span>
              </div>
            </div>
            <button
              onClick={() => { setCurrentPage('checkout'); }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Proceed to Checkout →
            </button>
            <button
              onClick={() => { setCurrentPage('products'); }}
              className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
