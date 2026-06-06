import { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '../data/products';
import SubscriptionInvoiceModal from '../components/SubscriptionInvoiceModal';

export default function SubscriptionPage() {
  const { products, subscriptions = [], addSubscription, cancelSubscription, currentCustomer, darkMode } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [quantity, setQuantity] = useState(1);
  const [slot, setSlot] = useState('10 AM – 12 PM');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerForm, setCustomerForm] = useState({
    name: currentCustomer?.name || '',
    phone: currentCustomer?.phone || '',
    address: currentCustomer?.address || '',
    city: currentCustomer?.city || 'Bhopal',
    pincode: currentCustomer?.pincode || '',
  });
  const [selectedBillCustomer, setSelectedBillCustomer] = useState<any>(null);

  // Filter products that are eligible for subscription (Milk, Eggs, Bread, Tea, Oats, Dairy, Bread & Bakery)
  const subscriptionEligibleProducts = products.filter(p => 
    p.category === 'dairy' || 
    p.category === 'bread-bakery' || 
    p.name.toLowerCase().includes('milk') ||
    p.name.toLowerCase().includes('egg') ||
    p.name.toLowerCase().includes('bread') ||
    p.name.toLowerCase().includes('tea')
  ).slice(0, 15);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!customerForm.name || !customerForm.phone || !customerForm.address || !customerForm.pincode) {
      toast.error('Please fill all delivery details');
      return;
    }
    addSubscription({
      product: selectedProduct,
      frequency,
      quantity,
      customer: { ...customerForm },
      deliverySlot: slot,
      startDate,
    });
    setSelectedProduct(null);
  };

  const activeSubs = subscriptions.filter(s => s.status === 'active');


  return (
    <div className={`min-h-screen py-10 ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-green-50 dark:bg-green-950/20 flex items-center justify-center text-green-600">
            <RefreshCw size={20} className="animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Daily Essentials Subscription</h1>
            <p className="text-gray-500 text-xs mt-0.5">Subscribe to Milk, Bread & Eggs. Get hassle-free daily delivery.</p>
          </div>
        </div>

        {/* Subscribe Options */}
        <section className="space-y-4">
          <h2 className="text-base font-extrabold flex items-center gap-1.5">
            📦 Subscribe to Essentials
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {subscriptionEligibleProducts.map(p => (
              <div 
                key={p.id} 
                className={`p-3 rounded-2xl border flex flex-col justify-between hover:shadow-md transition-all ${
                  darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                }`}
              >
                <div>
                  <img src={p.image} alt={p.name} className="w-full h-24 object-cover rounded-xl bg-gray-50 mb-3 border border-gray-100 dark:border-gray-800" />
                  <h3 className="text-xs font-bold line-clamp-2 leading-snug">{p.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">{p.unit}</p>
                </div>
                <div className="mt-3 pt-3 border-t dark:border-gray-800 flex items-center justify-between">
                  <span className="text-xs font-black text-green-600">₹{p.price}</span>
                  <button
                    onClick={() => {
                      setSelectedProduct(p);
                      // Pre-fill form if customer details exist
                      if (currentCustomer) {
                        setCustomerForm({
                          name: currentCustomer.name,
                          phone: currentCustomer.phone,
                          address: currentCustomer.address,
                          city: currentCustomer.city,
                          pincode: currentCustomer.pincode,
                        });
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold shadow-sm transition-all"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Subscriptions */}
        <section className="space-y-4">
          <h2 className="text-base font-extrabold flex items-center gap-1.5">
            🗓️ Active Subscriptions ({activeSubs.length})
          </h2>
          {activeSubs.length === 0 ? (
            <div className={`p-8 rounded-3xl border text-center ${
              darkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <p className="text-gray-500 text-xs">No active subscriptions. Click on "Subscribe" under any product above to start.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSubs.map(sub => (
                <div 
                  key={sub.id} 
                  className={`p-5 rounded-3xl border flex gap-4 ${
                    darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                  }`}
                >
                  <img src={sub.product.image} alt={sub.product.name} className="w-16 h-16 rounded-2xl object-cover border bg-gray-50 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                        {sub.frequency}
                      </span>
                      <h3 className="text-xs font-bold leading-snug mt-1.5 dark:text-white">{sub.product.name}</h3>
                      <p className="text-[10px] text-gray-500">Qty: {sub.quantity} • Slot: {sub.deliverySlot}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t dark:border-gray-800">
                      <div className="text-xs">
                        <span className="text-gray-400">Next billing:</span>
                        <p className="font-extrabold text-green-600">₹{sub.product.price * sub.quantity} / delivery</p>
                        <p className="text-[10px] text-gray-500 font-bold">
                          ₹{sub.product.price * sub.quantity * (sub.frequency === 'daily' ? 30 : sub.frequency === 'weekly' ? 4 : 1)} / month
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedBillCustomer({
                              name: sub.customer.name,
                              phone: sub.customer.phone,
                              address: sub.customer.address,
                              city: sub.customer.city,
                              pincode: sub.customer.pincode
                            });
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-[10px] font-bold border border-green-200/50 cursor-pointer"
                        >
                          🧾 Bill
                        </button>
                        <button
                          onClick={() => cancelSubscription(sub.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-[10px] font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modal for Subscription Config */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl overflow-y-auto max-h-[90vh] ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4 pb-2 border-b dark:border-gray-700">
                <h3 className="font-extrabold text-sm flex items-center gap-2">
                  📅 Set Up Recurring Delivery
                </h3>
                <button onClick={() => setSelectedProduct(null)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubscribeSubmit} className="space-y-4 text-xs font-semibold">
                {/* Product Detail */}
                <div className={`p-3 rounded-2xl flex items-center gap-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-12 h-12 rounded-xl object-cover bg-white" />
                  <div>
                    <h4 className="font-bold">{selectedProduct.name}</h4>
                    <p className="text-[10px] text-gray-500">Price: ₹{selectedProduct.price} • Unit: {selectedProduct.unit}</p>
                  </div>
                </div>

                {/* Sub configuration */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1.5">Delivery Frequency *</label>
                    <select
                      value={frequency}
                      onChange={e => setFrequency(e.target.value as any)}
                      className={`w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-green-500 ${
                        darkMode ? 'bg-gray-700 border-gray-650' : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <option value="daily">Everyday (Daily)</option>
                      <option value="weekly">Once a Week</option>
                      <option value="monthly">Once a Month</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5">Quantity *</label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className={`w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-green-500 ${
                        darkMode ? 'bg-gray-700 border-gray-650' : 'bg-gray-50 border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5">Preferred Slot *</label>
                    <select
                      value={slot}
                      onChange={e => setSlot(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-green-500 ${
                        darkMode ? 'bg-gray-700 border-gray-655' : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <option value="10 AM – 12 PM">Morning (10 AM - 12 PM)</option>
                      <option value="12 PM – 2 PM">Noon (12 PM - 2 PM)</option>
                      <option value="2 PM – 4 PM">Afternoon (2 PM - 4 PM)</option>
                      <option value="6 PM – 8 PM">Evening (6 PM - 8 PM)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5">Start Date *</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-green-500 ${
                        darkMode ? 'bg-gray-700 border-gray-650' : 'bg-gray-50 border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Estimated Monthly Cost Summary */}
                <div className={`p-4 rounded-2xl flex items-center justify-between border ${
                  darkMode ? 'bg-green-950/20 border-green-900/30' : 'bg-green-50 border-green-100'
                }`}>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Estimated Monthly Cost</p>
                    <p className="text-[10px] text-green-700 dark:text-green-400 font-medium mt-0.5">
                      ₹{selectedProduct.price} × {quantity} Qty × {frequency === 'daily' ? 30 : frequency === 'weekly' ? 4 : 1} deliveries
                    </p>
                  </div>
                  <span className="text-base font-black text-green-600">
                    ₹{selectedProduct.price * quantity * (frequency === 'daily' ? 30 : frequency === 'weekly' ? 4 : 1)}
                  </span>
                </div>

                {/* Delivery details */}
                <div className="space-y-3 pt-3 border-t dark:border-gray-700">
                  <p className="font-extrabold">📍 Delivery Location</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block mb-1.5">Customer Name *</label>
                      <input
                        type="text"
                        value={customerForm.name}
                        onChange={e => setCustomerForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Rahul Sharma"
                        className={`w-full px-3 py-2 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-650' : 'bg-gray-55 border-gray-300'}`}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5">Mobile Number *</label>
                      <input
                        type="tel"
                        value={customerForm.phone}
                        onChange={e => setCustomerForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="10-digit number"
                        className={`w-full px-3 py-2 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-650' : 'bg-gray-55 border-gray-300'}`}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5">Pincode *</label>
                      <input
                        type="text"
                        value={customerForm.pincode}
                        onChange={e => setCustomerForm(f => ({ ...f, pincode: e.target.value }))}
                        placeholder="462038"
                        className={`w-full px-3 py-2 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-650' : 'bg-gray-55 border-gray-300'}`}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block mb-1.5">Full Delivery Address *</label>
                      <input
                        type="text"
                        value={customerForm.address}
                        onChange={e => setCustomerForm(f => ({ ...f, address: e.target.value }))}
                        placeholder="Flat No, House No, Street name"
                        className={`w-full px-3 py-2 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-650' : 'bg-gray-55 border-gray-300'}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    Start Subscription
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="px-5 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {selectedBillCustomer && (
          <SubscriptionInvoiceModal
            customer={selectedBillCustomer}
            onClose={() => setSelectedBillCustomer(null)}
          />
        )}
      </div>
    </div>
  );
}
