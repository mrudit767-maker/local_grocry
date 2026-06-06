import { useState } from 'react';
import { Search, ChevronLeft, Package, CheckCircle, Truck, Clock, XCircle, Phone, MessageCircle, ChefHat, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';

const STATUS_STEPS = [
  { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle, desc: 'Your order has been received and confirmed', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-950/20' },
  { key: 'preparing', label: 'Packing Items', icon: ChefHat, desc: 'Our store hero is packing your fresh items with care', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-950/20' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, desc: 'Your delivery partner is riding to your location', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-950/20' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, desc: 'Order delivered successfully. Thank you!', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-950/20' },
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-800'}`}>
      
      {/* Visual Header */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 text-white py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-1.5 text-green-100 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <ChevronLeft size={14} /> Back to Home
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow">
              <Package size={24} className="animate-bounce" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Live Order Tracking</h1>
              <p className="text-green-100 text-xs font-semibold">Track your Apna Kirana delivery real-time</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        
        {/* Search Panel */}
        <div className={`p-6 rounded-3xl border shadow-premium ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200/60'
        }`}>
          <h2 className="text-sm font-extrabold flex items-center gap-2 mb-4">
            🔍 Enter Tracking Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-1.5">Order ID *</label>
              <input
                type="text"
                value={orderId}
                onChange={e => { setOrderId(e.target.value.toUpperCase()); setSearched(false); }}
                placeholder="ORD178000..."
                className={`w-full px-4 py-3 rounded-xl border text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-green-500 ${
                  darkMode ? 'bg-gray-800 border-gray-700 placeholder-gray-500' : 'bg-gray-50 border-gray-300 placeholder-gray-400'
                }`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-1.5">Mobile Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value); setSearched(false); }}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="10-digit number"
                className={`w-full px-4 py-3 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-green-500 ${
                  darkMode ? 'bg-gray-800 border-gray-700 placeholder-gray-500' : 'bg-gray-50 border-gray-300 placeholder-gray-400'
                }`}
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={!orderId.trim() || !phone.trim()}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <Search size={16} /> Track Order Status
          </button>
        </div>

        {/* Not found State */}
        {searched && !foundOrder && (
          <div className={`p-8 rounded-3xl border text-center shadow-premium ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-base font-extrabold mb-1">Order Details Not Found</h3>
            <p className="text-gray-500 text-xs px-6 mb-6">Double check your Order ID and mobile number or contact customer care to sync your offline details.</p>
            <a
              href={`https://wa.me/${storeSettings.whatsapp}?text=Hi! I am tracking Order: ${orderId} but it says not found.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all"
            >
              <MessageCircle size={14} /> Contact support on WhatsApp
            </a>
          </div>
        )}

        {/* Found State */}
        {foundOrder && (
          <div className="space-y-6">
            
            {/* Summary Header */}
            <div className={`p-6 rounded-3xl border shadow-premium ${
              darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200/60'
            }`}>
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Order</span>
                  <h3 className="font-mono text-base font-black text-green-600">{foundOrder.id}</h3>
                  <p className="text-[10px] text-gray-500 font-semibold">
                    Placed on: {new Date(foundOrder.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-green-600">₹{foundOrder.total}</p>
                  <p className="text-[10px] text-gray-500 font-semibold">{foundOrder.items.length} items</p>
                  <span className={`inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full mt-1.5 ${
                    foundOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-850'
                  }`}>
                    {foundOrder.paymentStatus === 'paid' ? 'Paid' : 'Cash on Delivery (COD)'}
                  </span>
                </div>
              </div>

              {foundOrder.deliverySlot && (
                <div className="mt-4 pt-4 border-t border-dashed dark:border-gray-800 flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50/50 dark:bg-green-950/20 px-3 py-2 rounded-xl">
                  <span>🕒 Scheduled delivery slot: <strong>{foundOrder.deliverySlot}</strong></span>
                </div>
              )}

              {/* Status overrides */}
              {foundOrder.status === 'cancelled' && (
                <div className="mt-4 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/50">
                  <XCircle className="text-red-500 shrink-0" size={22} />
                  <div>
                    <p className="font-bold text-red-700 text-xs dark:text-red-400">Order Cancelled</p>
                    <p className="text-red-500 text-[10px] dark:text-red-405">This order has been cancelled. Please contact us on WhatsApp for refund inquiries.</p>
                  </div>
                </div>
              )}

              {foundOrder.status === 'pending' && (
                <div className="mt-4 flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-2xl border border-yellow-250 dark:border-yellow-900/50">
                  <Clock className="text-yellow-600 shrink-0" size={22} />
                  <div>
                    <p className="font-bold text-yellow-700 text-xs dark:text-yellow-400">Awaiting Store Confirmation</p>
                    <p className="text-yellow-600 text-[10px] dark:text-yellow-405">We have received your order details and are confirming with the nearest store branch.</p>
                  </div>
                </div>
              )}
            </div>

            {/* LIVE VERTICAL PROGRESS TIMELINE */}
            {foundOrder.status !== 'cancelled' && foundOrder.status !== 'pending' && (
              <div className={`p-6 rounded-3xl border shadow-premium ${
                darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200/60'
              }`}>
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-6">🚚 Live Tracking Timeline</h3>
                
                <div className="relative pl-2">
                  {STATUS_STEPS.map((step, idx) => {
                    const stepIndex = STATUS_ORDER.indexOf(step.key);
                    const isCompleted = currentStatusIndex >= stepIndex;
                    const isActive = STATUS_ORDER[currentStatusIndex] === step.key;
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="flex gap-4 relative">
                        {/* Bullet / Connector */}
                        <div className="flex flex-col items-center shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? isActive
                                ? 'bg-green-600 text-white ring-4 ring-green-100 dark:ring-green-950/40 font-bold scale-110 shadow-md'
                                : 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                          }`}>
                            {isCompleted && !isActive ? '✓' : <Icon size={15} />}
                          </div>
                          {idx < STATUS_STEPS.length - 1 && (
                            <div className={`w-0.5 h-12 my-1 rounded-full ${
                              isCompleted && currentStatusIndex > stepIndex ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-800'
                            }`} />
                          )}
                        </div>

                        {/* Text Content */}
                        <div className="pb-8 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-extrabold ${
                              isCompleted ? (darkMode ? 'text-white' : 'text-gray-900') : 'text-gray-400'
                            }`}>
                              {step.label}
                            </span>
                            {isActive && (
                              <span className="text-[8px] bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 px-2 py-0.5 rounded-full font-black uppercase animate-pulse">
                                Live Now
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] font-semibold mt-0.5 ${
                            isCompleted ? (darkMode ? 'text-gray-400' : 'text-gray-500') : 'text-gray-550'
                          }`}>
                            {step.desc}
                          </p>
                          {isCompleted && (
                            <span className="text-[9px] text-green-600 block mt-1 font-semibold">
                              Updated: {new Date(foundOrder.updatedAt).toLocaleTimeString('en-IN', { timeStyle: 'short' })}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Delivery Partner Details (Out for Delivery state) */}
            {foundOrder.status === 'out_for_delivery' && (
              <div className={`p-6 rounded-3xl border shadow-premium ${
                darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200/60'
              } space-y-4`}>
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-450">🚴 Delivery Partner Details</h3>
                <div className="flex gap-4 items-center">
                  <img 
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=100&w=100" 
                    alt="Delivery Hero" 
                    className="w-12 h-12 rounded-2xl object-cover border bg-gray-50"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold">Ramesh Kumar</span>
                      <span className="text-[8px] font-bold bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <ShieldCheck size={9} /> Healthy
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500">Activa (MP 04 XY 7890) • Temp: 97.8°F</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href="tel:+919876543210"
                      className="p-2.5 rounded-xl bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400 hover:scale-105 transition-all"
                    >
                      <Phone size={15} />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Map Link / Coordinate Pin Info */}
            {foundOrder.locationUrl && (
              <div className={`p-5 rounded-3xl border ${
                darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200/60'
              } space-y-2`}>
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-450">📍 GPS Navigation Linked</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed font-semibold">
                  Your device GPS coordinates have been loaded directly into the delivery driver's navigator app to guarantee precision routing.
                </p>
                <a 
                  href={foundOrder.locationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 hover:underline font-bold inline-block"
                >
                  View linked location on Google Maps →
                </a>
              </div>
            )}

            {/* Order Items */}
            <div className={`p-6 rounded-3xl border shadow-premium ${
              darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200/60'
            }`}>
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">🛒 Order Content</h3>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {foundOrder.items.map(item => (
                  <div key={item.product.id} className={`flex items-center gap-3 p-3 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-10 h-10 rounded-xl object-cover bg-white border"
                      onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/40x40/16a34a/ffffff?text=${item.product.name[0]}`; }}
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold leading-tight">{item.product.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{item.product.unit} • Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-black text-green-600">₹{item.product.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t dark:border-gray-800 flex justify-between font-black text-xs">
                <span>Total Amount Paid</span>
                <span className="text-green-600 text-sm">₹{foundOrder.total}</span>
              </div>
            </div>

            {/* Support Options */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${storeSettings.phone.replace(/\s/g, '')}`}
                className={`flex items-center justify-center gap-1.5 py-3.5 rounded-2xl font-bold text-xs border transition-all hover:scale-[1.02] cursor-pointer ${
                  darkMode ? 'border-gray-700 text-gray-300 bg-gray-900 hover:bg-gray-800' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <Phone size={13} /> Call Store Branch
              </a>
              <a
                href={`https://wa.me/${storeSettings.whatsapp}?text=Hi! I need help with my Apna Kirana order ${foundOrder.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-3.5 rounded-2xl font-bold text-xs bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-[1.02] shadow-sm cursor-pointer"
              >
                <MessageCircle size={13} /> Help on WhatsApp
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
