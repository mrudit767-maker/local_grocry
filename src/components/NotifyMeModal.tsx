import React, { useState, useEffect } from 'react';
import { X, Bell, User, Phone, Mail } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Product } from '../data/products';

interface Props {
  product: Product;
  onClose: () => void;
}

export default function NotifyMeModal({ product, onClose }: Props) {
  const { currentCustomer, addStockRequest, darkMode } = useStore();
  
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentCustomer) {
      setName(currentCustomer.name);
      setContact(currentCustomer.phone || currentCustomer.email || '');
    }
  }, [currentCustomer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!contact.trim()) {
      setError('Please enter your phone number or email');
      return;
    }

    addStockRequest({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      customerName: name.trim(),
      customerContact: contact.trim()
    });

    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
    >
      <div 
        className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 ${
          darkMode ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-gray-150 text-gray-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b dark:border-gray-900">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/30 text-orange-600">
              <Bell size={18} className="animate-bounce" />
            </div>
            <div>
              <h2 className="text-base font-black">Notify Me When Available</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{product.subcategory}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              darkMode 
                ? 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white' 
                : 'bg-white border-gray-200 text-gray-500 hover:text-black'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Product Brief */}
        <div className={`p-4 flex gap-3 items-center border-b dark:border-gray-900 ${
          darkMode ? 'bg-gray-900/20' : 'bg-gray-50/50'
        }`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-12 h-12 rounded-xl object-contain bg-white p-1 border dark:border-gray-800"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold truncate">{product.name}</h3>
            <p className="text-xs text-gray-400">{product.unit} • ₹{product.price}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <p className="text-xs text-red-500 font-bold bg-red-50 dark:bg-red-950/20 p-2.5 rounded-xl border border-red-200 dark:border-red-900/30">
              ⚠️ {error}
            </p>
          )}

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Your Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <User size={15} />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="Enter your full name"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                  darkMode 
                    ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-550' 
                    : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Mobile Number or Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Phone size={14} className="mr-0.5" />
                <span className="text-gray-300 mx-1">|</span>
                <Mail size={14} />
              </span>
              <input
                type="text"
                value={contact}
                onChange={(e) => { setContact(e.target.value); setError(''); }}
                placeholder="e.g. +91 9988776655 or email@domain.com"
                className={`w-full pl-16 pr-4 py-2.5 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                  darkMode 
                    ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-550' 
                    : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                }`}
              />
            </div>
            <p className="text-[10px] text-gray-400 font-bold mt-1">We'll alert you the moment this item is restocked.</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none outline-none"
          >
            <Bell size={15} />
            SUBMIT REQUEST
          </button>
        </form>
      </div>
    </div>
  );
}
