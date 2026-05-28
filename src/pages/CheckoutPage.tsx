import { useState } from 'react';
import { ChevronLeft, CreditCard, Smartphone, Banknote, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import { saveOrderToSheet, formatOrderForSheet } from '../utils/googleSheets';

type PaymentMethod = 'cod' | 'upi' | 'razorpay';

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart, placeOrder, setCurrentPage, darkMode, storeSettings, currentCustomer } = useStore();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: currentCustomer?.name || '',
    phone: currentCustomer?.phone ? currentCustomer.phone.replace('+91 ', '') : '',
    email: '',
    address: currentCustomer?.address || '',
    city: currentCustomer?.city || 'Bhopal',
    pincode: currentCustomer?.pincode || '',
    landmark: '',
  });
  const [upiId, setUpiId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= storeSettings.freeDeliveryAbove ? 0 : storeSettings.deliveryFee;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.match(/^[6-9]\d{9}$/)) newErrors.phone = 'Enter valid 10-digit mobile number';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.pincode.match(/^\d{6}$/)) newErrors.pincode = 'Enter valid 6-digit pincode';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (paymentMethod === 'razorpay') {
        // Simulate Razorpay flow
        await new Promise(r => setTimeout(r, 1500));
        toast.success('Payment gateway integration pending. Placing as COD.', { duration: 3000 });
      } else if (paymentMethod === 'upi') {
        if (!upiId.includes('@')) {
          toast.error('Please enter a valid UPI ID');
          setLoading(false);
          return;
        }
        await new Promise(r => setTimeout(r, 1000));
        toast.success(`UPI payment request sent to ${upiId}`, { duration: 3000 });
      }

      placeOrder({
        items: cart,
        customer: {
          name: form.name,
          phone: form.phone,
          address: `${form.address}, ${form.landmark ? form.landmark + ', ' : ''}${form.city}`,
          city: form.city,
          pincode: form.pincode,
        },
        total,
        subtotal,
        deliveryFee,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        status: 'confirmed',
      });

      // Sync to Google Sheets (fire-and-forget, never blocks checkout)
      if (storeSettings.googleSheetWebhookUrl) {
        const sheetData = formatOrderForSheet({
          customer: {
            name: form.name,
            phone: form.phone,
            address: `${form.address}, ${form.landmark ? form.landmark + ', ' : ''}${form.city}`,
            city: form.city,
            pincode: form.pincode,
          },
          items: cart,
          paymentMethod,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        });
        saveOrderToSheet(storeSettings.googleSheetWebhookUrl, sheetData)
          .then(result => { if (result.success) console.log('✅ Order synced to Google Sheet'); })
          .catch(() => {});
      }

      clearCart();
      setCurrentPage('order-success');
      toast.success('Order placed successfully! 🎉');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your cart is empty</h2>
          <button onClick={() => setCurrentPage('products')} className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold mt-4 hover:bg-green-700">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} py-6`}>
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setCurrentPage('products')} className={`p-2 rounded-xl ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Checkout</h1>
            <p className="text-gray-500 text-sm">Complete your order</p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {['Delivery', 'Payment', 'Review'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > i + 1 ? 'bg-green-600 text-white' : step === i + 1 ? 'bg-green-600 text-white ring-4 ring-green-100' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-medium ${step === i + 1 ? (darkMode ? 'text-white' : 'text-gray-900') : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 w-8 ${step > i + 1 ? 'bg-green-600' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-4">

            {/* Step 1: Delivery */}
            {step === 1 && (
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h2 className={`text-lg font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>📍 Delivery Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Full Name *', placeholder: 'e.g. Rahul Sharma', type: 'text', full: false },
                    { key: 'phone', label: 'Mobile Number *', placeholder: '10-digit number', type: 'tel', full: false },
                    { key: 'email', label: 'Email (Optional)', placeholder: 'email@example.com', type: 'email', full: true },
                    { key: 'address', label: 'Full Address *', placeholder: 'House/Flat No., Street, Area', type: 'text', full: true },
                    { key: 'landmark', label: 'Landmark', placeholder: 'Near temple, school, etc.', type: 'text', full: true },
                    { key: 'city', label: 'City *', placeholder: 'Your city', type: 'text', full: false },
                    { key: 'pincode', label: 'Pincode *', placeholder: '6-digit pincode', type: 'text', full: false },
                  ].map(field => (
                    <div key={field.key} className={field.full ? 'sm:col-span-2' : ''}>
                      <label className={`block text-sm font-semibold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{field.label}</label>
                      <input
                        type={field.type}
                        value={form[field.key as keyof typeof form]}
                        onChange={e => { setForm(f => ({ ...f, [field.key]: e.target.value })); setErrors(er => ({ ...er, [field.key]: '' })); }}
                        placeholder={field.placeholder}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-green-500 ${
                          errors[field.key]
                            ? 'border-red-400 bg-red-50'
                            : darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                        }`}
                      />
                      {errors[field.key] && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={11} /> {errors[field.key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { if (validate()) setStep(2); }}
                  className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition-all"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h2 className={`text-lg font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>💳 Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id: 'cod', icon: Banknote, label: 'Cash on Delivery', desc: 'Pay when your order arrives', badge: 'Most Popular', color: 'text-green-600' },
                    { id: 'upi', icon: Smartphone, label: 'UPI Payment', desc: 'Google Pay, PhonePe, Paytm, BHIM UPI', badge: 'Instant', color: 'text-blue-600' },
                    { id: 'razorpay', icon: CreditCard, label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay via Razorpay', badge: 'Secure', color: 'text-purple-600' },
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        paymentMethod === method.id
                          ? 'border-green-500 bg-green-50'
                          : darkMode
                          ? 'border-gray-700 bg-gray-700 hover:border-gray-600'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${paymentMethod === method.id ? 'bg-green-100' : darkMode ? 'bg-gray-600' : 'bg-white'} border ${paymentMethod === method.id ? 'border-green-300' : 'border-gray-200'}`}>
                        <method.icon size={20} className={paymentMethod === method.id ? 'text-green-600' : method.color} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{method.label}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${paymentMethod === method.id ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{method.badge}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-green-600 bg-green-600' : 'border-gray-300'}`}>
                        {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'upi' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <label className="block text-sm font-semibold text-blue-800 mb-2">Enter UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="yourname@upi, 9876543210@paytm"
                      className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                        <span key={app} className="px-3 py-1 bg-white border border-blue-200 rounded-full text-xs font-medium text-blue-700">{app}</span>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMethod === 'razorpay' && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 text-purple-800 text-sm font-semibold">
                      <Shield size={14} /> 100% Secure Payment via Razorpay
                    </div>
                    <p className="text-xs text-purple-600 mt-1">Your payment is encrypted and secure. Card details are not stored.</p>
                    <div className="flex gap-2 mt-2">
                      {['VISA', 'MC', 'RuPay', 'NetBanking'].map(card => (
                        <span key={card} className="px-3 py-1 bg-white border border-purple-200 rounded-full text-xs font-medium text-purple-700">{card}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className={`flex-1 py-3.5 rounded-xl font-bold border transition-all ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    ← Back
                  </button>
                  <button onClick={() => setStep(3)} className="flex-2 flex-1 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition-all">
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h2 className={`text-lg font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>📋 Review Your Order</h2>

                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.product.id} className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover bg-white" onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/48x48/16a34a/ffffff?text=${item.product.name[0]}`; }} />
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.product.name}</p>
                        <p className="text-gray-500 text-xs">{item.product.unit} × {item.quantity}</p>
                      </div>
                      <p className="font-bold text-green-600">₹{item.product.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-5`}>
                  <h3 className={`font-bold text-sm mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delivery To:</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{form.name}</p>
                  <p className="text-gray-500 text-sm">{form.phone}</p>
                  <p className="text-gray-500 text-sm">{form.address}, {form.city} - {form.pincode}</p>
                  <p className={`text-sm mt-2 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Payment: {paymentMethod === 'cod' ? '💵 Cash on Delivery' : paymentMethod === 'upi' ? `📱 UPI (${upiId})` : '💳 Card (Razorpay)'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className={`flex-1 py-3.5 rounded-xl font-bold border transition-all ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                    ) : (
                      <><CheckCircle size={18} /> Place Order (₹{total})</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className={`p-5 rounded-2xl border sticky top-24 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : `font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span className="text-green-600 font-semibold">-₹{discount}</span>
                  </div>
                )}
                <div className={`flex justify-between font-bold text-base border-t pt-2 ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'}`}>
                  <span>Total</span>
                  <span className="text-green-600">₹{total}</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-green-900/30' : 'bg-green-50'} border border-green-200`}>
                <p className="text-green-700 text-xs font-semibold flex items-center gap-1.5">
                  <Shield size={12} /> 100% Safe & Secure
                </p>
                <p className="text-green-600 text-xs mt-0.5">Your order is protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
