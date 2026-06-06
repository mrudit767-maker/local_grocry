import { useState } from 'react';
import { X, Printer, Share2 } from 'lucide-react';
import { useStore } from '../store/useStore';

interface SubscriptionInvoiceModalProps {
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  } | null;
  onClose: () => void;
}

export default function SubscriptionInvoiceModal({ customer, onClose }: SubscriptionInvoiceModalProps) {
  const { subscriptions = [], storeSettings, darkMode } = useStore();

  if (!customer) return null;

  // Clean customer phone format for lookup (10 digits)
  const customerPhoneClean = customer.phone.replace(/[\s-+]/g, '').slice(-10);

  // Load checked days from localStorage on mount (unique key based on customer phone & month)
  const storageKey = `delivery-checklist-${customerPhoneClean}-${new Date().getMonth() + 1}`;
  const [checkedDays, setCheckedDays] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const toggleDay = (dayIndex: number) => {
    const updated = { ...checkedDays, [dayIndex]: !checkedDays[dayIndex] };
    setCheckedDays(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };
  
  // Filter active subscriptions for this customer
  const activeSubs = subscriptions.filter(
    s => s.status === 'active' && s.customer.phone.replace(/[\s-+]/g, '').slice(-10) === customerPhoneClean
  );

  const getDeliveriesCount = (freq: 'daily' | 'weekly' | 'monthly') => {
    if (freq === 'daily') return 30;
    if (freq === 'weekly') return 4;
    return 1;
  };


  // Calculations
  const subtotal = activeSubs.reduce((acc, sub) => {
    const deliveries = getDeliveriesCount(sub.frequency);
    return acc + sub.product.price * sub.quantity * deliveries;
  }, 0);

  const total = subtotal;

  const handlePrint = () => {
    // Add print style dynamically
    const printStyle = document.createElement('style');
    printStyle.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        #printable-invoice, #printable-invoice * {
          visibility: visible !important;
        }
        #printable-invoice {
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
    const itemsText = activeSubs.map(s => 
      `- ${s.product.name} (Qty: ${s.quantity}) [${s.frequency.toUpperCase()}]: ₹${s.product.price * s.quantity}/delivery (Monthly total: ₹${s.product.price * s.quantity * getDeliveriesCount(s.frequency)})`
    ).join('\n');

    const message = `*Krishna Kirana - Subscription Bill Summary*\n\n` +
      `Customer Name: ${customer.name}\n` +
      `Phone Number: ${customer.phone}\n` +
      `Delivery Slot: ${activeSubs[0]?.deliverySlot || 'N/A'}\n\n` +
      `*Subscribed Items:*\n${itemsText}\n\n` +
      `*Estimated Monthly Total: ₹${total}*\n\n` +
      `_This bill can be verified daily upon delivery. Thank you for subscribing with us!_`;

    const whatsappUrl = `https://wa.me/${customer.phone.replace(/[\s-+]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-y-auto max-h-[92vh] flex flex-col ${
        darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-800'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b dark:border-gray-800 no-print">
          <h3 className="font-extrabold text-sm flex items-center gap-2">
            🧾 Subscription Invoice & Billing
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 cursor-pointer no-print">
            <X size={18} />
          </button>
        </div>

        {/* Invoice Container (Print Target) */}
        <div id="printable-invoice" className="p-6 md:p-8 space-y-6 flex-1 bg-white text-gray-800 overflow-y-auto">
          {/* Shop & Invoice Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <img src="/logo.png" alt="Krishna Kirana App Logo" className="w-10 h-10 object-contain" />
                <h2 className="text-xl font-black text-green-700">Krishna Kirana</h2>
              </div>
              <p className="text-xs text-gray-500">{storeSettings.address}</p>
              <p className="text-xs text-gray-500">Call: {storeSettings.phone} | WA: {storeSettings.whatsapp}</p>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Invoice</h1>
              <p className="text-[10px] text-gray-500 mt-1">Invoice ID: <span className="font-bold text-gray-700">KK-SUB-{customerPhoneClean.slice(-4)}-{new Date().getMonth() + 1}</span></p>
              <p className="text-[10px] text-gray-500">Billing Period: <span className="font-bold text-gray-700">{currentMonthName}</span></p>
              <p className="text-[10px] text-gray-500">Date: <span className="font-bold text-gray-700">{new Date().toLocaleDateString('en-IN')}</span></p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Bill To:</h4>
              <p className="text-xs font-black text-gray-900 mt-1">{customer.name}</p>
              <p className="text-xs text-gray-600 mt-0.5">📞 +91 {customerPhoneClean}</p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Delivery Location:</h4>
              <p className="text-xs text-gray-600 mt-1 leading-normal">{customer.address}, {customer.city} - {customer.pincode}</p>
              <p className="text-xs text-green-700 font-bold mt-1">🕒 Slot: {activeSubs[0]?.deliverySlot || 'N/A'}</p>
            </div>
          </div>

          {/* Subscribed Items Table */}
          <div>
            <h3 className="text-xs font-black uppercase text-gray-900 mb-3 tracking-wider">Subscribed Essentials</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-gray-200 text-gray-500">
                  <th className="text-left pb-2 font-bold">Item Description</th>
                  <th className="text-center pb-2 font-bold">Rate</th>
                  <th className="text-center pb-2 font-bold">Qty</th>
                  <th className="text-left pb-2 font-bold">Frequency</th>
                  <th className="text-center pb-2 font-bold">Deliveries/Month</th>
                  <th className="text-right pb-2 font-bold">Amount / Month</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {activeSubs.map(sub => {
                  const deliveriesCount = getDeliveriesCount(sub.frequency);
                  const itemMonthlyTotal = sub.product.price * sub.quantity * deliveriesCount;
                  return (
                    <tr key={sub.id} className="text-gray-700">
                      <td className="py-3 font-semibold">
                        {sub.product.name}
                        <span className="block text-[10px] text-gray-400 font-normal">{sub.product.unit}</span>
                      </td>
                      <td className="py-3 text-center">₹{sub.product.price}</td>
                      <td className="py-3 text-center font-bold">{sub.quantity}</td>
                      <td className="py-3 capitalize font-medium text-green-700">{sub.frequency}</td>
                      <td className="py-3 text-center">{deliveriesCount}</td>
                      <td className="py-3 text-right font-black text-gray-900">₹{itemMonthlyTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Subtotal & Summary */}
          <div className="flex justify-between items-start border-t border-gray-200 pt-5">
            <div className="max-w-[60%]">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment Instructions</h4>
              <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                Monthly essentials are delivered daily based on the selected slot. Payment can be settled via Cash or UPI using QR Scanner at the end of the billing cycle.
              </p>
            </div>
            <div className="text-right space-y-1.5 w-1/3">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Delivery Charge:</span>
                <span className="font-semibold text-green-700">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-1.5 border-t border-gray-100">
                <span>Total Amount:</span>
                <span className="text-green-700 text-base">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Daily Delivery Matching Sheet (Checkbox Grid) */}
          <div className="border-t border-dashed border-gray-300 pt-6">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider">
                  📅 Delivery Log Checklist
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Use this grid to check off daily deliveries as they arrive to keep accurate records.</p>
              </div>
              <span className="text-[10px] border border-gray-300 rounded px-2 py-0.5 font-bold uppercase text-gray-400 bg-gray-50">Verification Log</span>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {Array.from({ length: 30 }).map((_, i) => {
                const isChecked = !!checkedDays[i];
                return (
                  <div 
                    key={i} 
                    onClick={() => toggleDay(i)}
                    className={`border rounded-xl p-2 text-center transition-all cursor-pointer select-none ${
                      isChecked 
                        ? 'bg-green-50 border-green-300 dark:bg-green-950/20 dark:border-green-800' 
                        : 'border-gray-205 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <span className={`block text-[8px] font-black mb-1 ${
                      isChecked ? 'text-green-600 dark:text-green-400 font-bold' : 'text-gray-400'
                    }`}>Day {i + 1}</span>
                    <div className={`w-5 h-5 border rounded mx-auto flex items-center justify-center transition-all ${
                      isChecked 
                        ? 'border-green-600 bg-green-600 text-white font-bold' 
                        : 'border-gray-300 bg-white hover:border-green-500'
                    }`}>
                      <span className={`text-[10px] font-black transition-opacity ${
                        isChecked ? 'opacity-100' : 'opacity-0 hover:opacity-50 text-green-600'
                      }`}>✓</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Signature / Bottom Section */}
          <div className="flex justify-between pt-10 border-t border-gray-200 mt-6 text-xs text-gray-500">
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
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Share2 size={14} /> WhatsApp Bill
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
