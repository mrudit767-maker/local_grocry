import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useStore } from './store/useStore';
import { MessageCircle } from 'lucide-react';
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
import WishlistPage from './pages/WishlistPage';
import SubscriptionPage from './pages/SubscriptionPage';
import PWAInstallBanner from './components/PWAInstallBanner';
import PolicyModal from './components/PolicyModal';
import ProductDetailsModal from './components/ProductDetailsModal';

export default function App() {
  const {
    currentPage, darkMode, storeSettings, setCurrentPage, fetchProducts, fetchSettings,
    categories, addCategory, products, bulkAddProducts, selectedProductId, setSelectedProductId,
    setSelectedCategory, updateStoreSettings
  } = useStore();

  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'refund' | null>(null);

  useEffect(() => {
    // 1. Sync category if missing in state (which can happen due to localStorage hydration)
    const hasStationeryCat = categories.some(c => c.id === 'stationery' || c.id === 'stationary');
    if (!hasStationeryCat) {
      addCategory({
        name: 'Stationery',
        emoji: '✏️',
        color: 'from-blue-600 to-indigo-600'
      });
    }

    // 2. Sync default products if stationery category has 0 items
    const hasStationeryProd = products.some(p => p.category === 'stationery' || p.category === 'stationary');
    if (!hasStationeryProd) {
      const initialStationery = [
        {
          name: 'Classmate Notebook (Single Line, 172 Pages)',
          category: 'stationery',
          subcategory: 'Notebooks',
          price: 60,
          mrp: 65,
          unit: '1 pc',
          badge: 'Popular',
          rating: 4.8,
          reviews: 120,
          inStock: true,
          description: 'Classmate Notebook - High-quality single-line pages for neat handwriting. Perfect for school, college, and office work.',
          image: 'https://placehold.co/200x200/2563eb/ffffff?text=CN'
        },
        {
          name: 'Reynolds Gel Pen (Blue, Pack of 5)',
          category: 'stationery',
          subcategory: 'Pens & Markers',
          price: 50,
          mrp: 50,
          unit: '1 Pack',
          badge: 'Best Seller',
          rating: 4.5,
          reviews: 245,
          inStock: true,
          description: 'Reynolds Gel Pen - Smooth writing gel ink in a blue shade. Pack of 5 pens for comfortable long-writing sessions.',
          image: 'https://placehold.co/200x200/2563eb/ffffff?text=GP'
        },
        {
          name: 'Nataraj 621 Pencils (Pack of 10)',
          category: 'stationery',
          subcategory: 'Pencils',
          price: 45,
          mrp: 50,
          unit: '1 Pack',
          badge: 'Popular',
          rating: 4.6,
          reviews: 198,
          inStock: true,
          description: 'Nataraj 621 Pencils - The iconic black and red pencils. Superior lead quality, easy sharpening, and long-lasting wood.',
          image: 'https://placehold.co/200x200/2563eb/ffffff?text=NP'
        },
        {
          name: 'Apsara Platinum Kit',
          category: 'stationery',
          subcategory: 'Stationery Kits',
          price: 99,
          mrp: 110,
          unit: '1 Kit',
          badge: 'Value Pack',
          rating: 4.7,
          reviews: 312,
          inStock: true,
          description: 'Apsara Platinum Kit contains pencils, erasers, sharpener, and a ruler. All-in-one exam prep or daily study desk kit.',
          image: 'https://placehold.co/200x200/2563eb/ffffff?text=PK'
        },
        {
          name: 'Fevicol MR Squeezy Glue (85 g)',
          category: 'stationery',
          subcategory: 'Adhesives',
          price: 40,
          mrp: 45,
          unit: '1 pc',
          rating: 4.4,
          reviews: 87,
          inStock: true,
          description: 'Fevicol MR Squeezy Glue - Easy squeezy bottle for paper crafts, school projects, and quick home repairs. Dries clear.',
          image: 'https://placehold.co/200x200/2563eb/ffffff?text=FG'
        },
        {
          name: 'Doms Color Pencils (Pack of 12)',
          category: 'stationery',
          subcategory: 'Art Supplies',
          price: 60,
          mrp: 70,
          unit: '1 Pack',
          badge: 'Kids Choice',
          rating: 4.5,
          reviews: 145,
          inStock: true,
          description: 'Doms Color Pencils - Smooth and vibrant coloring pencils for kids and artists. Safe, non-toxic wood, break-resistant lead.',
          image: 'https://placehold.co/200x200/2563eb/ffffff?text=CP'
        },
        {
          name: 'Camlin Kokuyo Exam Pad',
          category: 'stationery',
          subcategory: 'Writing Pads',
          price: 80,
          mrp: 90,
          unit: '1 pc',
          rating: 4.3,
          reviews: 65,
          inStock: true,
          description: 'Camlin Kokuyo Exam Pad - Hard, durable surface with a secure metal clip. Essential for students taking written examinations.',
          image: 'https://placehold.co/200x200/2563eb/ffffff?text=EP'
        },
        {
          name: 'Parker Vector Roller Ball Pen (Blue)',
          category: 'stationery',
          subcategory: 'Premium Pens',
          price: 299,
          mrp: 349,
          unit: '1 pc',
          badge: 'Premium',
          rating: 4.9,
          reviews: 520,
          inStock: true,
          description: 'Parker Vector Roller Ball Pen - Sleek design, smooth ink flow, and premium styling. Comes in an attractive gift box.',
          image: 'https://placehold.co/200x200/2563eb/ffffff?text=PP'
        }
      ];
      bulkAddProducts(initialStationery);
    }
  }, [categories, products, addCategory, bulkAddProducts]);

  useEffect(() => {
    // Migrate old webhook URLs if they match the old demo URL or are empty
    const oldDemoUrl = 'https://script.google.com/macros/s/AKfycbzqdrrYG56NKd6pNyGhTlanuTLP3_HO9sD8vL1Fmn98IJLz0KyXzrSIQxFWH4M8by8R/exec';
    const currentUrl = storeSettings.googleSheetWebhookUrl;
    const defaultCustomUrl = 'https://script.google.com/macros/s/AKfycbzKMXP4_DT32ePA9rc2YOd9-n2AKOvYi0ID0rcl1aLKAETYjL8eJc33_EacweDFmOELCQ/exec';
    
    if (!currentUrl || currentUrl === oldDemoUrl) {
      updateStoreSettings({
        googleSheetWebhookUrl: defaultCustomUrl,
        googleSheetProductsWebhookUrl: defaultCustomUrl
      });
      console.log('Migrated old demo webhook URL to the correct custom webhook URL.');
    }

    fetchProducts();
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <main className="pb-24 md:pb-0">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'products' && <ProductsPage />}
        {currentPage === 'checkout' && <CheckoutPage />}
        {currentPage === 'orders' && <OrdersPage />}
        {currentPage === 'admin' && <AdminPage />}
        {currentPage === 'order-success' && <OrderSuccessPage />}
        {currentPage === 'location' && <LocationPage />}
        {currentPage === 'track-order' && <TrackOrderPage />}
        {currentPage === 'customer-login' && <CustomerLoginPage />}
        {currentPage === 'wishlist' && <WishlistPage />}
        {currentPage === 'subscriptions' && <SubscriptionPage />}
      </main>

      {/* Cart Sidebar */}
      {currentPage !== 'admin' && <CartSidebar />}

      {/* PWA Install Banner */}
      <PWAInstallBanner />

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
                    className="w-8.5 h-8.5 rounded-full bg-[#2ECC71] flex items-center justify-center text-white hover:bg-[#1db85b] transition-all hover:scale-110 shadow-sm"
                    title="WhatsApp"
                  >
                    <MessageCircle size={15} fill="white" />
                  </a>
                  <a href="https://www.facebook.com/me/" target="_blank" rel="noopener noreferrer" className="w-8.5 h-8.5 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-all hover:scale-110 shadow-sm" title="Facebook">
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/krishna_kirana_premium_grocery?igsh=aDl4bndhaDBzNmp4" target="_blank" rel="noopener noreferrer" className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-650 flex items-center justify-center text-white hover:opacity-95 transition-all hover:scale-110 shadow-sm" title="Instagram">
                    <svg className="w-4 h-4 fill-none stroke-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </a>
                </div>
                
                {/* Download App Badges */}
                <div className="mt-5 space-y-2">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Download App</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toast.success("Google Play Store app coming soon!")}
                      className="hover:scale-105 transition-transform bg-transparent border-none p-0 cursor-pointer outline-none"
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-8 object-contain" />
                    </button>
                    <button 
                      onClick={() => toast.success("Apple App Store app coming soon!")}
                      className="hover:scale-105 transition-transform bg-transparent border-none p-0 cursor-pointer outline-none"
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on App Store" className="h-8 object-contain" />
                    </button>
                  </div>
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
                  {[
                    { label: '🌾 Rice & Atta', id: 'rice-atta' },
                    { label: '🫙 Oils & Ghee', id: 'oils-ghee' },
                    { label: '🫘 Dal & Pulses', id: 'dal-pulses' },
                    { label: '🌶️ Spices & Masala', id: 'spices-masala' },
                    { label: '🍪 Snacks & Biscuits', id: 'biscuits-snacks' }
                  ].map(c => (
                    <li key={c.label}>
                      <button
                        onClick={() => {
                          setSelectedCategory(c.id);
                          setCurrentPage('products');
                        }}
                        className="text-gray-500 hover:text-green-600 cursor-pointer text-sm transition-colors bg-transparent border-none p-0 text-left outline-none"
                      >
                        {c.label}
                      </button>
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
                <button
                  onClick={() => setActivePolicy('privacy')}
                  className="hover:text-green-600 transition-colors focus:outline-none cursor-pointer bg-transparent border-none p-0 text-xs text-gray-400 font-semibold"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setActivePolicy('terms')}
                  className="hover:text-green-600 transition-colors focus:outline-none cursor-pointer bg-transparent border-none p-0 text-xs text-gray-400 font-semibold"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => setActivePolicy('refund')}
                  className="hover:text-green-600 transition-colors focus:outline-none cursor-pointer bg-transparent border-none p-0 text-xs text-gray-400 font-semibold"
                >
                  Refund Policy
                </button>
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

      {activePolicy && (
        <PolicyModal
          type={activePolicy}
          onClose={() => setActivePolicy(null)}
          shopName={storeSettings.shopName}
          email={storeSettings.email}
          phone={storeSettings.phone}
        />
      )}

      {selectedProductId && (
        <ProductDetailsModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
}
