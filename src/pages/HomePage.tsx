import { useState, useEffect, useRef } from 'react';
import { Zap, Shield, Truck, Clock, Star, ArrowRight, MapPin, Phone, MessageCircle, Sparkles, ChevronLeft, ChevronRight, ArrowUp, Flame, BookOpen, Leaf, ShoppingBag, Store, RotateCcw, Tag, MessageSquare, Package } from 'lucide-react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import AIQueryAssistant from '../components/AIQueryAssistant';

const CATEGORY_IMAGES: Record<string, string> = {
  'rice-atta': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'oils-ghee': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'dal-pulses': 'https://images.unsplash.com/photo-1547050605-2f8653ac5a0d?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'spices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'biscuits-snacks': 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'beverages': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'dairy': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'fruits-veggies': 'https://images.unsplash.com/photo-1610832958506-ee5633619141?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'personal-care': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'baby-care': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'frozen': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'instant-food': 'https://images.unsplash.com/photo-1612966608967-312ba599102e?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'bread-bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'sweets': 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'stationery': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
  'stationary': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop'
};


export default function HomePage() {
  const { 
    products, setSelectedCategory, setCurrentPage, darkMode, storeSettings, categories,
    recentlyViewedIds = [], banners = [], setSelectedProductId
  } = useStore();

  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);
  const [aiOpenInline, setAiOpenInline] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(storeSettings.address)}&output=embed&z=16`;

  const dealProducts = [...products]
    .filter(p => p.mrp > p.price)
    .sort((a, b) => {
      const discA = (a.mrp - a.price) / a.mrp;
      const discB = (b.mrp - b.price) / b.mrp;
      return discB - discA;
    })
    .slice(0, 4);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentPromoSlide(p => (p + 1) % banners.length);
    }, 4000);
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [banners.length]);

  const handleNextSlide = () => {
    if (banners.length === 0) return;
    setCurrentPromoSlide(p => (p + 1) % banners.length);
  };

  const handlePrevSlide = () => {
    if (banners.length === 0) return;
    setCurrentPromoSlide(p => (p - 1 + banners.length) % banners.length);
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesScrollRef.current) {
      const scrollAmount = 350;
      categoriesScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find exact Trending Now products matching prompt requirements
  const trendingTargetNames = [
    'Basmati Rice',
    'Fortune Sunflower Oil',
    'Toor Dal',
    'Maggi Noodles (12 pack)',
    'Amul Butter',
    'Brooke Bond Tea'
  ];
  const trendingProducts = [...products]
    .filter(p => trendingTargetNames.some(name => p.name === name))
    .slice(0, 6);

  // Find exact Buy Again / Recently Viewed items matching prompt requirements
  const recentlyViewedTargetNames = [
    'Amul Dahi (Curd)',
    'Tata Salt',
    'Britannia Biscuits',
    'Red Label Tea'
  ];
  const defaultRecentlyViewed = [...products]
    .filter(p => recentlyViewedTargetNames.some(name => p.name === name))
    .slice(0, 4);

  // Fallback to defaultRecentlyViewed if customer has no recentlyViewed history
  const activeRecentlyViewed = recentlyViewedIds.length > 0
    ? [...products].filter(p => recentlyViewedIds.includes(p.id)).slice(0, 8)
    : defaultRecentlyViewed;

  const bestSellers = [...products]
    .filter(p => p.badge === 'Best Seller' || p.badge === 'Popular')
    .sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0))
    .slice(0, 8);

  const organicPack = [...products]
    .filter(p => p.badge === 'Organic' || p.badge === 'Healthy' || p.category === 'fruits-veggies')
    .sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0))
    .slice(0, 4);

  const stationeryProducts = [...products]
    .filter(p => p.category?.toLowerCase() === 'stationery' || p.category?.toLowerCase() === 'stationary')
    .slice(0, 15);

  const vegetableProducts = [...products]
    .filter(p => p.category?.toLowerCase() === 'fruits-veggies' && (p.subcategory?.toLowerCase() === 'vegetables' || p.subcategory?.toLowerCase() === 'leafy veggies'))
    .slice(0, 15);

  const fruitProducts = [...products]
    .filter(p => p.category?.toLowerCase() === 'fruits-veggies' && p.subcategory?.toLowerCase() === 'fruits')
    .slice(0, 15);

  const iceCreamProducts = [...products]
    .filter(p => p.category?.toLowerCase() === 'frozen' || p.subcategory?.toLowerCase() === 'ice cream')
    .slice(0, 15);

  const handleCategoryClick = (catId: string) => {
    console.log('handleCategoryClick called with:', catId);
    setSelectedCategory(catId);
    setCurrentPage('products');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white font-poppins' : 'bg-white text-gray-800 font-poppins'}`}>
      
      {/* 2. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#0c2a1e] via-[#1b4332] to-[#081c15] text-white overflow-hidden py-12 sm:py-16 md:py-20 animate-fade-up">
        {/* Subtle decorative ambient glows */}
        <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Instant Local Delivery in Bhopal</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Fresh Groceries <br/>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                Delivered in 15 Mins
              </span>
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base font-medium max-w-lg leading-relaxed">
              Order farm-fresh vegetables, dairy, pulses, spices, and household essentials at genuine local mandi rates. Free delivery on orders above ₹{storeSettings.freeDeliveryAbove}!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => { 
                  setSelectedCategory('all'); 
                  setCurrentPage('products'); 
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black px-7 py-3.5 rounded-2xl hover:shadow-[0_8px_30px_rgba(16,185,129,0.35)] hover:scale-102 transition-all flex items-center gap-2 cursor-pointer text-sm shadow-md border-none"
              >
                <span>Shop Catalog</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => setCurrentPage('subscriptions')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-6 py-3.5 rounded-2xl transition-all text-sm cursor-pointer backdrop-blur-md"
              >
                Daily Milk & Packs
              </button>
            </div>

            {/* Quick stats / trust strip */}
            <div className="pt-2 flex items-center gap-6 text-xs text-emerald-200/80 font-bold">
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-emerald-400" />
                <span>Free Delivery Above ₹{storeSettings.freeDeliveryAbove}</span>
              </div>
              <span className="opacity-40">•</span>
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-emerald-400" />
                <span>Cash / UPI on Delivery</span>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-video md:aspect-auto md:h-[340px] w-full max-w-md mx-auto md:ml-auto rounded-3xl overflow-hidden shadow-2xl border border-white/15 hidden md:block group">
            <img 
              src="/kirana_hero.png" 
              alt="Krishna Kirana Grocery Store" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-black/20" />
            
            {/* Floating Top Badge */}
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-gray-900 dark:text-white">⚡ Bhopal Fast Delivery Hub</span>
            </div>

            {/* Bottom info banner */}
            <div className="absolute bottom-4 left-4 right-4 bg-gray-950/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-xs text-white font-bold">
                <span>Direct from Mandi</span>
                <span className="text-emerald-400 font-extrabold">100% Quality Checked</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container with Alternating Section Backgrounds */}
      <div className="space-y-0">
        
        {/* 3. FEATURE SECTION (4 Cards) */}
        <section className={`py-10 border-b ${darkMode ? 'bg-gray-950 border-gray-850' : 'bg-white border-gray-100'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {[
                { icon: Zap, label: '10–15 Min Delivery', desc: 'Direct from nearest Bhopal store', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
                { icon: Shield, label: 'Quality Assured', desc: 'Handpicked fresh staples & dairy', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' },
                { icon: Truck, label: 'Best Local Price', desc: 'Guaranteed savings over MRP', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
                { icon: Clock, label: 'Easy Pay (COD/UPI)', desc: 'Inspect goods first, pay after', color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30' },
              ].map((f, idx) => (
                <div key={idx} className={`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 p-4 sm:p-4.5 rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                  darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-gray-50/70 border-gray-150/80 hover:bg-white hover:border-emerald-200'
                }`}>
                  <div className={`p-2.5 rounded-xl ${f.color} flex items-center justify-center shrink-0 shadow-xs`}>
                    <f.icon size={20} className="stroke-[2.5px]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className={`font-black text-xs sm:text-sm leading-snug ${darkMode ? 'text-white' : 'text-gray-900'}`}>{f.label}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-[11px] font-medium leading-normal">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. IMAGE CAROUSEL/SLIDER */}
        {banners && banners.length > 0 && (
          <section className={`py-8 ${darkMode ? 'bg-gray-950/60' : 'bg-[#FFF8F0]/40'}`}>
            <div className="max-w-7xl mx-auto px-4">
              <div className="relative group overflow-hidden rounded-3xl border border-gray-150 dark:border-gray-855 shadow-premium animate-fade-up">
                <div className="relative h-48 sm:h-56 md:h-72 overflow-hidden">
                  {banners.map((slide, i) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        i === currentPromoSlide 
                          ? 'opacity-100 translate-x-0 z-10 pointer-events-auto' 
                          : i < currentPromoSlide 
                          ? 'opacity-0 -translate-x-full pointer-events-none' 
                          : 'opacity-0 translate-x-full pointer-events-none'
                      }`}
                    >
                      {slide.image && (
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg || 'from-green-600 to-emerald-800'} opacity-85 dark:opacity-90`} />

                      <div className="relative z-10 h-full flex items-center px-6 sm:px-16">
                        <div className="max-w-xl space-y-3 font-poppins">
                          {slide.badge && (
                            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                              {slide.badge}
                            </span>
                          )}
                          <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-white leading-tight whitespace-pre-line">
                            {slide.title}
                          </h2>
                          <p className="text-white/85 text-xs sm:text-base font-semibold">{slide.subtitle}</p>
                          <button
                            onClick={() => {
                              console.log('Promo slide CTA clicked', slide);
                              if (slide.linkCategory) {
                                setSelectedCategory(slide.linkCategory);
                                setCurrentPage('products');
                              } else if (slide.linkProduct) {
                                setSelectedProductId(slide.linkProduct);
                              } else {
                                setSelectedCategory('all');
                                setCurrentPage('products');
                              }
                            }}
                            className="bg-[#FF6B35] hover:bg-[#e85d04] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all hover:scale-105 cursor-pointer shadow-sm border-none outline-none"
                          >
                            {slide.cta || 'Shop Now'} →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Left Arrow Button */}
                  {banners.length > 1 && (
                    <button
                      onClick={handlePrevSlide}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none outline-none"
                      aria-label="Previous Slide"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}

                  {/* Right Arrow Button */}
                  {banners.length > 1 && (
                    <button
                      onClick={handleNextSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none outline-none"
                      aria-label="Next Slide"
                    >
                      <ChevronRight size={20} />
                    </button>
                  )}

                  {/* Dots Navigation */}
                  {banners.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                      {banners.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPromoSlide(i)}
                          className={`rounded-full transition-all cursor-pointer border-none outline-none ${
                            i === currentPromoSlide ? 'w-5 h-1.5 bg-[#FF6B35]' : 'w-1.5 h-1.5 bg-white/40'
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5. SHOP BY CATEGORY (Horizontal Scroll) */}
        <section className={`py-12 ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider font-poppins flex items-center gap-2">
                  <ShoppingBag size={20} className="text-emerald-600" />
                  <span>Shop by Category</span>
                </h2>
                <p className="text-gray-400 text-xs font-semibold">Choose from a variety of fresh goods</p>
              </div>
              <button
                type="button"
                onClick={() => { setSelectedCategory('all'); setCurrentPage('products'); }}
                className="text-[#FF6B35] text-xs font-extrabold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none p-0"
              >
                See All Products <ArrowRight size={12} />
              </button>
            </div>
            
            <div className="relative group">
              {/* Left Scroll Button */}
              <button
                onClick={() => scrollCategories('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 z-20 w-9 h-9 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center shadow-md hover:scale-105 hover:bg-emerald-50 dark:hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100 cursor-pointer hidden md:flex"
              >
                <ChevronLeft size={18} className="text-gray-650 dark:text-gray-300" />
              </button>

              {/* Scroll Container */}
              <div
                ref={categoriesScrollRef}
                className="flex gap-4.5 overflow-x-auto scrollbar-hide py-2 scroll-smooth px-1"
              >
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`flex flex-col items-center gap-2.5 p-3 rounded-2xl border transition-all hover:scale-105 hover:shadow-md shrink-0 w-24 group cursor-pointer ${
                      darkMode ? 'bg-gray-900 border-gray-855 hover:border-green-500/30' : 'bg-[#FFF8F0]/20 border-gray-200/80 hover:border-green-300'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shadow-inner border border-gray-150/40 dark:border-gray-805 shrink-0`}>
                      <img
                        src={cat.image || CATEGORY_IMAGES[cat.id] || `https://placehold.co/80x80/2ecc71/ffffff?text=${encodeURIComponent(cat.name[0])}`}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <span className={`text-[10px] font-bold text-center leading-tight tracking-wide ${darkMode ? 'text-gray-350' : 'text-gray-755'}`}>
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Right Scroll Button */}
              <button
                onClick={() => scrollCategories('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 z-20 w-9 h-9 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 flex items-center justify-center shadow-md hover:scale-105 hover:bg-emerald-50 dark:hover:bg-gray-805 transition-all opacity-0 group-hover:opacity-100 cursor-pointer hidden md:flex"
              >
                <ChevronRight size={18} className="text-gray-655 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </section>

        {/* 6. TRENDING NOW SECTION */}
        <section className={`py-12 ${darkMode ? 'bg-gray-950/60' : 'bg-[#FFF8F0]/30'}`}>
          <div className="max-w-7xl mx-auto px-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider font-poppins flex items-center gap-1.5">
                  <Flame size={20} className="text-[#FF6B35]" />
                  <span className="text-[#FF6B35]">Trending Now</span>
                  <span className="text-[9px] bg-[#2ECC71] text-white font-extrabold px-2 py-0.5 rounded-full uppercase ml-1">Top Sellers</span>
                </h2>
                <p className="text-gray-400 text-xs font-semibold">Most bought items in Bhopal this week</p>
              </div>
              <button
                type="button"
                onClick={() => { setSelectedCategory('all'); setCurrentPage('products'); }}
                className="text-[#FF6B35] text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none p-0"
              >
                View All <ArrowRight size={12} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {trendingProducts.map(product => (
                <div key={product.id} className="animate-fade-up">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stationery Section */}
        <section className={`py-12 ${darkMode ? 'bg-gray-950/60' : 'bg-[#FFF8F0]/30'}`}>
          <div className="max-w-7xl mx-auto px-4 space-y-8">
            {/* Stationery Banner Card */}
            <div className="relative rounded-3xl overflow-hidden text-white bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 p-8 sm:p-10 shadow-premium relative animate-fade-up">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                    <BookOpen size={11} /> School & Office Essentials
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight font-poppins">
                    Stationery & Study Supplies <br/>
                    <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">Delivered In 30 Mins</span>
                  </h2>
                  <p className="text-blue-100 text-xs sm:text-sm font-semibold max-w-md leading-relaxed">
                    Notebooks, pens, colors, adhesives, and complete geometry kits for students and home offices. Best quality products at competitive prices!
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory('stationery'); setCurrentPage('products'); }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold px-6 py-3 rounded-xl transition-all hover:scale-102 cursor-pointer border-none outline-none text-xs"
                  >
                    View All Stationery
                  </button>
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg hidden md:block max-w-[340px] ml-auto">
                  <img
                    src="https://images.unsplash.com/photo-1545670723-196ed0954986?auto=compress&cs=tinysrgb&w=600&h=350&fit=crop"
                    alt="Stationery Supplies"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Stationery Products Row */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-base font-black uppercase tracking-wider font-poppins flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <BookOpen size={16} className="text-blue-500" />
                    <span>Best Selling Stationery</span>
                  </h3>
                  <p className="text-gray-400 text-xs font-semibold">Notebooks, pens, colors & art supplies</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('stationery'); setCurrentPage('products'); }}
                  className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none p-0"
                >
                  View All <ArrowRight size={12} />
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto scrollbar-hide py-1.5 scroll-smooth">
                {stationeryProducts.map(product => (
                  <div key={product.id} className="w-44 sm:w-48 shrink-0 hover:scale-102 transition-transform duration-305 animate-fade-up">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vegetables Section */}
        <section className={`py-12 ${darkMode ? 'bg-gray-950/60' : 'bg-[#FFF8F0]/30'}`}>
          <div className="max-w-7xl mx-auto px-4 space-y-8">
            {/* Vegetables Banner Card */}
            <div className="relative rounded-3xl overflow-hidden text-white bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#081c15] p-8 sm:p-10 shadow-premium relative animate-fade-up">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#2ECC71]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#FF6B35]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                    <Leaf size={11} /> 100% Organic & Farm Fresh
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight font-poppins">
                    Fresh Vegetables & Greens <br/>
                    <span className="bg-gradient-to-r from-emerald-350 to-green-300 bg-clip-text text-transparent">Direct From Local Farms</span>
                  </h2>
                  <p className="text-emerald-100 text-xs sm:text-sm font-semibold max-w-md leading-relaxed">
                    Hand-picked, clean, and nutritious vegetables. Delivered fresh to your kitchen daily at the best local rates.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory('fruits-veggies'); setCurrentPage('products'); }}
                    className="bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] hover:from-[#e85d04] hover:to-[#e85d04] text-white font-extrabold px-6 py-3 rounded-xl transition-all hover:scale-102 cursor-pointer border-none outline-none text-xs shadow-md"
                  >
                    View All Vegetables
                  </button>
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg hidden md:block max-w-[340px] ml-auto">
                  <img
                    src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=compress&cs=tinysrgb&w=600&h=350&fit=crop"
                    alt="Fresh Vegetables"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Vegetables Products Row */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-base font-black uppercase tracking-wider font-poppins flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Leaf size={16} className="text-green-500" />
                    <span>Farm Fresh Vegetables</span>
                  </h3>
                  <p className="text-gray-400 text-xs font-semibold">Tomatoes, onions, potatoes, leafy greens & more</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('fruits-veggies'); setCurrentPage('products'); }}
                  className="text-green-600 dark:text-green-400 text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none p-0"
                >
                  View All <ArrowRight size={12} />
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto scrollbar-hide py-1.5 scroll-smooth">
                {vegetableProducts.map(product => (
                  <div key={product.id} className="w-44 sm:w-48 shrink-0 hover:scale-102 transition-transform duration-305 animate-fade-up">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Fruits Section */}
        <section className={`py-12 ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 space-y-8">
            {/* Fruits Banner Card */}
            <div className="relative rounded-3xl overflow-hidden text-white bg-gradient-to-br from-[#d48c00] via-[#e85d04] to-[#f48c06] p-8 sm:p-10 shadow-premium relative animate-fade-up">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                    <Sparkles size={11} /> Sweet & Healthy Seasonal Fruits
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight font-poppins">
                    Juicy & Fresh Fruits <br/>
                    <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">Sourced For Your Health</span>
                  </h2>
                  <p className="text-orange-50 text-xs sm:text-sm font-semibold max-w-md leading-relaxed">
                    Naturally sweet, fresh, and packed with vitamins. Bananas, apples, oranges, grapes, papayas, and seasonal special mangoes.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory('fruits-veggies'); setCurrentPage('products'); }}
                    className="bg-white text-orange-600 font-extrabold px-6 py-3 rounded-xl transition-all hover:scale-102 cursor-pointer border-none outline-none text-xs shadow-md hover:bg-orange-50"
                  >
                    View All Fruits
                  </button>
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg hidden md:block max-w-[340px] ml-auto">
                  <img
                    src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=compress&cs=tinysrgb&w=600&h=350&fit=crop"
                    alt="Fresh Fruits"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Fruits Products Row */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-base font-black uppercase tracking-wider font-poppins flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Sparkles size={16} className="text-orange-500" />
                    <span>Seasonal Fresh Fruits</span>
                  </h3>
                  <p className="text-gray-400 text-xs font-semibold">Bananas, apples, grapes, mangoes & more</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('fruits-veggies'); setCurrentPage('products'); }}
                  className="text-orange-600 dark:text-orange-400 text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none p-0"
                >
                  View All <ArrowRight size={12} />
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto scrollbar-hide py-1.5 scroll-smooth">
                {fruitProducts.map(product => (
                  <div key={product.id} className="w-44 sm:w-48 shrink-0 hover:scale-102 transition-transform duration-305 animate-fade-up">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Ice Cream & Frozen Foods Section */}
        <section className={`py-12 ${darkMode ? 'bg-gray-950/60' : 'bg-[#FFF8F0]/30'}`}>
          <div className="max-w-7xl mx-auto px-4 space-y-8">
            {/* Ice Cream Banner Card */}
            <div className="relative rounded-3xl overflow-hidden text-white bg-gradient-to-br from-cyan-600 via-blue-750 to-indigo-950 p-8 sm:p-10 shadow-premium relative animate-fade-up">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                    <Sparkles size={11} /> Cool & Creamy Delights
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight font-poppins">
                    Ice Creams & Frozen Desserts <br/>
                    <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Delivered Frozen in 30 Mins</span>
                  </h2>
                  <p className="text-cyan-100 text-xs sm:text-sm font-semibold max-w-md leading-relaxed">
                    Indulge in your favorite flavors of Amul, Kwality Wall's, Havmor, and kulfis. Also stocking McCain french fries, frozen peas, and corn. Delivered in specialized insulated bags to stay perfectly frozen!
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory('frozen'); setCurrentPage('products'); }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-extrabold px-6 py-3 rounded-xl transition-all hover:scale-102 cursor-pointer border-none outline-none text-xs"
                  >
                    View All Ice Creams
                  </button>
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg hidden md:block max-w-[340px] ml-auto">
                  <img
                    src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=compress&cs=tinysrgb&w=600&h=350&fit=crop"
                    alt="Ice Cream Delights"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Ice Cream Products Row */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-base font-black uppercase tracking-wider font-poppins flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Package size={16} className="text-cyan-500" />
                    <span>Best Selling Ice Creams & Frozen Foods</span>
                  </h3>
                  <p className="text-gray-400 text-xs font-semibold">Vanilla, chocolate, butterscotch, french fries & more</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('frozen'); setCurrentPage('products'); }}
                  className="text-cyan-600 dark:text-cyan-400 text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none p-0"
                >
                  View All <ArrowRight size={12} />
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto scrollbar-hide py-1.5 scroll-smooth">
                {iceCreamProducts.map(product => (
                  <div key={product.id} className="w-44 sm:w-48 shrink-0 hover:scale-102 transition-transform duration-305 animate-fade-up">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Deal Zone Section */}
        {dealProducts.length > 0 && (
          <section className={`py-12 ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider font-poppins text-[#2ECC71] flex items-center gap-2">
                    <Zap size={18} className="text-amber-500" />
                    <span>Deal Zone</span>
                    <span className="text-[9px] bg-[#FF4444] text-white font-extrabold px-2.5 py-0.5 rounded-full animate-pulse ml-1">MIN. 15% OFF</span>
                  </h2>
                  <p className="text-gray-400 text-xs font-semibold">Special discounts on daily essentials</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('all'); setCurrentPage('products'); }}
                  className="text-green-600 text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none p-0"
                >
                  See All Deals <ArrowRight size={12} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {dealProducts.map(product => {
                  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
                  return (
                    <div key={product.id} className="relative group animate-fade-up">
                      <ProductCard product={product} />
                      <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-[#FF4444] to-[#FF6B35] text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shadow-md animate-express-pulse">
                        {discountPercent}% OFF
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 7. INSTANT HELP / AI ASSISTANT SECTION */}
        <section className={`py-12 ${darkMode ? 'bg-gray-950/60' : 'bg-[#FFF8F0]/30'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-premium relative overflow-hidden bg-gradient-to-br ${
              darkMode 
                ? 'from-emerald-950/45 via-gray-900 to-slate-950 border-emerald-900/30' 
                : 'from-emerald-50/60 via-white to-orange-50/20 border-green-200'
            } animate-fade-up`}>
              {/* Decorative glows */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6B35]/5 dark:bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#2ECC71]/5 dark:bg-[#FF6B35]/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                    <Sparkles size={11} className="animate-pulse" /> Kirana AI Assistant
                  </span>
                  <h2 className={`text-xl sm:text-2xl font-black leading-tight font-poppins ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Need ingredients for a recipe? <br className="hidden sm:inline" />
                    <span className="text-[#FF6B35]">Ask Kirana AI!</span>
                  </h2>
                  <p className={`text-xs sm:text-sm font-semibold max-w-xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Type what you want to cook (e.g. <span className="italic">"Paneer Butter Masala"</span> or <span className="italic">"Chai ingredients"</span>) and our intelligent helper will suggest and add them to your cart in one-tap!
                  </p>
                  {!aiOpenInline && (
                    <button
                      onClick={() => setAiOpenInline(true)}
                      className="mt-2 inline-flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#e85d04] text-white px-5 py-3 rounded-xl font-extrabold text-xs shadow-md transition-all hover:scale-102 cursor-pointer border-none outline-none"
                    >
                      <Sparkles size={14} />
                      <span>Launch AI Assistant</span>
                    </button>
                  )}
                </div>
                {aiOpenInline && (
                  <div className="shrink-0 w-full md:w-auto self-center animate-slide-in">
                    <AIQueryAssistant onClose={() => setAiOpenInline(false)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 8. BUY AGAIN / RECENTLY VIEWED (Horizontal Scroll) */}
        {activeRecentlyViewed.length > 0 && (
          <section className={`py-12 ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4 space-y-6 animate-fade-up">
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider font-poppins flex items-center gap-2">
                  <RotateCcw size={18} className="text-emerald-600" />
                  <span>Buy Again / Recently Viewed</span>
                </h2>
                <p className="text-gray-405 text-xs font-semibold">Quick checkout on products you checked out recently</p>
              </div>
              
              <div className="flex gap-4 overflow-x-auto scrollbar-hide py-1.5 scroll-smooth">
                {activeRecentlyViewed.map(p => (
                  <div key={p.id} className="w-44 sm:w-48 shrink-0 hover:scale-102 transition-transform duration-300">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Best Sellers */}
        <section className={`py-12 ${darkMode ? 'bg-gray-950/60' : 'bg-[#FFF8F0]/30'}`}>
          <div className="max-w-7xl mx-auto px-4 space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider font-poppins flex items-center gap-2">
                  <Flame size={18} className="text-orange-500" />
                  <span>Bestseller Staples</span>
                </h2>
                <p className="text-gray-400 text-xs font-semibold">Daily grocery items most popular in your area</p>
              </div>
              <button type="button" onClick={() => setCurrentPage('products')} className="text-green-600 text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none p-0">
                View All <ArrowRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>

        {/* Trust Badge and Promo Banner */}
        <section className="max-w-7xl mx-auto px-4 py-8 animate-fade-up">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF6B35] to-red-650 p-6 sm:p-8">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full inline-flex items-center gap-1">
                  <Tag size={10} /> Limited Coupon Alert
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-2 font-poppins">Get 20% OFF on your first purchase!</h3>
                <p className="text-orange-100 mt-1 text-xs font-semibold">Use code: <span className="font-bold bg-white text-orange-655 px-2 py-0.5 rounded-lg">KRISHNA20</span></p>
              </div>
              <button
                onClick={() => { setSelectedCategory('all'); setCurrentPage('products'); }}
                className="shrink-0 bg-white text-[#FF6B35] font-extrabold px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all text-xs cursor-pointer border-none outline-none"
              >
                Claim Offer →
              </button>
            </div>
            <div className="absolute right-4 top-4 text-white/10 select-none">
              <ShoppingBag size={80} strokeWidth={1} />
            </div>
          </div>
        </section>

        {/* Organic Goodness */}
        <section className={`py-12 ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider font-poppins flex items-center gap-2">
                  <Leaf size={18} className="text-emerald-600" />
                  <span>Organic & Fresh</span>
                </h2>
                <p className="text-gray-400 text-xs font-semibold">100% organic, healthy daily essentials</p>
              </div>
              <button type="button" onClick={() => setCurrentPage('products')} className="text-green-600 text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none p-0">
                View All <ArrowRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {organicPack.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>

        {/* Local Business Trust Story & Owner Message */}
        <section className={`py-12 ${darkMode ? 'bg-gray-950/60' : 'bg-[#FFF8F0]/30'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-premium ${
              darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200/60'
            } grid md:grid-cols-3 gap-6 items-center animate-fade-up`}>
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-lg font-black flex items-center gap-2 font-poppins">
                  <Store size={20} className="text-emerald-600" />
                  <span>About Krishna Kirana Store</span>
                </h2>
                <div className={`text-xs leading-relaxed space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-650'}`}>
                  <p>
                    Founded on the values of **quality, freshness, and local trust**, **Krishna Kirana** has been serving families in Bhopal for years. Our goal is to bring the absolute best quality local groceries directly from the farms to your doorstep in 30 minutes.
                  </p>
                  <p>
                    "We hand-check every dal, rice pack, vegetable, and milk packet before loading it into delivery bags. Local families deserve the exact same trust online that they receive at our physical store counters." 
                    <br />
                    <span className="font-extrabold text-[#2ECC71] dark:text-green-400 block mt-1">— Anil Sahu, Owner & Founder</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Bhanpur', 'Karond', 'Vidisha Road', 'Kalyan Nagar'].map(tag => (
                    <span key={tag} className={`text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                      darkMode ? 'bg-gray-800 text-green-404' : 'bg-green-50 text-green-700'
                    }`}>
                      <MapPin size={10} />
                      <span>Active in {tag}</span>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="relative aspect-[4/3] w-full max-w-[320px] mx-auto rounded-2xl overflow-hidden border border-gray-250 dark:border-gray-800 shadow">
                <img 
                  src="/storefront.png" 
                  alt="Krishna Kirana Store" 
                  className="w-full h-full object-cover object-center" 
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] font-bold text-center py-2">
                  Krishna Kirana Storefront (Bhopal)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews & Google Testimonials */}
        <section className={`py-12 ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 space-y-6 animate-fade-up">
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider font-poppins flex items-center gap-2">
                <MessageSquare size={18} className="text-emerald-600" />
                <span>Customer Testimonials (Google Reviews)</span>
              </h2>
              <p className="text-gray-405 text-xs font-semibold">Real opinions from verified shoppers in Bhopal</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'Priya Sharma', text: 'Superfast delivery! Got milk and butter in just 20 minutes. Products are extremely fresh and prices match local rates.', rating: 5, date: '2 days ago' },
                { name: 'Rahul Verma', text: 'Love the new website! The AI assistant matched spices and paneer ingredients in one tap. Highly recommended kirana delivery.', rating: 5, date: '1 week ago' },
                { name: 'Sunita Patel', text: 'I subscribed to daily Amul Milk delivery. The driver brings it silently at 7 AM. Hassle-free and very reliable.', rating: 5, date: '3 days ago' },
              ].map(t => (
                <div key={t.name} className={`p-5 rounded-3xl border flex flex-col justify-between shadow-premium ${
                  darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200/80'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={11} className="text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <span className="text-[9px] bg-blue-105 text-blue-800 px-2 py-0.5 rounded font-black uppercase">Verified Shopper</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-650'}`}>"{t.text}"</p>
                  </div>
                  <div className="flex items-center justify-between border-t dark:border-gray-800 mt-4 pt-3 text-[10px]">
                    <span className="font-extrabold dark:text-white">{t.name}</span>
                    <span className="text-gray-405">{t.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visited Store Location Map */}
        <section className={`py-12 ${darkMode ? 'bg-gray-950/60' : 'bg-[#FFF8F0]/30'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className={`rounded-3xl overflow-hidden border shadow-premium animate-fade-up ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <div className="p-6">
                <h2 className={`text-base font-black mb-1 font-poppins flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <MapPin size={18} className="text-emerald-600" />
                  <span>Visit Our Storefront</span>
                </h2>
                <p className="text-gray-500 text-xs">If you prefer shopping in person, come visit our main warehouse outlet</p>
              </div>
              <div className="relative border-b dark:border-gray-800">
                <iframe
                  title="Krishna Kirana Location"
                  src={mapEmbedUrl}
                  width="100%"
                  height="240"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="p-5 flex flex-col sm:flex-row gap-3">
                <div className={`flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-650'} text-xs space-y-1.5`}>
                  <p className="flex items-center gap-2"><MapPin size={13} className="text-green-600" /> {storeSettings.address}</p>
                  <p className="flex items-center gap-2"><Phone size={13} className="text-green-600" /> {storeSettings.phone}</p>
                  <p className="flex items-center gap-2"><Clock size={13} className="text-green-600" /> Open Hours: {storeSettings.businessHours}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 shrink-0 self-center">
                  <a
                    href={storeSettings.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-blue-650 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm border-none outline-none"
                  >
                    <MapPin size={12} /> Get Directions
                  </a>
                  <a
                    href={`https://wa.me/${storeSettings.whatsapp}?text=Hi! I want to place an order`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#2ECC71] hover:bg-[#1db85b] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm border-none outline-none"
                  >
                    <MessageCircle size={12} /> WhatsApp Order
                  </a>
                </div>
              </div>
            </div>
            
            {/* 14. ADMIN LOGIN SHORTCUT */}
            <div className="flex justify-center pt-8">
              <button
                onClick={() => setCurrentPage('admin')}
                className={`flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                  darkMode 
                    ? 'border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white hover:border-gray-700' 
                    : 'border-gray-250 bg-gray-55 text-gray-550 hover:text-[#FF6B35] hover:border-gray-300'
                }`}
              >
                <Shield size={14} className="text-emerald-500" />
                <span>Admin Login Panel</span>
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* 10. FLOATING BUTTONS */}
      {/* WhatsApp Quick Chat */}
      <a
        href={`https://wa.me/${storeSettings.whatsapp}?text=Hi! I want to place an order`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-[#2ECC71] rounded-full flex items-center justify-center shadow-xl hover:bg-[#1db85b] transition-all hover:scale-110"
        title="Quick WhatsApp Chat"
      >
        <MessageCircle className="text-white" size={22} fill="white" />
      </a>

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-6 z-40 w-10 h-10 bg-black/60 hover:bg-[#FF6B35] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer border-none outline-none"
          title="Back to Top"
        >
          <ArrowUp size={18} strokeWidth={2.5} />
        </button>
      )}

    </div>
  );
}
