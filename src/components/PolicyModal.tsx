import { X, ShieldAlert, FileText, BadgePercent } from 'lucide-react';

interface PolicyModalProps {
  type: 'privacy' | 'terms' | 'refund' | null;
  onClose: () => void;
  shopName: string;
  email: string;
  phone: string;
}

export default function PolicyModal({ type, onClose, shopName, email, phone }: PolicyModalProps) {
  if (!type) return null;

  const contentMap = {
    privacy: {
      title: 'Privacy Policy',
      icon: <ShieldAlert className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      sections: [
        {
          heading: '1. Information We Collect',
          text: `We collect personal information such as your name, phone number, email address, shipping/delivery address, and pincode during account registration and checkout to process your orders successfully.`
        },
        {
          heading: '2. How We Use Your Information',
          text: `Your personal data is used solely for processing orders, coordinating deliveries, verifying accounts via secure OTP, and sending order status alerts. We do not use your information for unsolicited advertising.`
        },
        {
          heading: '3. Data Protection & Storage',
          text: `All customer information and order details are stored securely using Google Cloud servers linked to our Google Sheets backend. We never share, sell, or rent customer databases to third parties.`
        },
        {
          heading: '4. Cookies & Security',
          text: `We use cookies to maintain your login session and save your cart items locally. Our platform employs secure HTTPS connections to protect data transmission.`
        }
      ]
    },
    terms: {
      title: 'Terms of Service',
      icon: <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      sections: [
        {
          heading: '1. Account & Registration',
          text: `To place orders, customers must create an account verified with a valid email OTP. You are responsible for ensuring that the contact details and address provided are accurate.`
        },
        {
          heading: '2. Pricing & Product Availability',
          text: `All prices listed in our catalog represent Maximum Retail Prices (MRP) and discounted selling prices. We make every effort to display accurate stock availability, but items may become unavailable before processing.`
        },
        {
          heading: '3. Order Acceptance & Cancellations',
          text: `${shopName} reserves the right to reject or cancel any orders due to incorrect pricing, out-of-stock items, or addresses outside our delivery zones. Customers can cancel orders before dispatch by contacting us on WhatsApp/phone.`
        },
        {
          heading: '4. Delivery & Payments',
          text: `We offer Cash on Delivery (COD) and secure online UPI payments. Deliveries will be completed within our designated delivery slots to the exact address provided.`
        }
      ]
    },
    refund: {
      title: 'Refund & Cancellation Policy',
      icon: <BadgePercent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      sections: [
        {
          heading: '1. Returns & Inspection',
          text: `Since groceries include fresh and perishable items (such as milk, vegetables, and bread), we request customers to inspect all products at the time of delivery. Returns are accepted only at the doorstep if items are damaged or incorrect.`
        },
        {
          heading: '2. Cancellation Window',
          text: `Orders can be cancelled free of charge by contacting us directly on WhatsApp (${phone}) before the order status is marked as 'Out for Delivery'. Once the delivery partner leaves the store, orders cannot be cancelled.`
        },
        {
          heading: '3. Refund Timelines',
          text: `For prepaid orders (paid online via UPI/GPay), refunds for cancelled or returned items will be processed directly to your original payment source within 24 to 48 hours.`
        },
        {
          heading: '4. Delivery Issues',
          text: `If a delivery is delayed due to weather or natural traffic conditions, we will notify you and offer an alternative slot or a full refund for prepaid orders.`
        }
      ]
    }
  };

  const { title, icon, sections } = contentMap[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-2xl overflow-hidden animate-scale-up max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-lg font-black text-gray-900 dark:text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          <p className="text-xs text-gray-400 italic">
            Last Updated: June 2026. This policy applies to all orders placed at {shopName}.
          </p>

          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
                {sec.heading}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm pl-0.5">
                {sec.text}
              </p>
            </div>
          ))}

          {/* Contact Details */}
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 text-xs text-emerald-800 dark:text-emerald-300">
            <span className="font-bold block mb-1">📞 Contact Support:</span>
            For any queries regarding our policies, reach out to us at:
            <ul className="list-disc list-inside mt-1.5 space-y-1">
              <li>Shop: <b>{shopName}</b></li>
              <li>Phone: <b>{phone}</b></li>
              <li>Email: <b>{email}</b></li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
          >
            I Understand & Accept
          </button>
        </div>

      </div>
    </div>
  );
}
