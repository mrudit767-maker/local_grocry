import { Toaster } from 'react-hot-toast';
import { useStore } from './store/useStore';
import Header from './components/Header';
import CartSidebar from './components/CartSidebar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import LocationPage from './pages/LocationPage';
import TrackOrderPage from './pages/TrackOrderPage';
import CustomerLoginPage from './pages/CustomerLoginPage';

export default function App() {
  const { currentPage, darkMode, storeSettings, setCurrentPage } = useStore();

  return (
    <div className={`${darkMode ? 'dark bg-gray-950' : 'bg-gray-50'} min-h-screen`}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#16a34a', secondary: '#fff' },
            style: { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
            style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
          },
        }}
      />

      {/* Header — shown on all pages except admin */}
      {currentPage !== 'admin' && <Header />}

      {/* Page Content */}
      <main>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'products' && <ProductsPage />}
        {currentPage === 'checkout' && <CheckoutPage />}
        {currentPage === 'orders' && <OrdersPage />}
        {currentPage === 'admin' && <AdminPage />}
        {currentPage === 'order-success' && <OrderSuccessPage />}
        {currentPage === 'location' && <LocationPage />}
        {currentPage === 'track-order' && <TrackOrderPage />}
        {currentPage === 'customer-login' && <CustomerLoginPage />}
      </main>

      {/* Cart Sidebar */}
      {currentPage !== 'admin' && <CartSidebar />}

      {/* Footer */}
      {currentPage !== 'admin' && currentPage !== 'checkout' && currentPage !== 'order-success' && (
        <footer className={`mt-16 border-t ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <img src="/logo.png" alt="Krishna Kirana Logo" className="h-14 w-14 object-contain" />
                  <div>
                    <div className={`font-black text-lg leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Krishna <span className="text-green-600">Kirana</span>
                    </div>
                    <div className="text-green-600 text-xs">{storeSettings.tagline}</div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Your trusted local kirana store, now online! Fresh groceries, best prices, delivered to your door.
                </p>
                <div className="flex gap-3 mt-4">
                  <a href={`https://wa.me/${storeSettings.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs hover:bg-green-600 font-bold">W</a>
                  <a href="#" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs hover:bg-blue-700 font-bold">f</a>
                  <a href="#" className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white text-xs hover:bg-pink-700 font-bold">in</a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Links</h3>
                <ul className="space-y-2">
                  {[
                    { label: '🏠 Home', page: 'home' },
                    { label: '🛍️ All Products', page: 'products' },
                    { label: '📦 My Orders', page: 'orders' },
                    { label: '📍 Our Location', page: 'location' },
                    { label: '🚚 Track Order', page: 'track-order' },
                  ].map(link => (
                    <li key={link.label}>
                      <button
                        onClick={() => setCurrentPage(link.page as any)}
                        className="text-gray-500 hover:text-green-600 cursor-pointer text-sm transition-colors"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Categories</h3>
                <ul className="space-y-2">
                  {['🌾 Rice & Atta', '🫙 Oils & Ghee', '🫘 Dal & Pulses', '🌶️ Spices & Masala', '🍪 Snacks & Biscuits'].map(c => (
                    <li key={c}>
                      <span className="text-gray-500 hover:text-green-600 cursor-pointer text-sm transition-colors">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contact Us</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>📍 {storeSettings.address}</li>
                  <li>
                    <a href={`tel:${storeSettings.phone.replace(/\s/g,'')}`} className="hover:text-green-600 transition-colors">
                      📞 {storeSettings.phone}
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${storeSettings.email}`} className="hover:text-green-600 transition-colors">
                      ✉️ {storeSettings.email}
                    </a>
                  </li>
                  <li>🕐 {storeSettings.businessHours}</li>
                </ul>
                <a
                  href={`https://wa.me/${storeSettings.whatsapp}?text=Hi! I want to place an order`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
                >
                  💬 WhatsApp Order
                </a>
              </div>
            </div>

            <div className={`border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <p className="text-gray-500 text-sm">© 2025 {storeSettings.shopName}. All rights reserved.</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Refund Policy</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-bold">UPI</span>
                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-bold">COD</span>
                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-bold">GPay</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
