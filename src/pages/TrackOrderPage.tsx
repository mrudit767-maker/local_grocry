import { useState } from 'react';
import { Search, ChevronLeft, Package, CheckCircle, Truck, Clock, XCircle, Phone, MessageCircle, ChefHat } from 'lucide-react';
import { useStore } from '../store/useStore';

const STATUS_STEPS = [
  { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle, desc: 'Your order has been received and confirmed', color: 'text-blue-600', bg: 'bg-blue-100' },
  { key: 'preparing', label: 'Being Prepared', icon: ChefHat, desc: 'We are packing your items with care', color: 'text-orange-600', bg: 'bg-orange-100' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, desc: 'Your order is on the way to you!', color: 'text-purple-600', bg: 'bg-purple-100' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, desc: 'Order delivered successfully. Enjoy!', color: 'text-green-600', bg: 'bg-green-100' },
];

const STATUS_ORDER = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

export default function TrackOrderPage() {
  const { orders, darkMode, setCurrentPage, storeSettings } = useStore();
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<typeof orders[0] | null>(null);

  const handleSearch = () => {
    if (!orderId.trim() || !phone.trim()) return;
    setSearched(true);
    const order = orders.find(
      o =>
        o.id.toLowerCase() === orderId.trim().toLowerCase() &&
        o.customer.phone.replace(/\D/g, '').slice(-10) === phone.trim().replace(/\D/g, '').slice(-10)
    );
    setFoundOrder(order || null);
  };

  const currentStatusIndex = foundOrder ? STATUS_ORDER.indexOf(foundOrder.status) : -1;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 text-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-indigo-100 hover:text-white mb-4 text-sm font-medium transition-colors"
          >
            <ChevronLeft size={16} /> Back to Home
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <Package size={22} />
            </div>
            <h1 className="text-3xl font-black">Track Your Order</h1>
          </div>
          <p className="text-indigo-100 text-sm">Enter your Order ID and mobile number to get real-time delivery updates</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Search Form */}
        <div className={`rounded-3xl border p-6 shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`font-bold text-base mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>🔍 Enter Order Details</h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Order ID *</label>
              <input
                type="text"
                value={orderId}
                onChange={e => { setOrderId(e.target.value.toUpperCase()); setSearched(false); }}
                placeholder="e.g. ORD1748234567890"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300'
                }`}
              />
              <p className="text-xs text-gray-400 mt-1">You can find your Order ID in the order confirmation page or SMS</p>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mobile Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value); setSearched(false); }}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="10-digit mobile number"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300'
                }`}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!orderId.trim() || !phone.trim()}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-all shadow-md"
            >
              <Search size={18} /> Track Order
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && !foundOrder && (
          <div className={`rounded-3xl border p-8 text-center shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="text-5xl mb-4">😕</div>
            <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order Not Found</h3>
            <p className={`text-sm mb-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No order found with this Order ID and mobile number. Please double-check and try again.
            </p>
            <a
              href={`https://wa.me/${storeSettings.whatsapp}?text=Hi! I need help tracking my order: ${orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
            >
              <MessageCircle size={16} /> Contact us on WhatsApp
            </a>
          </div>
        )}

        {foundOrder && (
          <>
            {/* Order Header */}
            <div className={`rounded-3xl border p-6 shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Order ID</p>
                  <p className={`font-mono font-black text-lg text-indigo-600`}>{foundOrder.id}</p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Placed on {new Date(foundOrder.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-green-600">₹{foundOrder.total}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{foundOrder.items.length} items</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                    foundOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {foundOrder.paymentStatus === 'paid' ? '✓ Paid' : '⏳ COD'}
                  </span>
                </div>
              </div>

              {/* Cancelled Special Case */}
              {foundOrder.status === 'cancelled' && (
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
                  <XCircle className="text-red-500 shrink-0" size={22} />
                  <div>
                    <p className="font-bold text-red-700 text-sm">Order Cancelled</p>
                    <p className="text-red-500 text-xs">This order has been cancelled. Please contact us for refund queries.</p>
                  </div>
                </div>
              )}

              {/* Pending */}
              {foundOrder.status === 'pending' && (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                  <Clock className="text-yellow-600 shrink-0" size={22} />
                  <div>
                    <p className="font-bold text-yellow-700 text-sm">Order Received — Awaiting Confirmation</p>
                    <p className="text-yellow-600 text-xs">We'll confirm your order shortly. Usually within 5–10 minutes.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Status Timeline */}
            {foundOrder.status !== 'cancelled' && foundOrder.status !== 'pending' && (
              <div className={`rounded-3xl border p-6 shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className={`font-black text-base mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>📦 Delivery Status</h3>
                <div className="space-y-0">
                  {STATUS_STEPS.map((step, idx) => {
                    const stepStatusIndex = STATUS_ORDER.indexOf(step.key);
                    const isDone = currentStatusIndex >= stepStatusIndex;
                    const isCurrent = STATUS_ORDER[currentStatusIndex] === step.key;
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="flex gap-4">
                        {/* Icon + Line */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                            isDone
                              ? isCurrent
                                ? `${step.bg} ring-4 ring-offset-2 ${darkMode ? 'ring-offset-gray-800' : 'ring-offset-white'} ring-green-200`
                                : 'bg-green-100'
                              : darkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            <Icon
                              size={20}
                              className={isDone ? (isCurrent ? step.color : 'text-green-600') : darkMode ? 'text-gray-500' : 'text-gray-400'}
                            />
                          </div>
                          {idx < STATUS_STEPS.length - 1 && (
                            <div className={`w-0.5 h-8 mt-1 rounded-full ${isDone ? 'bg-green-400' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                          )}
                        </div>

                        {/* Content */}
                        <div className="pb-6">
                          <p className={`font-bold text-sm ${isDone ? (darkMode ? 'text-white' : 'text-gray-900') : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {step.label}
                            {isCurrent && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold animate-pulse">● Current</span>}
                          </p>
                          <p className={`text-xs mt-0.5 ${isDone ? (darkMode ? 'text-gray-400' : 'text-gray-500') : darkMode ? 'text-gray-600' : 'text-gray-300'}`}>
                            {step.desc}
                          </p>
                          {isDone && (
                            <p className="text-xs text-green-600 font-medium mt-0.5">
                              {new Date(foundOrder.updatedAt).toLocaleString('en-IN', { timeStyle: 'short', dateStyle: 'short' })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className={`rounded-3xl border p-6 shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-black text-base mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>🛒 Order Items</h3>
              <div className="space-y-3">
                {foundOrder.items.map(item => (
                  <div key={item.product.id} className={`flex items-center gap-3 p-3 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover bg-white"
                      onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/48x48/16a34a/ffffff?text=${item.product.name[0]}`; }}
                    />
                    <div className="flex-1">
                      <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.product.unit} × {item.quantity}</p>
                    </div>
                    <p className="font-bold text-green-600 text-sm">₹{item.product.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className={`mt-4 pt-4 border-t flex justify-between font-black ${darkMode ? 'border-gray-700 text-white' : 'border-gray-100 text-gray-900'}`}>
                <span>Total</span>
                <span className="text-green-600">₹{foundOrder.total}</span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className={`rounded-3xl border p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-bold text-sm mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>📍 Delivering To</h3>
              <p className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{foundOrder.customer.name}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{foundOrder.customer.address}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{foundOrder.customer.city} — {foundOrder.customer.pincode}</p>
            </div>

            {/* Help CTA */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${storeSettings.phone.replace(/\s/g, '')}`}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm border transition-all hover:scale-[1.02] ${
                  darkMode ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <Phone size={16} /> Call Store
              </a>
              <a
                href={`https://wa.me/${storeSettings.whatsapp}?text=Hi! I need help with my order ${foundOrder.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-[1.02] shadow-md"
              >
                <MessageCircle size={16} /> WhatsApp Help
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
