import { MapPin, Phone, Mail, Clock, Navigation, MessageCircle, ChevronLeft, ExternalLink } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function LocationPage() {
  const { darkMode, setCurrentPage, storeSettings } = useStore();

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(storeSettings.address)}&output=embed&z=16`;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-green-100 hover:text-white mb-4 text-sm font-medium transition-colors"
          >
            <ChevronLeft size={16} /> Back to Home
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <MapPin size={22} />
            </div>
            <h1 className="text-3xl font-black">Find Our Store</h1>
          </div>
          <p className="text-green-100 text-sm">Visit us in-store or order online for home delivery</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Map — takes 3/5 */}
          <div className="lg:col-span-3">
            <div className={`rounded-3xl overflow-hidden shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="relative">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="420"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Krishna Kirana Shop Location"
                  className="w-full"
                />
                {/* Overlay badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg flex items-center gap-2">
                  <img src="/logo.png" alt="logo" className="h-8 w-8 object-contain" />
                  <div>
                    <p className="font-black text-green-700 text-sm leading-none">{storeSettings.shopName}</p>
                    <p className="text-xs text-gray-500">{storeSettings.tagline}</p>
                  </div>
                </div>
              </div>

              {/* Map Actions */}
              <div className={`p-4 flex gap-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <a
                  href={storeSettings.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold text-sm transition-all shadow-md"
                >
                  <Navigation size={16} /> Get Directions
                </a>
                <a
                  href={storeSettings.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold text-sm border transition-all ${
                    darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ExternalLink size={16} /> Open Maps
                </a>
              </div>
            </div>
          </div>

          {/* Info Card — takes 2/5 */}
          <div className="lg:col-span-2 space-y-4">

            {/* Contact Info */}
            <div className={`rounded-3xl border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
              <h2 className={`font-black text-lg mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="text-2xl">📍</span> Shop Info
              </h2>

              <div className="space-y-4">
                {/* Address */}
                <div className={`flex gap-3 p-3 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Address</p>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{storeSettings.address}</p>
                  </div>
                </div>

                {/* Phone */}
                <a
                  href={`tel:${storeSettings.phone.replace(/\s/g, '')}`}
                  className={`flex gap-3 p-3 rounded-2xl transition-all hover:scale-[1.02] ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-50 hover:bg-blue-100'}`}
                >
                  <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-white" />
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Call Us</p>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{storeSettings.phone}</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${storeSettings.email}`}
                  className={`flex gap-3 p-3 rounded-2xl transition-all hover:scale-[1.02] ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-50 hover:bg-purple-100'}`}
                >
                  <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-white" />
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{storeSettings.email}</p>
                  </div>
                </a>

                {/* Hours */}
                <div className={`flex gap-3 p-3 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-amber-50'}`}>
                  <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-white" />
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Business Hours</p>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{storeSettings.businessHours}</p>
                    <p className="text-xs text-green-600 font-medium mt-0.5">● Open Now</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${storeSettings.whatsapp}?text=Hi! I want to place an order from Krishna Kirana`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <MessageCircle size={20} />
              💬 WhatsApp Order Now
            </a>

            {/* Delivery Info */}
            <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-bold text-sm mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>🛵 Delivery Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Free Delivery Above</span>
                  <span className="font-bold text-green-600">₹{storeSettings.freeDeliveryAbove}</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Delivery Fee</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{storeSettings.deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Est. Time</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>30–45 mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Track Order CTA */}
        <div className={`mt-6 rounded-3xl border p-6 flex flex-col sm:flex-row items-center justify-between gap-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div>
            <h3 className={`font-black text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>📦 Track Your Order</h3>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enter your Order ID and mobile number to see live delivery status</p>
          </div>
          <button
            onClick={() => setCurrentPage('track-order')}
            className="shrink-0 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg"
          >
            Track My Order →
          </button>
        </div>
      </div>
    </div>
  );
}
