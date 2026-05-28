import { CheckCircle, Package, Clock, MessageCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function OrderSuccessPage() {
  const { orders, checkoutOrderId, setCurrentPage, darkMode, storeSettings } = useStore();
  const order = orders.find(o => o.id === checkoutOrderId) || orders[0];

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-md w-full text-center">
        {/* Success Animation */}
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle className="text-green-600" size={60} />
          </div>
          <div className="absolute -top-2 -right-2 text-3xl animate-bounce">🎉</div>
          <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce delay-100">✨</div>
        </div>

        <h1 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order Placed!</h1>
        <p className="text-gray-500 mb-6">Your order has been successfully placed and will be delivered soon.</p>

        {order && (
          <div className={`p-5 rounded-2xl border mb-6 text-left ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-xs">Order ID</p>
                <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{order.id}</p>
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full capitalize">
                {order.status}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <Package size={15} className="text-green-600 mt-0.5" />
                <div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  <p className="text-gray-500 text-xs">{order.items.slice(0, 2).map(i => i.product.name).join(', ')}{order.items.length > 2 ? ` +${order.items.length - 2} more` : ''}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={15} className="text-blue-500 mt-0.5" />
                <div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Estimated Delivery</p>
                  <p className="text-gray-500 text-xs">Within 30-45 minutes</p>
                </div>
              </div>
            </div>

            <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Paid</span>
                <span className={`font-bold text-green-600 text-base`}>₹{order.total}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Payment</span>
                <span className="capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Delivery to</span>
                <span className="max-w-[60%] text-right">{order.customer.address}</span>
              </div>
            </div>
          </div>
        )}

        {/* Order Track Steps */}
        <div className={`p-4 rounded-2xl border mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <p className={`text-sm font-bold mb-3 text-left ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order Status</p>
          <div className="flex items-center justify-between">
            {['Confirmed', 'Preparing', 'On the Way', 'Delivered'].map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-green-600 text-white' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                  {i === 0 ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] font-medium text-center leading-tight ${i === 0 ? 'text-green-600' : 'text-gray-400'}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => setCurrentPage('orders')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            Track My Order <ArrowRight size={18} />
          </button>
          <button
            onClick={() => setCurrentPage('home')}
            className={`w-full py-3.5 rounded-xl font-bold border transition-all ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Continue Shopping
          </button>
          <a
            href={`https://wa.me/${storeSettings.whatsapp}?text=Hi! I just placed order ${order?.id}. Please confirm!`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all"
          >
            <MessageCircle size={16} /> Confirm via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
