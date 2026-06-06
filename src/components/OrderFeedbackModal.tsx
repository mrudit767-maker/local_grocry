import { useState } from 'react';
import { X, Star, Sparkles } from 'lucide-react';
import { useStore, Order } from '../store/useStore';
import toast from 'react-hot-toast';

interface Props {
  order: Order;
  onClose: () => void;
}

export default function OrderFeedbackModal({ order, onClose }: Props) {
  const { darkMode, submitOrderFeedback } = useStore();
  const [storeRating, setStoreRating] = useState<number>(0);
  const [storeRatingHover, setStoreRatingHover] = useState<number>(0);
  
  // Track individual product ratings: { productId: rating }
  const [itemsRating, setItemsRating] = useState<Record<string, number>>({});
  const [itemsRatingHover, setItemsRatingHover] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleProductStarClick = (productId: string, rating: number) => {
    setItemsRating(prev => ({ ...prev, [productId]: rating }));
  };

  const handleProductStarHover = (productId: string, rating: number) => {
    setItemsRatingHover(prev => ({ ...prev, [productId]: rating }));
  };

  const handleSubmit = () => {
    if (storeRating === 0) {
      toast.error('Please select an overall rating! ⭐');
      return;
    }

    setSubmitting(true);
    
    // Simulate slight API delay for nice UX
    setTimeout(() => {
      submitOrderFeedback(order.id, {
        rating: storeRating,
        comment: comment.trim(),
        itemsRating: Object.keys(itemsRating).length > 0 ? itemsRating : undefined,
        createdAt: new Date().toISOString()
      });
      setSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className={`relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 ${
          darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-150 text-gray-800'
        } max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between px-6 py-4 border-b ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
        } z-10`}>
          <div>
            <h3 className={`font-black text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              📝 Order Feedback
            </h3>
            <p className="text-[10px] font-bold text-gray-400 mt-0.5">Order ID: {order.id}</p>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          
          {/* Section 1: Overall Store Experience */}
          <div className="text-center space-y-2.5">
            <h4 className={`text-sm font-black ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              How was your delivery & overall experience?
            </h4>
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const currentRating = storeRatingHover || storeRating;
                const isActive = star <= currentRating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStoreRating(star)}
                    onMouseEnter={() => setStoreRatingHover(star)}
                    onMouseLeave={() => setStoreRatingHover(0)}
                    className="p-1 transition-all duration-200 hover:scale-110 cursor-pointer"
                  >
                    <Star 
                      size={28} 
                      className={`transition-colors duration-200 ${
                        isActive 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : darkMode ? 'text-gray-700' : 'text-gray-300'
                      }`} 
                    />
                  </button>
                );
              })}
            </div>
            {storeRating > 0 && (
              <p className="text-xs text-green-600 font-extrabold animate-pulse">
                {storeRating === 5 ? 'Excellent! 😍' : 
                 storeRating === 4 ? 'Good! 😊' : 
                 storeRating === 3 ? 'Average. 🙂' : 
                 storeRating === 2 ? 'Poor. 🙁' : 'Very Bad. 😢'}
              </p>
            )}
          </div>

          <hr className={darkMode ? 'border-gray-800' : 'border-gray-100'} />

          {/* Section 2: Rate Ordered Products */}
          <div className="space-y-3">
            <h4 className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Rate the items you received
            </h4>
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 custom-scroll">
              {order.items.map((item) => {
                const pId = item.product.id;
                const pRating = itemsRating[pId] || 0;
                const pHover = itemsRatingHover[pId] || 0;
                const currentProductRating = pHover || pRating;
                
                return (
                  <div 
                    key={pId} 
                    className={`flex items-center justify-between gap-3 p-2.5 rounded-2xl border ${
                      darkMode ? 'bg-gray-800/40 border-gray-800/80' : 'bg-gray-50 border-gray-150'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-8 h-8 rounded-lg object-cover bg-white shrink-0 border"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/32x32/16a34a/ffffff?text=${item.product.name[0]}`; }}
                      />
                      <p className={`text-xs font-bold truncate ${darkMode ? 'text-gray-250' : 'text-gray-700'}`}>
                        {item.product.name}
                      </p>
                    </div>
                    
                    {/* Stars */}
                    <div className="flex gap-1 shrink-0">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isActive = star <= currentProductRating;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleProductStarClick(pId, star)}
                            onMouseEnter={() => handleProductStarHover(pId, star)}
                            onMouseLeave={() => handleProductStarHover(pId, 0)}
                            className="p-0.5 hover:scale-105 transition-all cursor-pointer"
                          >
                            <Star 
                              size={15} 
                              className={`transition-colors duration-150 ${
                                isActive 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : darkMode ? 'text-gray-700' : 'text-gray-300'
                              }`} 
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className={darkMode ? 'border-gray-800' : 'border-gray-100'} />

          {/* Section 3: Feedback Comment */}
          <div className="space-y-2">
            <label className={`block text-xs font-black uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Write a comment
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you liked or how we can improve..."
              className={`w-full px-4.5 py-3 rounded-2xl border text-xs outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-250 text-gray-800 placeholder-gray-400'
              }`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                submitting
                  ? 'bg-gray-300 text-gray-500 dark:bg-gray-800 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-500 text-white hover:shadow-lg'
              }`}
            >
              {submitting ? 'Submitting... ⏳' : (
                <>
                  <Sparkles size={14} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                  Submit Feedback
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={submitting}
              className={`px-6 py-3 rounded-2xl text-sm font-semibold border transition-all ${
                darkMode 
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                  : 'border-gray-300 text-gray-650 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
