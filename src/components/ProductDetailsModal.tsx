import { useState, useEffect } from 'react';
import { X, Star, ShoppingCart, Heart, Shield, CheckCircle, Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Product } from '../data/products';
import toast from 'react-hot-toast';
import NotifyMeModal from './NotifyMeModal';

interface Props {
  productId: string;
  onClose: () => void;
}

export default function ProductDetailsModal({ productId, onClose }: Props) {
  const {
    products,
    cart = [],
    addToCart,
    updateQuantity,
    darkMode,
    wishlistIds = [],
    toggleWishlist,
    storeSettings,
    setCurrentPage
  } = useStore();

  const product = products.find(p => p.id === productId);

  if (!product) return null;

  // State
  const [selectedPack, setSelectedPack] = useState<number>(1);
  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const isWishlisted = wishlistIds.includes(product.id);

  // Parse product unit
  const parseUnit = (unitStr: any) => {
    if (unitStr === undefined || unitStr === null) return { val: 1, unit: 'pc' };
    const str = String(unitStr).trim();
    const match = str.match(/^([\d.]+)\s*(.*)$/);
    if (!match) return { val: 1, unit: str.toLowerCase() || 'pc' };
    return { val: parseFloat(match[1]), unit: match[2].trim().toLowerCase() };
  };

  const parsed = parseUnit(product?.unit);

  // Generate weight/quantity variants based on category and default unit
  const getWeightOptions = () => {
    const { unit } = parsed;
    
    if (unit.includes('kg')) {
      return ['1 kg', '5 kg', '10 kg', '30 kg'];
    } else if (unit.includes('g') || unit.includes('gm')) {
      return ['100 g', '250 g', '500 g', '1 kg'];
    } else if (unit.includes('l') || unit.includes('litre') || unit.includes('liter')) {
      return ['500 ml', '1 L', '2 L', '5 L'];
    } else if (unit.includes('ml')) {
      return ['100 ml', '200 ml', '500 ml', '1 L'];
    } else {
      return ['1 pc', '3 pcs', '6 pcs', '12 pcs'];
    }
  };

  const weightOptions = Array.isArray(product.customWeights) && product.customWeights.length > 0 
    ? product.customWeights 
    : getWeightOptions();

  // Set default weight option matching product's unit
  useEffect(() => {
    // Try to find matching option
    const defaultOpt = weightOptions.find(opt => {
      const optP = parseUnit(opt);
      const prodP = parseUnit(product.unit);
      return optP.unit === prodP.unit && optP.val === prodP.val;
    }) || weightOptions[1] || weightOptions[0];
    
    setSelectedWeight(defaultOpt);
  }, [product]);

  // Calculate pricing based on selected weight option and pack size
  const calculatePricing = () => {
    if (!selectedWeight) return { price: product.price, mrp: product.mrp, discount: 0 };
    
    const baseUnit = parsed.unit;
    const baseVal = parsed.val;
    
    const optP = parseUnit(selectedWeight);
    const optVal = optP.val;
    const optUnit = optP.unit;
    
    // Convert to standard base value for ratio
    const toBase = (val: number, unitStr: string) => {
      if (unitStr === 'kg' || unitStr === 'l') return val * 1000;
      return val;
    };
    
    const baseTotal = toBase(baseVal, baseUnit);
    const optTotal = toBase(optVal, optUnit);
    
    const ratio = optTotal / baseTotal;
    
    let rawPrice = product.price * ratio;
    let rawMrp = product.mrp * ratio;
    
    // Bulk pricing factors for weights
    if (ratio > 1) {
      // Larger packs are slightly cheaper per unit
      rawPrice = rawPrice * (1 - Math.min(0.1, (ratio - 1) * 0.01));
    } else if (ratio < 1) {
      // Smaller packs are slightly more expensive per unit
      rawPrice = rawPrice * (1 + (1 - ratio) * 0.04);
    }
    
    // Calculate total for pack size
    let finalPrice = rawPrice * selectedPack;
    let finalMrp = rawMrp * selectedPack;
    
    // Bulk discount for pack count
    if (selectedPack === 3) {
      finalPrice = finalPrice * 0.95; // 5% off
    } else if (selectedPack === 6) {
      finalPrice = finalPrice * 0.90; // 10% off
    }
    
    finalPrice = Math.round(finalPrice);
    finalMrp = Math.round(finalMrp);
    
    const discount = Math.round(((finalMrp - finalPrice) / finalMrp) * 100);
    
    return {
      price: finalPrice,
      mrp: finalMrp,
      discount: discount > 0 ? discount : 0
    };
  };

  const pricing = calculatePricing();

  // Get color code matching product category
  const getCategoryColor = () => {
    const colors: Record<string, string> = {
      'rice-atta': 'f59e0b',
      'oils-ghee': 'f97316',
      'dal-pulses': 'ef4444',
      'spices': 'dc2626',
      'biscuits-snacks': '8b5cf6',
      'beverages': '3b82f6',
      'dairy': '06b6d4',
      'fruits-veggies': '22c55e',
      'personal-care': 'ec4899',
      'cleaning': '14b8a6',
      'baby-care': 'f43f5e',
      'frozen': '6366f1',
      'instant-food': 'f97316',
      'bread-bakery': 'eab308',
      'sweets': 'a855f7',
      'stationery': '2563eb',
    };
    return colors[product.category || ''] || '16a34a';
  };

  const catColor = getCategoryColor();

  // Helper to generate a unique variant ID for the cart
  const getVariantCartId = () => {
    const weightStr = (selectedWeight || '').replace(/\s+/g, '');
    return `${product.id}_${weightStr}_pack_${selectedPack}`;
  };

  // Check if this specific variant is in the cart
  const variantCartItem = cart.find(item => item.product.id === getVariantCartId());

  // Add variant to cart
  const handleAddToCart = () => {
    if (!product.inStock) return;
    
    // Create a dynamic variant product object
    const variantProduct: Product = {
      ...product,
      id: getVariantCartId(),
      name: `${product.name} (${selectedWeight})`,
      unit: `Pack of ${selectedPack}`,
      price: pricing.price,
      mrp: pricing.mrp,
      image: product.image,
      description: `Variant of ${product.name}. Selected weight: ${selectedWeight}. Pack size: ${selectedPack}.`
    };
    
    addToCart(variantProduct);
    toast.success(`🛒 Added ${variantProduct.name} (Pack of ${selectedPack}) to Cart!`);
  };

  const handleBuyNow = () => {
    if (!product.inStock) return;
    
    // Add to cart if not present
    if (!variantCartItem) {
      const variantProduct: Product = {
        ...product,
        id: getVariantCartId(),
        name: `${product.name} (${selectedWeight})`,
        unit: `Pack of ${selectedPack}`,
        price: pricing.price,
        mrp: pricing.mrp,
        image: product.image,
        description: `Variant of ${product.name}. Selected weight: ${selectedWeight}. Pack size: ${selectedPack}.`
      };
      addToCart(variantProduct);
    }
    
    onClose();
    setCurrentPage('checkout');
  };

  const handleUpdateQuantity = (newQty: number) => {
    updateQuantity(getVariantCartId(), newQty);
  };

  // Generate realistic expiry date based on product ID
  const getExpiryDate = () => {
    // Generate constant expiry date based on the length of product id
    const offsetDays = (product.id.length * 7) % 180 + 90; // Between 90 to 270 days from now
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + offsetDays);
    return expiry.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 ${
          darkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-800'
        } max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 z-50 p-2.5 rounded-full border shadow-md transition-all duration-200 cursor-pointer ${
            darkMode 
              ? 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800' 
              : 'bg-white border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
          title="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Responsive Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Left Column: Single Product Image (Grid-cols 5) */}
          <div className={`md:col-span-5 p-6 flex flex-col gap-4 border-r ${darkMode ? 'border-gray-900 bg-gray-900/10' : 'border-gray-100 bg-gray-50/20'}`}>
            {/* Main Image View */}
            <div className={`relative aspect-square rounded-2xl overflow-hidden border flex items-center justify-center p-6 ${
              darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-150'
            }`}>
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain transition-all duration-300 transform hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const initials = product.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
                  target.src = `https://placehold.co/600x600/${catColor}/ffffff?text=${encodeURIComponent(initials)}`;
                }}
              />
              
              {/* Badges Stack */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
                {product.badge && (
                  <span className="bg-orange-500 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    {product.badge}
                  </span>
                )}
                {pricing.discount >= 5 && (
                  <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    {pricing.discount}% OFF
                  </span>
                )}
              </div>

              {/* Wishlist Floating Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 right-3 z-20 p-2 rounded-full shadow-md backdrop-blur-sm cursor-pointer transition-all duration-200 active:scale-95 ${
                  isWishlisted
                    ? 'bg-red-500 text-white'
                    : darkMode
                    ? 'bg-gray-900/90 border border-gray-700 text-gray-400 hover:text-red-400'
                    : 'bg-white/95 border border-gray-200 text-gray-450 hover:text-red-600'
                }`}
              >
                <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Quality Seals */}
            <div className={`mt-2 p-3 rounded-2xl border text-center flex justify-around items-center text-[10px] font-bold ${
              darkMode ? 'bg-gray-900/40 border-gray-800/80 text-gray-400' : 'bg-gray-50 border-gray-150 text-gray-500'
            }`}>
              <span className="flex items-center gap-1"><Shield size={12} className="text-green-600" /> 100% Genuine</span>
              <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-600" /> Quality Check</span>
            </div>
          </div>

          {/* Right Column: Specifications & Selectors (Grid-cols 7) */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col gap-5">
            {/* Title & Brand */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase text-green-600 tracking-wider">
                  {(product.category || '').replace('-', ' ')}
                </span>
                <span className="text-[10px] opacity-20">|</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  {product.subcategory || ''}
                </span>
              </div>
              <h1 className={`text-xl md:text-2xl font-black tracking-tight leading-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {product.name}
              </h1>

              {/* Ratings and Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-green-600 text-white font-extrabold text-xs px-2 py-0.5 rounded-lg">
                  <span>{product.rating ?? 4.0}</span>
                  <Star size={10} className="fill-white text-white" />
                </div>
                <span className={`text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {(product.reviews ?? 100).toLocaleString()} Ratings & Reviews
                </span>
              </div>
            </div>

            {/* Divider */}
            <hr className={darkMode ? 'border-gray-900' : 'border-gray-100'} />

            {/* Price Details */}
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-green-600">₹{pricing.price}</span>
                {pricing.mrp > pricing.price && (
                  <>
                    <span className={`text-sm line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      ₹{pricing.mrp}
                    </span>
                    <span className="text-xs font-black bg-red-50 text-red-500 dark:bg-red-950/20 dark:text-red-400 px-2 py-0.5 rounded-lg uppercase tracking-wide">
                      {pricing.discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-semibold">Inclusive of all taxes</p>
            </div>

            {/* WOW Deal Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-green-600/10 via-emerald-600/10 to-teal-600/10 border border-green-600/20 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="bg-green-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded">WOW DEAL</span>
                <p className={`text-xs font-black ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
                  Buy at ₹{pricing.price}
                </p>
              </div>
              <p className={`text-[10px] font-bold ${darkMode ? 'text-gray-400' : 'text-gray-650'}`}>
                Apply shop coupons at checkout for additional savings!
              </p>
            </div>

            {/* Selector: Quantity / Weight */}
            <div className="flex flex-col gap-2.5">
              <span className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Selected Quantity: <b className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedWeight}</b>
              </span>
              <div className="flex flex-wrap gap-2">
                {weightOptions.map((opt) => {
                  const isSelected = selectedWeight === opt;
                  
                  // Calculate raw unit price for small subtext
                  const optPricing = parseUnit(opt);
                  const pricePerUnit = Math.round(product.price * (optPricing.val / parsed.val));
                  
                  return (
                    <button
                      key={opt}
                      onClick={() => setSelectedWeight(opt)}
                      className={`flex flex-col items-center justify-center min-w-18 py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-green-600 bg-green-600/5 text-green-700 dark:text-green-400 font-extrabold ring-1 ring-green-600 scale-[1.02]'
                          : darkMode
                          ? 'border-gray-800 hover:border-gray-700 text-gray-300 bg-gray-900/30'
                          : 'border-gray-200 hover:border-gray-350 text-gray-700 bg-white shadow-sm'
                      }`}
                    >
                      <span className="text-xs font-black">{opt}</span>
                      <span className="text-[8px] opacity-60 font-semibold mt-0.5">~₹{pricePerUnit}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selector: Pack Size */}
            <div className="flex flex-col gap-2.5">
              <span className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Selected Pack of: <b className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedPack}</b>
              </span>
              <div className="flex gap-2.5">
                {[1, 3, 6].map((pVal) => {
                  const isSelected = selectedPack === pVal;
                  return (
                    <button
                      key={pVal}
                      onClick={() => setSelectedPack(pVal)}
                      className={`flex-1 py-2 rounded-xl border text-center font-black transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-green-600 bg-green-600/5 text-green-700 dark:text-green-400 ring-1 ring-green-600 scale-[1.01]'
                          : darkMode
                          ? 'border-gray-800 hover:border-gray-700 text-gray-300 bg-gray-900/30'
                          : 'border-gray-200 hover:border-gray-350 text-gray-700 bg-white shadow-sm'
                      }`}
                    >
                      <span className="text-xs">{pVal}</span>
                      {pVal > 1 && (
                        <span className="text-[8px] text-red-500 font-black uppercase mt-0.5">
                          {pVal === 3 ? 'Save 5%' : 'Save 10%'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Expiry Details */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <p className={`text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Expiry Date: <b className={darkMode ? 'text-white' : 'text-gray-900'}>{getExpiryDate()}</b>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              {/* Cart Counter or Add to Cart Button */}
              <div className="flex-1">
                {!product.inStock ? (
                  <button
                    onClick={() => setShowNotifyModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all cursor-pointer shadow-md bg-orange-500 hover:bg-orange-600 text-white hover:shadow-lg border-none outline-none"
                  >
                    <Bell size={16} />
                    NOTIFY ME WHEN AVAILABLE
                  </button>
                ) : variantCartItem ? (
                  <div className="flex items-center justify-between bg-green-600 text-white rounded-xl overflow-hidden font-black text-sm border border-green-600 shadow-md py-1">
                    <button
                      onClick={() => handleUpdateQuantity(variantCartItem.quantity - 1)}
                      className="px-6 py-2 hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 text-base">{variantCartItem.quantity} in Cart</span>
                    <button
                      onClick={() => handleUpdateQuantity(variantCartItem.quantity + 1)}
                      className="px-6 py-2 hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all cursor-pointer shadow-md bg-green-600 hover:bg-green-500 text-white hover:shadow-lg border-none outline-none"
                  >
                    <ShoppingCart size={16} />
                    ADD TO CART
                  </button>
                )}
              </div>

              {/* Buy Now Button */}
              {product.inStock && (
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 rounded-xl font-black text-sm bg-amber-500 hover:bg-amber-400 text-white transition-all cursor-pointer shadow-md hover:shadow-lg text-center"
                >
                  BUY NOW
                </button>
              )}
            </div>

            {/* Delivery Details */}
            <div className={`p-4 rounded-2xl border flex flex-col gap-2 ${
              darkMode ? 'bg-gray-900/30 border-gray-800/80' : 'bg-gray-50 border-gray-150'
            }`}>
              <p className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Delivery Details
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🛵</span>
                <p className="text-xs font-bold">
                  Delivery to <b className="text-green-600">Bhopal (All localities)</b>
                </p>
              </div>
              <p className={`text-[10px] font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Free Delivery above ₹{storeSettings.freeDeliveryAbove}. Delivery in 30-45 minutes.
              </p>
            </div>

            {/* Product Description */}
            <div className="flex flex-col gap-2">
              <span className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Product Description
              </span>
              <p className={`text-xs leading-relaxed font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {product.description || `${product.name} is a premium quality product sourced from verified farms and processed with utmost hygiene. Ideal for daily home consumption.`}
              </p>
            </div>
            
          </div>
        </div>
      </div>
      {showNotifyModal && (
        <NotifyMeModal
          product={product}
          onClose={() => setShowNotifyModal(false)}
        />
      )}
    </div>
  );
}
