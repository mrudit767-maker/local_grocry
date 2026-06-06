import { X, Printer, Share2 } from 'lucide-react';
import { useStore, Order } from '../store/useStore';

interface OrderInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderInvoiceModal({ order, onClose }: OrderInvoiceModalProps) {
  const { storeSettings, darkMode } = useStore();

  if (!order) return null;

  const handlePrint = () => {
    // Add print style dynamically
    const printStyle = document.createElement('style');
    printStyle.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        #printable-order-invoice, #printable-order-invoice * {
          visibility: visible !important;
        }
        #printable-order-invoice {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          background: white !important;
          color: black !important;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(printStyle);
    window.print();
    // Cleanup style after print dialog closes
    setTimeout(() => {
      document.head.removeChild(printStyle);
    }, 1000);
  };

  const handleShareWhatsApp = () => {
    const itemsText = order.items.map(i => 
      `- ${i.product.name} (Qty: ${i.quantity}) × ₹${i.product.price} = ₹${i.product.price * i.quantity}`
    ).join('\n');

    const message = `*Krishna Kirana - Order Bill (ID: ${order.id})*\n\n` +
      `Customer Name: ${order.customer.name}\n` +
      `Phone Number: ${order.customer.phone}\n` +
      `Delivery Slot: ${order.deliverySlot || 'N/A'}\n\n` +
      `*Ordered Items:*\n${itemsText}\n\n` +
      `Subtotal: ₹${order.subtotal}\n` +
      `Delivery Fee: ₹${order.deliveryFee}\n` +
      `*Total Amount: ₹${order.total}*\n` +
      `Payment Mode: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})\n\n` +
      `_Thank you for ordering with Krishna Kirana! Your delivery is on the way._`;

    const whatsappUrl = `https://wa.me/${order.customer.phone.replace(/[\s-+]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-y-auto max-h-[92vh] flex flex-col ${
        darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-800'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b dark:border-gray-800 no-print">
          <h3 className="font-extrabold text-sm flex items-center gap-2">
            🧾 Order Invoice & Bill Generator
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 cursor-pointer no-print">
            <X size={18} />
          </button>
        </div>

        {/* Invoice Container (Print Target) */}
        <div id="printable-order-invoice" className="p-6 md:p-8 space-y-6 bg-white text-gray-800 flex-1 overflow-y-auto">
          {/* Shop Header */}
          <div className="flex justify-between items-start border-b border-gray-250 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <img src="/logo.png" alt="Krishna Kirana App Logo" className="w-10 h-10 object-contain" />
                <h2 className="text-xl font-black text-green-700">Krishna Kirana</h2>
              </div>
              <p className="text-xs text-gray-500">{storeSettings.address}</p>
              <p className="text-xs text-gray-500">Call: {storeSettings.phone} | WA: {storeSettings.whatsapp}</p>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-black text-gray-950 tracking-tight uppercase">Invoice</h1>
              <p className="text-[10px] text-gray-500 mt-1">Order ID: <span className="font-bold text-gray-800">{order.id}</span></p>
              <p className="text-[10px] text-gray-500">Date: <span className="font-bold text-gray-800">{formattedDate}</span></p>
              <p className="text-[10px] text-gray-500">Status: <span className="font-bold text-gray-800 capitalize">{order.status}</span></p>
            </div>
          </div>

          {/* Customer & Delivery Metadata */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Bill To:</h4>
              <p className="text-xs font-black text-gray-950 mt-1">{order.customer.name}</p>
              <p className="text-xs text-gray-600 mt-0.5">📞 +91 {order.customer.phone.replace(/[\s-+]/g, '').slice(-10)}</p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Ship To Address:</h4>
              <p className="text-xs text-gray-600 mt-1 leading-normal">{order.customer.address}</p>
              {order.deliverySlot && (
                <p className="text-xs text-green-700 font-bold mt-1">🕒 Delivery Slot: {order.deliverySlot}</p>
              )}
              {order.locationUrl && (
                <p className="text-[10px] text-blue-600 font-semibold mt-1">📍 Linked GPS Navigation Enabled</p>
              )}
            </div>
          </div>

          {/* Order Details & Totals */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-gray-950 tracking-wider">Ordered Items</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-gray-200 text-gray-500">
                  <th className="text-left pb-2 font-bold">Item Name</th>
                  <th className="text-center pb-2 font-bold">Rate</th>
                  <th className="text-center pb-2 font-bold">Qty</th>
                  <th className="text-right pb-2 font-bold">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {order.items.map(item => (
                  <tr key={item.product.id} className="text-gray-700">
                    <td className="py-2.5 font-semibold">
                      {item.product.name}
                      <span className="block text-[10px] text-gray-400 font-normal">{item.product.unit}</span>
                    </td>
                    <td className="py-2.5 text-center">₹{item.product.price}</td>
                    <td className="py-2.5 text-center font-bold">{item.quantity}</td>
                    <td className="py-2.5 text-right font-black text-gray-900">₹{(item.product.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Status & Calculation Totals */}
          <div className="flex justify-between items-start border-t border-gray-200 pt-5">
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment Information</h4>
              <div className="mt-1 space-y-1 text-xs">
                <p className="text-gray-650">Payment Method: <span className="font-bold text-gray-900 capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}</span></p>
                <p className="text-gray-650">Payment Status: <span className={`font-bold ${order.paymentStatus === 'paid' ? 'text-green-700' : 'text-orange-700'} capitalize`}>{order.paymentStatus}</span></p>
                {order.upiRefNo && (
                  <p className="text-[10px] text-gray-400">UPI Ref / UTR: {order.upiRefNo}</p>
                )}
              </div>
            </div>
            <div className="text-right space-y-1.5 w-1/3 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee:</span>
                <span className="font-semibold">{order.deliveryFee > 0 ? `₹${order.deliveryFee.toFixed(2)}` : 'FREE'}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-1.5 border-t border-gray-100">
                <span>Grand Total:</span>
                <span className="text-green-700 text-base">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Boy Signature Grid */}
          <div className="flex justify-between pt-12 border-t border-gray-200 mt-6 text-xs text-gray-500">
            <div className="text-center w-1/3">
              <div className="border-b border-gray-300 pb-1.5 mb-1.5"></div>
              <span>Customer Signature</span>
            </div>
            <div className="text-center w-1/3">
              <div className="border-b border-gray-300 pb-1.5 mb-1.5"></div>
              <span>Store Representative</span>
            </div>
          </div>
        </div>

        {/* Footer Actions Panel */}
        <div className={`p-5 border-t flex flex-wrap justify-between gap-3 no-print ${
          darkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Printer size={14} /> Print Invoice / PDF
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Share2 size={14} /> Send WhatsApp Bill
            </button>
          </div>
          <button
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
              darkMode ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-700'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
