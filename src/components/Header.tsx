import { useState } from 'react';
import { ShoppingCart, Search, Moon, Sun, Menu, X, MapPin, Phone, Shield, MessageCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export default function Header() {
  const {
    darkMode, toggleDarkMode, searchQuery, setSearchQuery,
    getCartItemCount, toggleCart, setCurrentPage, currentPage, storeSettings,
    currentCustomer, customerLogout
  } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const cartCount = getCartItemCount();

  return (
    <header className={`sticky top-0 z-50 shadow-lg ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
      {/* Top bar */}
      <div className={`${darkMode ? 'bg-green-900' : 'bg-green-700'} text-white text-xs py-1.5 px-4`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('location')}
              className="flex items-center gap-1 hover:text-green-200 transition-colors"
            >
              <MapPin size={11} /> {storeSettings.address}
            </button>
            <a href={`tel:${storeSettings.phone.replace(/\s/g,'')}`} className="hidden sm:flex items-center gap-1 hover:text-green-200 transition-colors">
              <Phone size={11} /> {storeSettings.phone}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span>🕐 {storeSettings.businessHours}</span>
            <span className="hidden sm:inline">· Free delivery above ₹{storeSettings.freeDeliveryAbove}</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Logo */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 shrink-0"
          >
            <img
              src="/logo.png"
              alt="Krishna Kirana Logo"
              className="h-12 w-12 object-contain"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
            <div className="hidden sm:block">
              <div className={`font-black text-lg leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {storeSettings.shopName.split(' ')[0]} <span className="text-green-600">{storeSettings.shopName.split(' ').slice(1).join(' ')}</span>
              </div>
              <div className="text-green-600 text-xs font-medium">{storeSettings.tagline}</div>
            </div>
          </button>

          {/* Search */}
          <div className={`flex-1 relative ${searchFocused ? 'ring-2 ring-green-500' : ''} rounded-xl overflow-hidden`}>
            <div className={`flex items-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl px-3 py-2`}>
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); if (e.target.value && currentPage !== 'products') setCurrentPage('products'); }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search groceries, brands, products..."
                className={`flex-1 ml-2 bg-transparent outline-none text-sm ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'}`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${storeSettings.whatsapp}?text=Hi! I want to place an order`}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden lg:flex p-2 rounded-xl transition-all items-center gap-1 text-sm font-medium ${darkMode ? 'bg-green-900 text-green-400 hover:bg-green-800' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
              title="WhatsApp Order"
            >
              <MessageCircle size={16} />
              <span className="hidden xl:block">WhatsApp</span>
            </a>

            {/* Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-all ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Admin */}
            <button
              onClick={() => setCurrentPage('admin')}
              className={`hidden md:flex p-2 rounded-xl transition-all items-center gap-1 text-sm font-medium ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Shield size={16} />
              <span className="hidden lg:block">Admin</span>
            </button>

            {/* Customer Profile / Login */}
            {currentCustomer ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setCurrentPage('orders')}
                  className={`flex p-2 rounded-xl transition-all items-center gap-1 text-sm font-bold text-green-600 ${darkMode ? 'bg-green-950/40 hover:bg-green-900/30' : 'bg-green-50 hover:bg-green-100'}`}
                  title="My Profile"
                >
                  <span>👤 {currentCustomer.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={() => { customerLogout(); toast.success('Logged out successfully'); setCurrentPage('home'); }}
                  className={`flex p-2 rounded-xl transition-all items-center gap-1 text-xs font-semibold ${darkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('customer-login')}
                className={`flex p-2 rounded-xl transition-all items-center gap-1 text-sm font-medium ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} shrink-0`}
              >
                <span>👤 Login</span>
              </button>
            )}

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:block text-sm font-semibold">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col gap-1`}>
            {currentCustomer ? (
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                <span className={`text-sm font-bold text-green-600`}>👤 {currentCustomer.name}</span>
                <button
                  onClick={() => { customerLogout(); toast.success('Logged out successfully'); setCurrentPage('home'); setMobileMenuOpen(false); }}
                  className="text-xs text-red-500 font-bold px-2 py-1 rounded bg-red-50 dark:bg-red-950/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setCurrentPage('customer-login'); setMobileMenuOpen(false); }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'} border-b border-gray-100 dark:border-gray-800`}
              >
                👤 Customer Login / Register
              </button>
            )}
            {[
              { id: 'home', label: '🏠 Home' },
              { id: 'products', label: '🛍️ All Products' },
              { id: 'orders', label: '📦 My Orders' },
              { id: 'location', label: '📍 Our Location' },
              { id: 'track-order', label: '🚚 Track Order' },
              { id: 'admin', label: '🛡️ Admin Panel' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id as any); setMobileMenuOpen(false); }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {item.label}
              </button>
            ))}
            <a
              href={`https://wa.me/${storeSettings.whatsapp}?text=Hi! I want to place an order`}
              target="_blank" rel="noopener noreferrer"
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50"
            >
              💬 WhatsApp Order
            </a>
          </div>
        )}
      </div>

      {/* Nav tabs */}
      <div className={`border-t ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'} hidden md:block`}>
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1 py-2">
            {[
              { id: 'home', label: '🏠 Home' },
              { id: 'products', label: '🛍️ All Products' },
              { id: 'orders', label: '📦 My Orders' },
              { id: 'location', label: '📍 Our Location' },
              { id: 'track-order', label: '🚚 Track Order' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as any)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-green-600 text-white'
                    : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-3">
              <a
                href={`https://wa.me/${storeSettings.whatsapp}?text=Hi! I want to place an order`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-all"
              >
                <MessageCircle size={13} /> WhatsApp Order
              </a>
              <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Delivery in 30–45 mins
              </span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
