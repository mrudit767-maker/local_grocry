import { useState, useEffect, useRef, useMemo } from 'react';
import { ShoppingCart, Search, Moon, Sun, X, MapPin, Phone, Shield, MessageCircle, Heart, Sparkles, Home, LayoutGrid, RefreshCw, ShoppingBag, User, Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import AIQueryAssistant from './AIQueryAssistant';

const DELIVERY_AREAS = ['Bhopal (All)', 'Bhanpur', 'Kalyan Nagar', 'Vidisha Road', 'Karond'];

export default function Header() {
  const {
    darkMode, toggleDarkMode, searchQuery, setSearchQuery,
    getCartItemCount, toggleCart, setCurrentPage, currentPage, storeSettings,
    currentCustomer, customerLogout, products, addToCart,
    adminLoggedIn, stockRequests, customerNotifications,
    dismissNotification, markAllNotificationsRead, clearAllNotifications,
    setSelectedProductId
  } = useStore();
  
  const [searchFocused, setSearchFocused] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState('Bhanpur');
  const [aiOpen, setAiOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const cartCount = getCartItemCount();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [frequentSearches, setFrequentSearches] = useState<string[]>([]);

  // Notification counts
  const pendingStockRequests = (stockRequests || []).filter(r => r.status === 'pending').length;
  const unreadCustomerNotifs = (customerNotifications || []).filter(n => !n.read).length;
  const totalUnread = adminLoggedIn ? pendingStockRequests : unreadCustomerNotifs;

  useEffect(() => {
    const saved = localStorage.getItem('frequent-searches');
    if (saved) {
      setFrequentSearches(JSON.parse(saved));
    }
  }, []);

  const trackSearch = (term: string) => {
    if (!term.trim() || term.length < 3) return;
    const cleanTerm = term.trim().toLowerCase();
    
    let list: { term: string; count: number }[] = [];
    const saved = localStorage.getItem('frequent-searches-raw');
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        list = [];
      }
    }
    
    const existing = list.find(item => item.term === cleanTerm);
    if (existing) {
      existing.count += 1;
    } else {
      list.push({ term: cleanTerm, count: 1 });
    }
    
    list.sort((a, b) => b.count - a.count);
    localStorage.setItem('frequent-searches-raw', JSON.stringify(list));
    
    const topTerms = list.slice(0, 5).map(item => {
      return item.term.replace(/\b\w/g, c => c.toUpperCase());
    });
    localStorage.setItem('frequent-searches', JSON.stringify(topTerms));
    setFrequentSearches(topTerms);
  };

  const matchingProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return [...products]
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.subcategory || '').toLowerCase().includes(q)
      )
      .sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0))
      .slice(0, 5);
  }, [products, searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen]);

  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
    setLocationOpen(false);
    toast.success(`Delivery location set to: ${area} 🛵`);
  };

  // Notification panel renderer
  const renderNotifPanel = () => (
    <div
      className={`absolute right-0 top-full mt-2 w-80 rounded-2xl border shadow-2xl z-[80] overflow-hidden ${
        darkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-gray-150 text-gray-800'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${ darkMode ? 'border-gray-800' : 'border-gray-100' }`}>
        <div className="flex items-center gap-2">
          <Bell size={15} className="text-orange-500" />
          <span className="text-sm font-black">Notifications</span>
          {totalUnread > 0 && (
            <span className="bg-orange-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.5">{totalUnread} new</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {adminLoggedIn ? (
            <button
              onClick={() => { setCurrentPage('admin'); setNotifOpen(false); }}
              className="text-[10px] text-emerald-600 font-bold hover:underline cursor-pointer"
            >
              View All →
            </button>
          ) : (
            (customerNotifications || []).length > 0 && (
              <button
                onClick={() => { clearAllNotifications(); }}
                className="text-[10px] text-red-400 font-bold hover:underline cursor-pointer"
              >
                Clear All
              </button>
            )
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {adminLoggedIn ? (
          // Admin: show pending stock requests
          (stockRequests || []).filter(r => r.status === 'pending').length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <span className="text-3xl mb-2">🔔</span>
              <p className="text-sm font-bold text-gray-400">No pending stock requests</p>
              <p className="text-xs text-gray-400 mt-1">Customers' restock requests will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {(stockRequests || []).filter(r => r.status === 'pending').slice(0, 8).map(req => (
                <div key={req.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors`}>
                  {req.productImage ? (
                    <img src={req.productImage} alt={req.productName} className="w-10 h-10 rounded-lg object-contain bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center shrink-0">
                      <Bell size={16} className="text-orange-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{req.productName}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">👤 {req.customerName} • {req.customerContact}</p>
                    <p className="text-[10px] text-orange-500 font-bold mt-0.5">⏳ Awaiting restock</p>
                  </div>
                </div>
              ))}
              {(stockRequests || []).filter(r => r.status === 'pending').length > 8 && (
                <div className="px-4 py-2 text-center">
                  <button
                    onClick={() => { setCurrentPage('admin'); setNotifOpen(false); }}
                    className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
                  >
                    +{(stockRequests || []).filter(r => r.status === 'pending').length - 8} more → View in Admin Panel
                  </button>
                </div>
              )}
            </div>
          )
        ) : (
          // Customer: show restock notifications
          (customerNotifications || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <span className="text-3xl mb-2">🔔</span>
              <p className="text-sm font-bold text-gray-400">No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">We'll notify you when requested items are restocked</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {(customerNotifications || []).map(notif => (
                <div key={notif.id} className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                  notif.read ? '' : (darkMode ? 'bg-orange-950/20' : 'bg-orange-50/60')
                }`}>
                  {notif.productImage ? (
                    <img src={notif.productImage} alt="Product" className="w-10 h-10 rounded-lg object-contain bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950/30 flex items-center justify-center shrink-0">
                      <span className="text-lg">🎉</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-emerald-600">{notif.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {notif.productId && (
                        <button
                          onClick={() => { setSelectedProductId(notif.productId!); setNotifOpen(false); }}
                          className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                          View Product
                        </button>
                      )}
                      <button
                        onClick={() => dismissNotification(notif.id)}
                        className="text-[10px] text-gray-400 hover:text-red-400 transition-colors cursor-pointer font-bold"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );


  const renderAutocomplete = () => {
    if (!searchFocused) return null;
    return (
      <div className={`absolute left-0 right-0 top-full mt-2.5 p-4 rounded-3xl border shadow-2xl backdrop-blur-xl ${
        darkMode ? 'bg-gray-950/95 border-gray-800 text-white' : 'bg-white/95 border-gray-150 text-gray-800'
      } transition-all duration-300 z-50 max-h-[380px] overflow-y-auto`}>
        
        {!searchQuery.trim() && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs">🔥</span>
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-450 dark:text-gray-500">Popular Searches</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Atta', 'Desi Ghee', 'Maggi', 'Paneer', 'Tata Tea', 'Basmati Rice'].map(term => (
                  <button
                    key={term}
                    type="button"
                    onMouseDown={() => {
                      setSearchQuery(term);
                      trackSearch(term);
                      setCurrentPage('products');
                    }}
                    className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 font-semibold cursor-pointer ${
                      darkMode 
                        ? 'border-gray-800 hover:border-emerald-500/50 bg-gray-900/50 hover:bg-emerald-950/20 text-gray-300 hover:text-emerald-400' 
                        : 'border-gray-250 hover:border-emerald-500/50 bg-gray-150/50 hover:bg-emerald-50 text-gray-655 hover:text-emerald-600'
                    }`}
                  >
                    🔍 {term}
                  </button>
                ))}
              </div>
            </div>

            {frequentSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs">📈</span>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-450 dark:text-gray-500">Your Recent Searches</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {frequentSearches.map(term => (
                    <button
                      key={term}
                      type="button"
                      onMouseDown={() => {
                        setSearchQuery(term);
                        trackSearch(term);
                        setCurrentPage('products');
                      }}
                      className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 font-semibold cursor-pointer ${
                        darkMode 
                          ? 'border-gray-800 hover:border-emerald-500/50 bg-gray-900/50 hover:bg-emerald-950/20 text-emerald-400' 
                          : 'border-gray-250 hover:border-emerald-500/50 bg-gray-150/50 hover:bg-emerald-55 text-emerald-600'
                      }`}
                    >
                      ⏱️ {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {searchQuery.trim() && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2 mb-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-450 dark:text-gray-500">Instant Results</p>
              <button
                type="button"
                onMouseDown={() => {
                  trackSearch(searchQuery);
                  setCurrentPage('products');
                }}
                className="text-xs text-emerald-500 font-bold hover:underline cursor-pointer"
              >
                View all results →
              </button>
            </div>

            {matchingProducts.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-xs">
                😞 No products matching "{searchQuery}" in our catalog.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {matchingProducts.map(p => (
                  <div 
                    key={p.id} 
                    className="flex items-center gap-3 py-2 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 rounded-xl px-2 transition-colors duration-200"
                  >
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200/50 dark:border-gray-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">{p.unit}</span>
                        <span className="text-[10px] opacity-25">|</span>
                        {p.inStock ? (
                          <span className="text-[9px] text-green-600 font-extrabold uppercase bg-green-50 dark:bg-green-950/20 px-1 py-0.2 rounded">In Stock</span>
                        ) : (
                          <span className="text-[9px] text-red-500 font-extrabold uppercase bg-red-50 dark:bg-red-950/20 px-1 py-0.2 rounded">Out of Stock</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-black text-emerald-600">₹{p.price}</p>
                        {p.mrp > p.price && (
                          <p className="text-[10px] text-gray-450 dark:text-gray-500 line-through">₹{p.mrp}</p>
                        )}
                      </div>
                      {p.inStock && (
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            addToCart(p);
                            toast.success(`🛒 Added ${p.name}`);
                          }}
                          className="p-1.8 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm cursor-pointer"
                          title="Add to Cart"
                        >
                          <ShoppingCart size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl ${darkMode ? 'bg-gray-950/90 border-gray-800' : 'bg-white/95 border-gray-150'} border-b transition-all duration-300 shadow-sm`}>
      {/* Top bar (Desktop only) */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-white text-[11px] py-2 px-4 font-semibold tracking-wider select-none border-b border-white/5 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setLocationOpen(!locationOpen)}
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition-all cursor-pointer"
              >
                <MapPin size={11} className="text-emerald-500 animate-pulse" /> 
                <span>Deliver to: <b>{selectedArea}</b> (Bhopal) ▼</span>
              </button>
              
              {locationOpen && (
                <div className={`absolute left-0 mt-2 p-2.5 w-48 rounded-2xl border shadow-xl z-55 ${
                  darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-800'
                }`}>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1.5 px-2">Choose Locality</p>
                  {DELIVERY_AREAS.map(area => (
                    <button
                      key={area}
                      onClick={() => handleSelectArea(area)}
                      className={`w-full text-left px-2 py-1.5 text-xs rounded-lg font-semibold transition-colors cursor-pointer ${
                        selectedArea === area 
                          ? 'bg-green-600 text-white' 
                          : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      📍 {area}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <a href={`tel:${storeSettings.phone.replace(/\s/g,'')}`} className="hidden sm:flex items-center gap-1 hover:text-emerald-400 transition-colors">
              <Phone size={11} className="text-emerald-500" /> {storeSettings.phone}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span>🕐 {storeSettings.businessHours}</span>
            <span className="hidden sm:inline opacity-30">|</span>
            <span className="hidden sm:inline">Free delivery above ₹{storeSettings.freeDeliveryAbove}</span>
          </div>
        </div>
      </div>

      {/* Main header (Desktop Only) */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 hidden md:block">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2.5 shrink-0 group transition-all duration-300"
          >
            <img
              src="/logo.png"
              alt="Krishna Kirana Logo"
              className="h-11 w-11 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="hidden sm:block text-left">
              <div className={`font-black text-xl tracking-tight leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {storeSettings.shopName.split(' ')[0]} <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{storeSettings.shopName.split(' ').slice(1).join(' ')}</span>
              </div>
              <div className="text-emerald-500 text-[10px] font-black tracking-widest mt-1 uppercase">{storeSettings.tagline}</div>
            </div>
          </button>

          <div className="flex-1 max-w-xl relative">
            <div className={`flex items-center ${darkMode ? 'bg-gray-900 border-gray-800 focus-within:border-emerald-500/80 focus-within:ring-emerald-500/10' : 'bg-gray-100 border-gray-300 focus-within:border-emerald-500/80 focus-within:ring-emerald-500/15'} border rounded-full px-4 py-2.5 transition-all duration-300 focus-within:ring-4 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.1)] focus-within:scale-[1.01]`}>
              <Search size={18} className={`transition-colors duration-300 ${searchFocused ? 'text-emerald-500' : 'text-gray-400'} shrink-0`} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); if (e.target.value && currentPage !== 'products') setCurrentPage('products'); }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    trackSearch(searchQuery);
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search fresh groceries, ghee, atta..."
                className={`flex-1 ml-2.5 bg-transparent outline-none text-sm ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'} font-medium tracking-wide`}
              />
              <button
                onClick={() => setAiOpen(!aiOpen)}
                className="flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 hover:bg-green-100 px-2.5 py-1 rounded-full transition-all ml-1.5 shrink-0"
              >
                <Sparkles size={11} className="text-yellow-500" />
                <span>Ask AI</span>
              </button>
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); }} className="text-gray-400 hover:text-emerald-500 transition-colors p-0.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50 cursor-pointer ml-1.5">
                  <X size={14} />
                </button>
              )}
            </div>
            {renderAutocomplete()}
            {aiOpen && (
              <div className="absolute right-0 top-full mt-2.5 z-50 w-[92vw] max-w-lg sm:w-[480px]">
                <AIQueryAssistant onClose={() => setAiOpen(false)} />
              </div>
            )}
          </div>

          {/* Action Buttons (Right Side) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Wishlist */}
            <button
              onClick={() => setCurrentPage('wishlist')}
              className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer relative ${
                currentPage === 'wishlist'
                  ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                  : darkMode ? 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700' : 'bg-gray-50 border-gray-200 text-gray-650 hover:text-emerald-600 hover:border-gray-300'
              }`}
              title="Wishlist"
            >
              <Heart size={16} className={currentPage === 'wishlist' ? 'fill-white' : ''} />
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotifOpen(v => !v);
                  if (!notifOpen && !adminLoggedIn) markAllNotificationsRead();
                }}
                className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer relative ${
                  darkMode ? 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700' : 'bg-gray-50 border-gray-200 text-gray-650 hover:text-orange-500 hover:border-gray-300'
                }`}
                title="Notifications"
              >
                <Bell size={16} className={notifOpen ? 'text-orange-500' : ''} />
                {totalUnread > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center border border-white dark:border-gray-950 animate-pulse">
                    {totalUnread > 9 ? '9+' : totalUnread}
                  </span>
                )}
              </button>
              {notifOpen && renderNotifPanel()}
            </div>

            {/* Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                darkMode ? 'bg-gray-900 border-gray-800 text-yellow-400 hover:text-yellow-350 hover:border-gray-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-gray-300'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Admin Panel */}
            <button
              onClick={() => setCurrentPage('admin')}
              className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                currentPage === 'admin'
                  ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                  : darkMode ? 'bg-gray-900 border-gray-800 text-gray-405 hover:text-white hover:border-gray-700' : 'bg-gray-50 border-gray-200 text-gray-650 hover:text-emerald-600 hover:border-gray-300'
              }`}
              title="Admin Panel"
            >
              <Shield size={16} />
            </button>

            {/* Customer Login / Profile */}
            {currentCustomer ? (
              <div className="flex items-center gap-2 border border-emerald-500/20 dark:border-emerald-500/10 rounded-xl px-3 py-1.5 bg-emerald-50/50 dark:bg-emerald-950/20">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  👤 Valued
                </span>
                <button
                  onClick={() => { customerLogout(); toast.success('Logged out successfully'); setCurrentPage('home'); }}
                  className="text-[10px] text-red-500 hover:text-red-655 dark:text-red-405 font-extrabold hover:underline cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('customer-login')}
                className={`flex items-center gap-1 text-xs px-3.5 py-2.5 rounded-xl border font-black transition-all duration-300 cursor-pointer ${
                  currentPage === 'customer-login'
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                    : darkMode ? 'bg-gray-900 border-gray-800 text-gray-300 hover:text-white hover:border-gray-700' : 'bg-gray-50 border-gray-200 text-gray-650 hover:text-emerald-600 hover:border-gray-300'
                }`}
              >
                👤 Login
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2.5 rounded-xl font-black transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer"
            >
              <ShoppingCart size={16} />
              <span className="text-xs">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center border border-white dark:border-gray-955 animate-pulse">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main header (Mobile Dedicated Layout) */}
      <div className="md:hidden px-4 py-3.5 flex flex-col gap-2.5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-1.5 shrink-0"
          >
            <img src="/logo.png" alt="Krishna Kirana Logo" className="h-8.5 w-8.5 object-contain" />
            <span className={`font-black text-sm tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Krishna <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Kirana</span>
            </span>
          </button>
          <div className="relative max-w-[150px] truncate">
            <button
              onClick={() => setLocationOpen(!locationOpen)}
              className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 cursor-pointer"
            >
              <MapPin size={12} className="text-emerald-500 shrink-0 animate-pulse" />
              <span className="truncate">{selectedArea}</span>
              <span className="text-[9px]">▼</span>
            </button>
            {locationOpen && (
              <div className={`absolute right-0 mt-2 p-2 w-40 rounded-2xl border shadow-xl z-55 ${
                darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-800'
              }`}>
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-wider mb-1 px-2">Choose Locality</p>
                {DELIVERY_AREAS.map(area => (
                  <button
                    key={area}
                    onClick={() => handleSelectArea(area)}
                    className={`w-full text-left px-2 py-1.5 text-xs rounded-lg font-semibold transition-colors cursor-pointer ${
                      selectedArea === area ? 'bg-green-600 text-white' : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    📍 {area}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                darkMode ? 'bg-gray-900 border-gray-800 text-yellow-400' : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
            >
              {darkMode ? <Sun size={13} /> : <Moon size={13} />}
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('admin')}
              className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                currentPage === 'admin'
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : darkMode ? 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white' : 'bg-gray-50 border-gray-200 text-gray-650 hover:text-emerald-600'
              }`}
              title="Admin Panel"
            >
              <Shield size={13} />
            </button>
            {/* Mobile Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen(v => !v);
                  if (!notifOpen && !adminLoggedIn) markAllNotificationsRead();
                }}
                className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer relative ${
                  darkMode ? 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white' : 'bg-gray-50 border-gray-200 text-gray-650 hover:text-orange-500'
                }`}
                title="Notifications"
              >
                <Bell size={13} className={notifOpen ? 'text-orange-500' : ''} />
                {totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white dark:border-gray-950 animate-pulse">
                    {totalUnread > 9 ? '9+' : totalUnread}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0">
                  {renderNotifPanel()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar & Sparkles AI */}
        <div className="relative w-full">
          <div className={`flex items-center ${darkMode ? 'bg-gray-900 border-gray-800 focus-within:border-emerald-500/80 focus-within:ring-emerald-500/10' : 'bg-gray-100 border-gray-300 focus-within:border-emerald-500/80 focus-within:ring-emerald-500/15'} border rounded-full px-3.5 py-2 transition-all duration-300 focus-within:ring-3 focus-within:shadow-[0_0_15px_rgba(16,185,129,0.08)]`}>
            <Search size={16} className={`transition-colors duration-300 ${searchFocused ? 'text-emerald-500' : 'text-gray-400'} shrink-0`} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); if (e.target.value && currentPage !== 'products') setCurrentPage('products'); }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  trackSearch(searchQuery);
                  (e.target as HTMLInputElement).blur();
                }
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search fresh groceries, ghee, atta..."
              className={`flex-1 ml-2 bg-transparent outline-none text-xs ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'} font-semibold`}
            />
            <button
              onClick={() => setAiOpen(!aiOpen)}
              className="flex items-center gap-0.5 text-[9px] font-extrabold bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 hover:bg-green-100 px-2.5 py-0.5 rounded-full transition-all ml-1 shrink-0"
            >
              <Sparkles size={10} className="text-yellow-500" />
              <span>Ask AI</span>
            </button>
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); }} className="text-gray-400 hover:text-emerald-500 transition-colors p-0.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50 cursor-pointer ml-1">
                <X size={12} />
              </button>
            )}
          </div>
          {renderAutocomplete()}
          {aiOpen && (
            <div className="absolute right-0 left-0 top-full mt-2 z-50 w-full">
              <AIQueryAssistant onClose={() => setAiOpen(false)} />
            </div>
          )}
        </div>
      </div>

      {/* Nav tabs (Desktop) */}
      <div className={`border-t ${darkMode ? 'border-gray-800 bg-gray-900/60' : 'border-gray-100 bg-white/60'} backdrop-blur-md hidden md:block`}>
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1.5 py-2.5">
            {[
              { id: 'home', label: '🏠 Home' },
              { id: 'products', label: '🛍️ All Products' },
              { id: 'wishlist', label: '❤️ Wishlist' },
              { id: 'subscriptions', label: '🗓️ Subscription Pack' },
              { id: 'orders', label: '📦 My Orders' },
              { id: 'location', label: '📍 Our Location' },
              { id: 'track-order', label: '🚚 Track Order' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as any)}
                className={`px-4.5 py-1.8 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                    : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800/80'
                    : 'text-gray-650 hover:text-emerald-600 hover:bg-emerald-50/50'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-3">
              <a
                href={`https://wa.me/${storeSettings.whatsapp}?text=Hi! I want to place an order`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-2 rounded-xl font-bold transition-all duration-300 shadow-md shadow-emerald-600/10 hover:shadow-emerald-500/20"
              >
                <MessageCircle size={13} /> WhatsApp Order
              </a>
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Delivery in 30–45 mins
              </span>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-lg shadow-[0_-4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 ${
        darkMode ? 'bg-gray-950/90 border-gray-800 text-gray-400' : 'bg-white/95 border-gray-200 text-gray-600'
      }`}>
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex flex-col items-center gap-0.5 transition-all duration-200 cursor-pointer ${
              currentPage === 'home' ? 'text-emerald-600 dark:text-emerald-400 scale-105' : 'hover:text-emerald-500'
            }`}
          >
            <Home size={18} className={currentPage === 'home' ? 'stroke-[2.5px] text-emerald-600' : 'stroke-[1.8px]'} />
            <span className="text-[9px] font-bold">Home</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('products')}
            className={`flex flex-col items-center gap-0.5 transition-all duration-200 cursor-pointer ${
              currentPage === 'products' ? 'text-emerald-600 dark:text-emerald-400 scale-105' : 'hover:text-emerald-500'
            }`}
          >
            <LayoutGrid size={18} className={currentPage === 'products' ? 'stroke-[2.5px] text-emerald-600' : 'stroke-[1.8px]'} />
            <span className="text-[9px] font-bold">Categories</span>
          </button>

          <button
            onClick={() => setCurrentPage('subscriptions')}
            className={`flex flex-col items-center gap-0.5 transition-all duration-200 cursor-pointer ${
              currentPage === 'subscriptions' ? 'text-emerald-600 dark:text-emerald-400 scale-105' : 'hover:text-emerald-500'
            }`}
          >
            <RefreshCw size={18} className={currentPage === 'subscriptions' ? 'stroke-[2.5px] text-emerald-600' : 'stroke-[1.8px]'} />
            <span className="text-[9px] font-bold">Sub Packs</span>
          </button>

          <button
            onClick={toggleCart}
            className={`relative flex flex-col items-center gap-0.5 transition-all duration-200 cursor-pointer ${
              cartCount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'hover:text-emerald-500'
            }`}
          >
            <div className="relative">
              <ShoppingBag size={18} className="stroke-[1.8px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-white dark:border-gray-900 animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold">Cart</span>
          </button>

          <button
            onClick={() => setCurrentPage(currentCustomer ? 'orders' : 'customer-login')}
            className={`flex flex-col items-center gap-0.5 transition-all duration-200 cursor-pointer ${
              currentPage === 'orders' || currentPage === 'customer-login' ? 'text-emerald-600 dark:text-emerald-400 scale-105' : 'hover:text-emerald-500'
            }`}
          >
            <User size={18} className={currentPage === 'orders' || currentPage === 'customer-login' ? 'stroke-[2.5px] text-emerald-600' : 'stroke-[1.8px]'} />
            <span className="text-[9px] font-bold">{currentCustomer ? 'Orders' : 'Profile'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
