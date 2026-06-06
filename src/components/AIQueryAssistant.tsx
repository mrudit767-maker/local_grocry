import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, X, Plus, Check, AlertCircle, ChefHat, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Product } from '../data/products';
import { RECIPE_DB, getDynamicIngredients } from '../data/recipes';
import toast from 'react-hot-toast';
import NotifyMeModal from './NotifyMeModal';

interface RecipeInfo {
  recipeName: string;
  requiredIngredients: string[];
  availableProducts: Product[];
  outOfStockProducts?: Product[];
  missingIngredients: string[];
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  recommendedProducts?: Product[];
  recipeInfo?: RecipeInfo;
  options?: { label: string; actionKey: 'products' | 'recipe'; query: string }[];
}

// ─────────────────────────────────────────────────────────────
// KEYWORD → PRODUCT MATCHING MAP
// Maps generic ingredient names to keywords found in store products
// ─────────────────────────────────────────────────────────────
const INGREDIENT_KEYWORDS: Record<string, string[]> = {
  // Dairy
  'paneer': ['paneer'],
  'butter': ['butter', 'amul butter'],
  'cream': ['cream'],
  'milk': ['milk', 'amul full', 'mother dairy full', 'toned milk'],
  'curd': ['dahi', 'curd'],
  'cheese': ['cheese'],
  'ghee': ['ghee'],
  'eggs': ['eggs', 'egg'],
  'khoya': ['khoya', 'milk powder'],
  'milk powder': ['milk powder', 'khoya'],

  // Vegetables
  'tomato': ['tomato', 'tamatar'],
  'onion': ['onion'],
  'potato': ['potato', 'aloo'],
  'garlic': ['garlic'],
  'ginger': ['ginger'],
  'green peas': ['green peas', 'peas'],
  'spinach': ['spinach', 'palak'],
  'capsicum': ['capsicum'],
  'carrot': ['carrot'],
  'cauliflower': ['cauliflower', 'gobi'],
  'green chili': ['chilli', 'chili', 'green chilli'],
  'coriander': ['coriander'],
  'lemon': ['lemon'],
  'mint': ['mint'],

  // Grains & Flour
  'rice': ['basmati rice', 'rice', 'india gate', 'daawat', 'sona masoori'],
  'basmati rice': ['basmati rice', 'india gate', 'daawat', 'kohinoor'],
  'wheat flour': ['atta', 'flour', 'aashirvaad', 'pillsbury'],
  'atta': ['atta', 'aashirvaad', 'pillsbury', 'patanjali diya'],
  'maida': ['maida', 'all purpose flour'],
  'semolina': ['suji', 'semolina', 'rava'],
  'suji': ['suji', 'semolina'],
  'besan': ['besan', 'gram flour'],
  'poha': ['poha', 'flattened rice'],
  'corn flour': ['corn flour'],
  'ragi flour': ['ragi flour'],

  // Dal & Pulses
  'toor dal': ['toor dal', 'arhar'],
  'moong dal': ['moong dal'],
  'masoor dal': ['masoor dal', 'red lentil'],
  'chana dal': ['chana dal'],
  'urad dal': ['urad dal'],
  'rajma': ['rajma', 'kidney beans'],
  'chickpeas': ['chole', 'chickpeas', 'kabuli chana'],
  'kabuli chana': ['kabuli chana', 'chole', 'chickpeas'],
  'black lentils': ['sabut urad', 'urad dal'],
  'green moong': ['green moong', 'moong'],

  // Oils
  'oil': ['sunflower oil', 'mustard oil', 'fortune', 'saffola', 'soyabean oil'],
  'ghee / oil': ['ghee', 'sunflower oil'],
  'ghee / butter': ['ghee', 'butter'],
  'mustard oil': ['mustard oil'],
  'sunflower oil': ['sunflower oil', 'fortune sunflower'],
  'coconut oil': ['coconut oil', 'parachute'],
  'olive oil': ['olive oil'],

  // Spices
  'garam masala': ['garam masala', 'mdh garam', 'everest garam'],
  'cumin seeds': ['cumin seeds', 'jeera'],
  'cumin': ['cumin seeds', 'jeera'],
  'mustard seeds': ['mustard seeds', 'rai'],
  'turmeric': ['turmeric', 'haldi'],
  'turmeric powder': ['turmeric powder', 'haldi'],
  'red chili': ['red chilli powder', 'red chili', 'chilli powder'],
  'chili powder': ['red chilli powder'],
  'red chili powder': ['red chilli powder'],
  'coriander powder': ['coriander powder', 'dhaniya'],
  'cardamom': ['cardamom', 'elaichi'],
  'cloves': ['cloves', 'laung'],
  'black pepper': ['black pepper'],
  'cinnamon': ['cinnamon', 'dalchini'],
  'bay leaves': ['bay leaves', 'tejpatta'],
  'fenugreek seeds': ['fenugreek seeds', 'methi'],
  'asafoetida': ['asafoetida', 'hing'],
  'carom seeds': ['carom seeds', 'ajwain'],
  'saffron': ['saffron', 'kesar'],
  'kasuri methi': ['fenugreek', 'methi', 'kasuri'],
  'fennel seeds': ['carom', 'fennel', 'jeera'],
  'biryani masala': ['garam masala', 'biryani', 'mdh'],
  'sambhar masala': ['sambhar masala', 'everest sambhar'],
  'chole masala': ['chole masala', 'chhole masala'],
  'rajma masala': ['rajma masala'],
  'pav bhaji masala': ['garam masala', 'pav bhaji', 'masala'],
  'chaat masala': ['chaat masala'],
  'kitchen king': ['kitchen king'],
  'star anise': ['star anise'],
  'nutmeg': ['nutmeg', 'jaiphal'],
  'salt': ['salt', 'tata salt'],
  'black salt': ['chaat masala', 'salt'],

  // Beverages
  'tea leaves': ['tea', 'tata tea', 'red label', 'wagh bakri', 'brooke bond'],
  'coffee powder': ['coffee', 'nescafe', 'bru', 'continental'],
  'sugar': ['sugar', 'chini'],
  'honey': ['honey', 'dabur honey'],
  'jaggery': ['jaggery', 'gud'],

  // Nuts & Dry Fruits
  'almonds': ['almonds', 'badam'],
  'cashew': ['cashew', 'roasted cashews'],
  'raisins': ['raisins', 'kishmish'],
  'walnuts': ['walnuts', 'akhrot'],
  'peanuts': ['peanuts'],
  'pistachios': ['almonds'],
  'dry fruits': ['almonds', 'raisins', 'walnuts', 'mixed nuts'],

  // Instant food
  'maggi noodles': ['maggi', 'noodles'],
  'noodles': ['maggi', 'yippee', 'noodles'],
  'pasta': ['pasta', 'macaroni'],
  'macaroni': ['macaroni'],
  'tomato sauce': ['tomato ketchup', 'kissan', 'sauce'],
  'ketchup': ['ketchup', 'kissan'],
  'baking powder': ['baking', 'maida'],
  'vanilla': ['vanilla'],
  'soy sauce': ['sauce'],
  'vinegar': ['sauce'],

  // Fruits
  'mango': ['mango', 'fresh mango'],
  'banana': ['banana', 'fresh banana'],
  'lemon juice': ['lemon'],

  // Snacks
  'sev': ['haldirams', 'bhujia', 'namkeen'],
  'chips': ['lays', 'kurkure', 'chips'],
  'bread': ['bread', 'britannia brown', 'harvest gold'],
  'pav': ['bread', 'harvest gold', 'britannia'],
};

// Smart product finder using keyword map + fallback substring matching
const findProductForIngredient = (ing: string, products: Product[], checkStockFirst: boolean = true): Product | null => {
  const ingLower = ing.toLowerCase().trim();

  // Helper search function to find matching products
  const search = (onlyInStock: boolean) => {
    // 1. Try keyword map first
    for (const [keyword, searchTerms] of Object.entries(INGREDIENT_KEYWORDS)) {
      if (ingLower.includes(keyword) || keyword.includes(ingLower)) {
        for (const term of searchTerms) {
          const match = products.find(p =>
            (!onlyInStock || p.inStock) && (
              p.name.toLowerCase().includes(term) ||
              p.subcategory.toLowerCase().includes(term)
            )
          );
          if (match) return match;
        }
      }
    }

    // 2. Try all words in ingredient name individually
    const words = ingLower.split(/[\s/,]+/).filter(w => w.length > 2);
    for (const word of words) {
      const match = products.find(p =>
        (!onlyInStock || p.inStock) && (
          p.name.toLowerCase().includes(word) ||
          p.subcategory.toLowerCase().includes(word) ||
          p.category.toLowerCase().includes(word)
        )
      );
      if (match) return match;
    }
    return null;
  };

  if (checkStockFirst) {
    const inStockMatch = search(true);
    if (inStockMatch) return inStockMatch;
  }
  return search(false);
};

const findRecipe = (query: string) => {
  const q = query.toLowerCase().trim();

  // 1. Exact match
  if (RECIPE_DB[q]) return RECIPE_DB[q];

  // 2. Prefix/contains match on keys
  const keyMatch = Object.keys(RECIPE_DB).find(key => q.includes(key) || key.includes(q));
  if (keyMatch) return RECIPE_DB[keyMatch];

  // 3. Word-level partial match (e.g. "make biryani at home" → finds "biryani")
  const words = q.split(/\s+/).filter(w => w.length > 2);
  for (const word of words) {
    const partialKey = Object.keys(RECIPE_DB).find(key => key.includes(word) || word.includes(key));
    if (partialKey) return RECIPE_DB[partialKey];
  }

  return null;
};

// Get recipe suggestions for autocomplete
const getRecipeSuggestions = (query: string): string[] => {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return Object.keys(RECIPE_DB)
    .filter(key => key.includes(q) || RECIPE_DB[key].name.toLowerCase().includes(q))
    .slice(0, 8)
    .map(key => RECIPE_DB[key].name.replace(/\s*[^\w\s]\s*$/, '').trim());
};

export default function AIQueryAssistant({ onClose }: { onClose?: () => void }) {
  const { products, addToCart, darkMode } = useStore();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notifyProduct, setNotifyProduct] = useState<Product | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `🧑‍🍳 Namaste! Main hoon aapka Kirana AI Assistant!\n\nMere paas ${Object.keys(RECIPE_DB).length}+ Indian recipes ki jankari hai. Aap koi bhi dish ka naam type karein jaise:\n• Paneer Butter Masala\n• Biryani\n• Gajar Halwa\n• Chole Bhature\n• Maggi\n\nMain aapko us dish ke saare ingredients ki list dunga aur bataunga ki hamare store mein kya available hai! 🛒`
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestions = useMemo(() => getRecipeSuggestions(query), [query]);

  const processRecipe = (optQuery: string): { responseText: string; recipeInfo: RecipeInfo } => {
    const matchedRecipe = findRecipe(optQuery);

    if (matchedRecipe) {
      const required = matchedRecipe.ingredients;
      const available: Product[] = [];
      const outOfStock: Product[] = [];
      const missing: string[] = [];

      required.forEach(ing => {
        const matchedProduct = findProductForIngredient(ing, products, true);
        if (matchedProduct) {
          if (matchedProduct.inStock) {
            if (!available.some(p => p.id === matchedProduct.id)) available.push(matchedProduct);
          } else {
            if (!outOfStock.some(p => p.id === matchedProduct.id)) outOfStock.push(matchedProduct);
          }
        } else {
          missing.push(ing);
        }
      });

      return {
        responseText: matchedRecipe.message,
        recipeInfo: {
          recipeName: matchedRecipe.name,
          requiredIngredients: required,
          availableProducts: available,
          outOfStockProducts: outOfStock,
          missingIngredients: missing
        }
      };
    } else {
      // Fallback: dynamic rule-based
      const dynamicRequired = getDynamicIngredients(optQuery);
      const available: Product[] = [];
      const outOfStock: Product[] = [];
      const missing: string[] = [];

      dynamicRequired.forEach(ing => {
        const matchedProduct = findProductForIngredient(ing, products, true);
        if (matchedProduct) {
          if (matchedProduct.inStock) {
            if (!available.some(p => p.id === matchedProduct.id)) available.push(matchedProduct);
          } else {
            if (!outOfStock.some(p => p.id === matchedProduct.id)) outOfStock.push(matchedProduct);
          }
        } else {
          missing.push(ing);
        }
      });
      const capitalizedName = optQuery.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return {
        responseText: `**${capitalizedName}** ke liye ingredients aur store availability:`,
        recipeInfo: {
          recipeName: capitalizedName + ' 🍲',
          requiredIngredients: dynamicRequired,
          availableProducts: available,
          outOfStockProducts: outOfStock,
          missingIngredients: missing
        }
      };
    }
  };

  const handleSend = (inputQuery?: string) => {
    const userMsg = (inputQuery || query).trim();
    if (!userMsg) return;
    setQuery('');
    setShowSuggestions(false);
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);

    setTimeout(() => {
      const normalized = userMsg.toLowerCase().trim();
      const greetings = ['hi', 'hello', 'hey', 'namaste', 'help', 'hola', 'sup', 'kya haal', 'jai shri krishna', 'ram ram'];

      if (greetings.some(g => normalized.includes(g))) {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: `Namaste! 🙏 Main aapka Kirana AI hoon. Koi bhi dish ka naam type karein aur main:\n✅ Us dish ke complete ingredients bataunga\n✅ Hamare store mein available items dikhaunga\n✅ Cart mein add karne ka option dunga\n\nTotal ${Object.keys(RECIPE_DB).length}+ recipes available hain! 🍛`
        }]);
      } else {
        // Check if it directly matches a recipe first
        const directMatch = findRecipe(normalized);

        if (directMatch) {
          // Directly show recipe without asking
          const { responseText, recipeInfo } = processRecipe(normalized);
          setMessages(prev => [...prev, { sender: 'ai', text: responseText, recipeInfo }]);
        } else {
          // Ask user what they want
          setMessages(prev => [...prev, {
            sender: 'ai',
            text: `"${userMsg}" ke liye kya chahiye aapko?`,
            options: [
              { label: '🍲 Recipe Ingredients Dekho', actionKey: 'recipe', query: userMsg },
              { label: '🔍 Products Dhundo', actionKey: 'products', query: userMsg }
            ]
          }]);
        }
      }
    }, 400);
  };

  const handleOptionClick = (actionKey: 'products' | 'recipe', optQuery: string, msgIndex: number) => {
    setMessages(prev => prev.map((m, idx) => idx === msgIndex ? { ...m, options: undefined } : m));
    const choiceText = actionKey === 'products' ? `🔍 Products: "${optQuery}"` : `🍲 Recipe: "${optQuery}"`;
    setMessages(prev => [...prev, { sender: 'user', text: choiceText }]);

    setTimeout(() => {
      if (actionKey === 'products') {
        const words = optQuery.toLowerCase().split(/\s+/).filter(w => w.length > 1);
        const recommended = products.filter(p =>
          words.some(word =>
            p.name.toLowerCase().includes(word) ||
            p.category.toLowerCase().includes(word) ||
            p.subcategory.toLowerCase().includes(word)
          ) && p.inStock
        ).slice(0, 8);

        setMessages(prev => [...prev, {
          sender: 'ai',
          text: recommended.length > 0
            ? `"${optQuery}" ke liye ${recommended.length} products mile hamare store mein:`
            : `Sorry! "${optQuery}" ke liye koi product nahi mila. Kuch aur try karein!`,
          recommendedProducts: recommended.length > 0 ? recommended : undefined
        }]);
      } else {
        const { responseText, recipeInfo } = processRecipe(optQuery);
        setMessages(prev => [...prev, { sender: 'ai', text: responseText, recipeInfo }]);
      }
    }, 500);
  };

  const handleAddAll = (items: Product[]) => {
    items.forEach(item => addToCart(item));
    toast.success(`${items.length} ingredients cart mein add ho gaye! 🛒`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Find the key for this suggestion
    const key = Object.keys(RECIPE_DB).find(k =>
      RECIPE_DB[k].name.toLowerCase().replace(/[^\w\s]/g, '').trim() ===
      suggestion.toLowerCase().replace(/[^\w\s]/g, '').trim()
    );
    const queryToUse = key || suggestion;
    setQuery('');
    setShowSuggestions(false);
    handleSend(queryToUse);
  };

  return (
    <div className={`flex flex-col h-[520px] w-full max-w-lg rounded-3xl border shadow-premium overflow-hidden ${
      darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-250 text-gray-800'
    }`}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <ChefHat size={16} className="text-yellow-300" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm leading-none">Kirana AI Chef 🧑‍🍳</h3>
            <span className="text-[10px] opacity-80 font-medium">{Object.keys(RECIPE_DB).length}+ recipes • Ingredients matcher</span>
          </div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white border-none bg-transparent cursor-pointer">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scroll">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            {/* Sender icon for AI */}
            {msg.sender === 'ai' && (
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <ChefHat size={10} className="text-white" />
                </div>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">Kirana AI</span>
              </div>
            )}

            <div className={`max-w-[87%] rounded-2xl p-3.5 text-xs font-semibold leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-[#FF6B35] text-white rounded-tr-none'
                : darkMode
                ? 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'
                : 'bg-gray-100 text-gray-700 rounded-tl-none'
            } whitespace-pre-line`}>
              {msg.text}
            </div>

            {/* Option Buttons */}
            {msg.options && msg.options.length > 0 && (
              <div className="flex gap-2 mt-2 w-full max-w-[87%]">
                {msg.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleOptionClick(opt.actionKey, opt.query, index)}
                    className="flex-1 py-2.5 px-3 rounded-xl font-extrabold text-[11px] transition-all bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-500 hover:to-teal-550 text-white cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99] border-none outline-none text-center"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Recipe Checklist */}
            {msg.recipeInfo && (
              <div className="w-full mt-3 rounded-2xl bg-emerald-500/5 dark:bg-gray-800/40 border border-emerald-500/20 overflow-hidden">
                {/* Recipe Header */}
                <div className={`px-4 py-3 flex items-center justify-between border-b ${darkMode ? 'border-gray-800' : 'border-emerald-100'} bg-gradient-to-r from-emerald-50/70 to-teal-50/70 dark:from-emerald-950/20 dark:to-teal-950/20`}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                      <ChefHat size={13} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-800 dark:text-white">{msg.recipeInfo.recipeName}</h4>
                      <p className="text-[9px] text-gray-400">{msg.recipeInfo.requiredIngredients.length} ingredients • {msg.recipeInfo.availableProducts.length} available in store</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                      {Math.round((msg.recipeInfo.availableProducts.length / msg.recipeInfo.requiredIngredients.length) * 100)}% available
                    </span>
                  </div>
                </div>

                {/* Ingredients List */}
                <div className="p-3 space-y-2 max-h-56 overflow-y-auto custom-scroll">
                  <p className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider px-1">Ingredients Checklist</p>

                  {/* Available in store */}
                  {msg.recipeInfo.availableProducts.map(p => {
                    const matchedIng = msg.recipeInfo!.requiredIngredients.find(ing =>
                      p.name.toLowerCase().includes(ing.toLowerCase().split(' ')[0]) ||
                      p.subcategory.toLowerCase().includes(ing.toLowerCase().split(' ')[0]) ||
                      ing.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
                    ) || p.name;

                    return (
                      <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center gap-2 min-w-0">
                          <Check size={13} className="text-emerald-500 shrink-0" />
                          <img src={p.image} alt={p.name} className="w-7 h-7 rounded-lg object-cover shrink-0 border dark:border-gray-700" />
                          <div className="min-w-0">
                            <span className="font-bold text-[11px] text-gray-700 dark:text-gray-200 block truncate">{matchedIng}</span>
                            <span className="text-[9px] text-gray-400 block truncate">Store: {p.name} • {p.unit}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">₹{p.price}</span>
                          <button
                            type="button"
                            onClick={() => { addToCart(p); toast.success(`Added ${p.name}!`); }}
                            className="px-2 py-1 text-[9px] font-bold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-all cursor-pointer border-none outline-none"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Out of Stock in store */}
                  {msg.recipeInfo.outOfStockProducts?.map(p => {
                    const matchedIng = msg.recipeInfo!.requiredIngredients.find(ing =>
                      p.name.toLowerCase().includes(ing.toLowerCase().split(' ')[0]) ||
                      p.subcategory.toLowerCase().includes(ing.toLowerCase().split(' ')[0]) ||
                      ing.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
                    ) || p.name;

                    return (
                      <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/15 hover:border-orange-500/30 transition-all">
                        <div className="flex items-center gap-2 min-w-0">
                          <AlertCircle size={13} className="text-orange-500 shrink-0" />
                          <img src={p.image} alt={p.name} className="w-7 h-7 rounded-lg object-cover shrink-0 border dark:border-gray-700 opacity-60" />
                          <div className="min-w-0">
                            <span className="font-bold text-[11px] text-gray-600 dark:text-gray-300 block truncate">{matchedIng}</span>
                            <span className="text-[9px] text-orange-500/80 block font-semibold truncate">Store: {p.name} (Out of stock)</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setNotifyProduct(p)}
                            className="px-2 py-1 text-[9px] font-black rounded-lg bg-orange-500 hover:bg-orange-655 text-white transition-all cursor-pointer border-none outline-none shrink-0"
                          >
                            🔔 Notify Me
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Missing / Not in store */}
                  {msg.recipeInfo.missingIngredients.map(ing => {
                    const handleNotifyClick = () => {
                      const mockProduct: Product = {
                        id: 'custom-' + ing.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                        name: ing.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                        category: 'Recipe Ingredients',
                        subcategory: 'Requested Ingredient',
                        price: 0,
                        mrp: 0,
                        unit: '1 unit',
                        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop',
                        rating: 5,
                        reviews: 0,
                        inStock: false,
                        description: `Missing ingredient requested: ${ing}`
                      };
                      setNotifyProduct(mockProduct);
                    };

                    return (
                      <div key={ing} className="flex items-center justify-between p-2.5 rounded-xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <AlertCircle size={13} className="text-red-400 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-bold text-[11px] text-gray-550 dark:text-gray-450 block truncate">{ing}</span>
                            <span className="text-[9px] text-red-400/80 block font-semibold">Store mein available nahi</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleNotifyClick}
                          className="px-2 py-1 text-[9px] font-black rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all cursor-pointer border-none outline-none shrink-0"
                        >
                          🔔 Notify Me
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add All Button */}
                {msg.recipeInfo.availableProducts.length > 0 && (
                  <div className={`px-3 py-2.5 border-t flex items-center justify-between ${darkMode ? 'border-gray-800' : 'border-emerald-100'}`}>
                    <div className="text-[9px] text-gray-400 font-semibold">
                      <span className="font-black text-emerald-600 dark:text-emerald-400">{msg.recipeInfo.availableProducts.length}</span> items hamare store mein
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddAll(msg.recipeInfo!.availableProducts)}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-[10px] px-3 py-2 rounded-xl cursor-pointer shadow-sm border-none outline-none transition-all hover:scale-[1.02]"
                    >
                      🛒 Sab Cart Mein Add Karo
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Product Search Results */}
            {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
              <div className={`w-full mt-2.5 p-3 rounded-2xl border space-y-2 ${darkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/50 border-gray-200'}`}>
                <div className="flex items-center justify-between border-b dark:border-gray-800 pb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Search size={10} /> Results ({msg.recommendedProducts.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddAll(msg.recommendedProducts!)}
                    className="text-[10px] font-extrabold text-green-600 dark:text-green-400 hover:underline flex items-center gap-1 border-none bg-transparent cursor-pointer"
                  >
                    🛒 Sab Add Karo
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scroll pr-1">
                  {msg.recommendedProducts.map(p => (
                    <div key={p.id} className={`p-2 rounded-xl border flex items-center gap-2 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover border dark:border-gray-700" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold truncate leading-tight dark:text-white">{p.name}</p>
                        <p className="text-[10px] font-black text-green-600 mt-0.5">₹{p.price}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { addToCart(p); toast.success(`Added ${p.name}`); }}
                        className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 dark:bg-green-950/20 dark:text-green-400 cursor-pointer border-none transition-colors"
                        title="Add to Cart"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`border-t ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className={`px-3 pt-2 flex flex-wrap gap-1.5`}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSuggestionClick(s)}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-full border cursor-pointer transition-all hover:scale-[1.02] border-none outline-none ${
                  darkMode
                    ? 'bg-gray-800 text-emerald-400 hover:bg-gray-700'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                🍽️ {s}
              </button>
            ))}
          </div>
        )}

        <div className="p-3 flex gap-2 items-center">
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowSuggestions(e.target.value.length >= 2); }}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            onFocus={() => setShowSuggestions(query.length >= 2)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Recipe name type karein... Biryani, Halwa, Chole..."
            className={`flex-1 px-4 py-2.5 rounded-full border text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-semibold transition-all ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-550' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
            }`}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer shrink-0 transition-all active:scale-95 border-none outline-none hover:scale-105"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
      {notifyProduct && (
        <NotifyMeModal
          product={notifyProduct}
          onClose={() => setNotifyProduct(null)}
        />
      )}
    </div>
  );
}
