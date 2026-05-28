import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Shield, Truck, Clock, Star, ArrowRight, MapPin, Phone, MessageCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';

const BANNERS = [
  {
    id: 1,
    title: 'Fresh Groceries\nDelivered in 30 Mins',
    subtitle: 'Quality products at unbeatable prices',
    cta: 'Shop Now',
    bg: 'from-green-600 via-green-700 to-emerald-800',
    emoji: '🛒',
    badge: '⚡ Express Delivery',
    image: 'https://images.pexels.com/photos/7990381/pexels-photo-7990381.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=700',
  },
  {
    id: 2,
    title: 'Fresh Fruits &\nVegetables Daily',
    subtitle: 'Farm fresh, delivered to your door',
    cta: 'Explore Now',
    bg: 'from-orange-500 via-red-500 to-pink-600',
    emoji: '🥦',
    badge: '🌿 100% Fresh',
    image: 'https://images.pexels.com/photos/8805471/pexels-photo-8805471.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=700',
  },
  {
    id: 3,
    title: 'Order Online &\nSave Big Today',
    subtitle: 'Free delivery on orders above ₹299',
    cta: 'Order Now',
    bg: 'from-purple-600 via-indigo-600 to-blue-700',
    emoji: '💰',
    badge: '🏷️ Best Prices',
    image: 'https://images.pexels.com/photos/8939307/pexels-photo-8939307.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=700',
  },
];

export default function HomePage() {
  const { products, setSelectedCategory, setCurrentPage, darkMode, storeSettings } = useStore();
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(storeSettings.address)}&output=embed&z=16`;
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentBanner(p => (p + 1) % BANNERS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter(p => p.badge && p.inStock).slice(0, 12);
  const bestSellers = products.filter(p => p.badge === 'Best Seller' || p.badge === 'Popular').slice(0, 8);
  const newArrivals = products.filter(p => p.badge === 'Organic' || p.badge === 'Healthy').slice(0, 8);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage('products');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className={`relative h-64 sm:h-80 md:h-96 overflow-hidden`}>
          {BANNERS.map((banner, i) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ${i === currentBanner ? 'opacity-100 translate-x-0' : i < currentBanner ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'}`}
            >
              {/* Background image */}
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.bg} opacity-85`} />

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
                  <div className="max-w-lg">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      {banner.badge}
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-3" style={{ whiteSpace: 'pre-line' }}>
                      {banner.title}
                    </h1>
                    <p className="text-white/90 text-sm sm:text-base mb-5">{banner.subtitle}</p>
                    <button
                      onClick={() => setCurrentPage('products')}
                      className="bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                    >
                      {banner.cta} <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Controls */}
          <button
            onClick={() => setCurrentBanner(p => (p - 1 + BANNERS.length) % BANNERS.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/30 backdrop-blur-sm text-white rounded-full hover:bg-white/50"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentBanner(p => (p + 1) % BANNERS.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/30 backdrop-blur-sm text-white rounded-full hover:bg-white/50"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`rounded-full transition-all ${i === currentBanner ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
        {/* Features */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Zap, label: '30 Min Delivery', sub: 'Super fast', color: 'text-yellow-500', bg: darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50' },
            { icon: Shield, label: '100% Fresh', sub: 'Quality assured', color: 'text-green-500', bg: darkMode ? 'bg-green-900/30' : 'bg-green-50' },
            { icon: Truck, label: 'Free Delivery', sub: 'On orders ₹299+', color: 'text-blue-500', bg: darkMode ? 'bg-blue-900/30' : 'bg-blue-50' },
            { icon: Clock, label: '24/7 Support', sub: 'Always here', color: 'text-purple-500', bg: darkMode ? 'bg-purple-900/30' : 'bg-purple-50' },
          ].map(f => (
            <div key={f.label} className={`flex items-center gap-3 p-4 rounded-2xl ${f.bg} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`p-2 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <f.icon className={f.color} size={20} />
              </div>
              <div>
                <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{f.label}</p>
                <p className="text-gray-500 text-xs">{f.sub}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Shop by Category</h2>
            <button
              onClick={() => { setSelectedCategory('all'); setCurrentPage('products'); }}
              className="text-green-600 text-sm font-semibold hover:underline flex items-center gap-1"
            >
              See All <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-2xl border transition-all hover:scale-105 hover:shadow-md ${
                  darkMode ? 'bg-gray-800 border-gray-700 hover:border-green-500' : 'bg-white border-gray-200 hover:border-green-400'
                }`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-sm`}>
                  <span className="text-xl sm:text-2xl">{cat.emoji}</span>
                </div>
                <span className={`text-[10px] sm:text-xs font-semibold text-center leading-tight ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>🔥 Best Sellers</h2>
              <p className="text-gray-500 text-sm">Most loved by our customers</p>
            </div>
            <button onClick={() => setCurrentPage('products')} className="text-green-600 text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
            {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* Promo Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-red-600 p-6 sm:p-8">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-orange-100 text-sm font-semibold mb-1">Limited Time Offer 🎉</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white">Get 20% OFF Your First Order!</h3>
              <p className="text-orange-100 mt-1 text-sm">Use code: <span className="font-bold bg-white text-orange-600 px-2 py-0.5 rounded-lg">KRISHNA20</span></p>
            </div>
            <button
              onClick={() => setCurrentPage('products')}
              className="shrink-0 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all"
            >
              Claim Offer →
            </button>
          </div>
          <div className="absolute right-4 top-4 text-6xl opacity-20">🛍️</div>
          <div className="absolute right-20 bottom-4 text-4xl opacity-10">✨</div>
        </section>

        {/* Featured / Organic */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>🌿 Organic & Healthy</h2>
              <p className="text-gray-500 text-sm">Natural goodness, delivered fresh</p>
            </div>
            <button onClick={() => setCurrentPage('products')} className="text-green-600 text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>⭐ Featured Products</h2>
              <p className="text-gray-500 text-sm">Hand-picked by our team</p>
            </div>
            <button onClick={() => setCurrentPage('products')} className="text-green-600 text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className={`text-xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>💬 What Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Priya Sharma', text: 'Amazing service! Delivery in just 25 minutes. Products are always fresh and prices are great.', rating: 5, avatar: '👩' },
              { name: 'Rahul Verma', text: 'Krishna Kirana is my go-to for groceries. Wide variety and super fast delivery!', rating: 5, avatar: '👨' },
              { name: 'Sunita Patel', text: 'Love the organic options here. Quality is excellent and the app is so easy to use.', rating: 4, avatar: '👩‍🦱' },
            ].map(t => (
              <div key={t.name} className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={14} className={s <= t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                <p className={`text-sm leading-relaxed mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{t.avatar}</span>
                  <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Store Location */}
        <section className={`rounded-3xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
          <div className="p-6">
            <h2 className={`text-xl font-black mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>📍 Visit Our Store</h2>
            <p className="text-gray-500 text-sm mb-4">Come visit us or order online for home delivery</p>
          </div>
          <div className="relative">
            <iframe
              title="Krishna Kirana Location"
              src={mapEmbedUrl}
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="p-5 flex flex-col sm:flex-row gap-3">
            <div className={`flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm space-y-1`}>
              <p className="flex items-center gap-2"><MapPin size={14} className="text-green-600" /> {storeSettings.address}</p>
              <p className="flex items-center gap-2"><Phone size={14} className="text-green-600" /> {storeSettings.phone}</p>
              <p className="flex items-center gap-2"><Clock size={14} className="text-green-600" /> Open Daily: {storeSettings.businessHours}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={storeSettings.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                <MapPin size={14} /> Get Directions
              </a>
              <a
                href={`https://wa.me/${storeSettings.whatsapp}?text=Hi! I want to place an order from Krishna Kirana`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={14} /> WhatsApp Order
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* WhatsApp Float Button */}
      <a
        href={`https://wa.me/${storeSettings.whatsapp}?text=Hi! I want to place an order from Krishna Kirana`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-xl hover:bg-green-600 transition-all hover:scale-110"
        title="Order on WhatsApp"
      >
        <MessageCircle className="text-white" size={26} fill="white" />
      </a>
    </div>
  );
}
