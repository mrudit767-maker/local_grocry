import { Package, Clock, CheckCircle, XCircle, Truck, ChefHat, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Order } from '../store/useStore';

const STATUS_CONFIG: Record<Order['status'], { label: string; color: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-100', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'text-blue-600 bg-blue-100', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'text-orange-600 bg-orange-100', icon: ChefHat },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-purple-600 bg-purple-100', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-green-600 bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-100', icon: XCircle },
};

function OrderCard({ order }: { order: Order }) {
  const { darkMode } = useStore();
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status];
  const StatusIcon = status.icon;

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Package size={15} className="text-green-600" />
              <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{order.id}</p>
            </div>
            <p className="text-gray-500 text-xs mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${status.color}`}>
            <StatusIcon size={11} className={status.color.split(' ')[0]} />
            {status.label}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex -space-x-2">
            {order.items.slice(0, 3).map(item => (
              <img key={item.product.id} src={item.product.image} alt={item.product.name} className="w-10 h-10 rounded-full border-2 border-white object-cover bg-gray-100" onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/40x40/16a34a/ffffff?text=${item.product.name[0]}`; }} />
            ))}
            {order.items.length > 3 && (
              <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                +{order.items.length - 3}
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {order.items.length} item{order.items.length > 1 ? 's' : ''}
            </p>
            <p className="text-green-600 font-bold">₹{order.total}</p>
          </div>
          <button onClick={() => setExpanded(!expanded)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className={`border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-gray-50'} p-4 space-y-3`}>
          {/* Items */}
          <div>
            <p className={`text-xs font-bold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Items Ordered</p>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.product.id} className="flex items-center gap-2">
                  <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded-lg object-cover bg-white" onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/32x32/16a34a/ffffff?text=${item.product.name[0]}`; }} />
                  <span className={`flex-1 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.product.name} ({item.product.unit}) × {item.quantity}</span>
                  <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <p className={`text-xs font-bold mb-1 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Delivery Address</p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{order.customer.name} • {order.customer.phone}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{order.customer.address}, {order.customer.pincode}</p>
          </div>

          {/* Payment */}
          <div>
            <p className={`text-xs font-bold mb-1 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Payment</p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()} •{' '}
              <span className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </p>
          </div>

          {/* Order Steps */}
          <div>
            <p className={`text-xs font-bold mb-2 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Order Journey</p>
            <div className="flex items-center gap-1">
              {(['confirmed', 'preparing', 'out_for_delivery', 'delivered'] as Order['status'][]).map((s, i) => {
                const stepStatuses = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];
                const isCompleted = stepStatuses.indexOf(order.status) >= i;
                return (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`w-full flex flex-col items-center gap-1`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isCompleted ? 'bg-green-600 text-white' : darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
                        {isCompleted ? '✓' : i + 1}
                      </div>
                      <span className={`text-[9px] text-center leading-tight ${isCompleted ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                        {STATUS_CONFIG[s].label}
                      </span>
                    </div>
                    {i < 3 && <div className={`h-0.5 w-full ${isCompleted ? 'bg-green-600' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { orders, setCurrentPage, darkMode } = useStore();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'} py-6`}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>📦 My Orders</h1>
            <p className="text-gray-500 text-sm mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📭</div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping and your orders will appear here.</p>
            <button onClick={() => setCurrentPage('products')} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all">
              Start Shopping →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
