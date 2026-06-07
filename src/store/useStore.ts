import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, PRODUCTS, CATEGORIES } from '../data/products';
import { saveProductsToSheet, fetchProductsFromSheet, saveSettingsToSheet, fetchSettingsFromSheet } from '../utils/googleSheets';
import toast from 'react-hot-toast';

const DEFAULT_BANNERS: HomeBanner[] = [
  {
    id: 'banner_default_1',
    title: 'Festival Special Offers',
    subtitle: '🪔 Up to 50% Off on all Grocery Staples',
    cta: 'Shop Staples',
    bg: 'from-[#d00000] via-[#dc2f02] to-[#FF6B35]',
    emoji: '🪔',
    badge: 'Festival Special',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=compress&cs=tinysrgb&w=1000&h=450&fit=crop',
    linkCategory: 'rice-atta'
  },
  {
    id: 'banner_default_2',
    title: 'Direct From Farms',
    subtitle: '🥬 100% Fresh Vegetables & Fruits Daily',
    cta: 'Shop Fresh',
    bg: 'from-[#1b4332] via-[#2d6a4f] to-[#2ECC71]',
    emoji: '🥬',
    badge: 'Farm Fresh',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=compress&cs=tinysrgb&w=1000&h=450&fit=crop',
    linkCategory: 'fruits-veggies'
  },
  {
    id: 'banner_default_3',
    title: 'Double The Savings',
    subtitle: '⭐ Buy 1 Get 1 Free on Selected Snacks',
    cta: 'Get Deal',
    bg: 'from-[#0077b6] via-[#0096c7] to-[#03045e]',
    emoji: '⭐',
    badge: 'Buy 1 Get 1 Free',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=compress&cs=tinysrgb&w=1000&h=450&fit=crop',
    linkCategory: 'biscuits-snacks'
  },
  {
    id: 'banner_default_4',
    title: 'Exclusive Welcome Gift',
    subtitle: '🎁 Free Surprise Gift on First Order Above ₹499',
    cta: 'Shop Now',
    bg: 'from-[#7b2cbf] via-[#5a189a] to-[#FF6B35]',
    emoji: '🎁',
    badge: 'New Customer Gift',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=compress&cs=tinysrgb&w=1000&h=450&fit=crop',
    linkCategory: 'all'
  }
];

const syncProductsWithFeedback = async (url: string, products: Product[]) => {
  const toastId = toast.loading('Syncing products catalog with Google Sheets... ⏳');
  try {
    const success = await saveProductsToSheet(url, products);
    if (success) {
      toast.success('✅ Products catalog successfully synced with Google Sheets!', { id: toastId });
    } else {
      toast.error('❌ Failed to sync catalog. Please check your Google Sheets webhook or Apps Script version.', { id: toastId, duration: 6000 });
    }
  } catch (err) {
    console.error('Failed to sync products to Google Sheet:', err);
    toast.error('❌ Network error syncing products catalog with Google Sheets.', { id: toastId });
  }
};

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    pincode: string;
  };
  total: number;
  subtotal: number;
  deliveryFee: number;
  paymentMethod: 'cod' | 'upi' | 'razorpay';
  paymentStatus: 'pending' | 'paid';
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  upiRefNo?: string;
  locationUrl?: string;
  deliverySlot?: string; // Delivery slot chosen at checkout
  createdAt: string;
  updatedAt: string;
  feedback?: {
    rating: number;
    comment: string;
    itemsRating?: Record<string, number>;
    createdAt: string;
  };
}

export interface Subscription {
  id: string;
  product: Product;
  frequency: 'daily' | 'weekly' | 'monthly';
  quantity: number;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  deliverySlot: string;
  startDate: string;
  status: 'active' | 'cancelled';
  createdAt: string;
}

export interface HomeBanner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  cta?: string;
  bg?: string;
  emoji?: string;
  image?: string;
  linkProduct?: string;
  linkCategory?: string;
}

export interface StockRequest {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  customerName: string;
  customerContact: string; // Email or Phone
  createdAt: string;
  status: 'pending' | 'notified';
}

export interface CustomerNotification {
  id: string;
  type: 'restock';
  title: string;
  message: string;
  productId?: string;
  productImage?: string;
  createdAt: string;
  read: boolean;
}

export interface StoreBranch {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  upiId?: string;
  address: string;
  isActive: boolean;
}

export interface StoreSettings {
  shopName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsLink: string;
  businessHours: string;
  minOrderAmount: number;
  deliveryFee: number;
  freeDeliveryAbove: number;
  googleSheetWebhookUrl: string;
  googleSheetProductsWebhookUrl?: string;
  shopUpiId?: string;
  adminPassword: string;
  smsGateway?: 'simulated' | 'fast2sms' | 'twilio' | 'android';
  fast2smsApiKey?: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioFromNumber?: string;
  androidSmsToken?: string;
  androidSmsDeviceId?: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  shopName: 'Krishna Kirana',
  tagline: 'Premium Grocery',
  phone: '+91 98934 95231',
  whatsapp: '919893495231',
  email: 'mrudit767@gmail.com',
  address: '653, Vidisha Rd, Kalyan Nagar, Bhanpur, Bhopal, MP 462038',
  mapsLink: 'https://www.google.com/maps/search/653+Vidisha+Rd+Kalyan+Nagar+Bhanpur+Bhopal+Madhya+Pradesh+462038',
  businessHours: 'Mon-Sun: 7AM - 10PM',
  minOrderAmount: 0,
  deliveryFee: 49,
  freeDeliveryAbove: 299,
  googleSheetWebhookUrl: 'https://script.google.com/macros/s/AKfycbzKMXP4_DT32ePA9rc2YOd9-n2AKOvYi0ID0rcl1aLKAETYjL8eJc33_EacweDFmOELCQ/exec',
  googleSheetProductsWebhookUrl: 'https://script.google.com/macros/s/AKfycbzKMXP4_DT32ePA9rc2YOd9-n2AKOvYi0ID0rcl1aLKAETYjL8eJc33_EacweDFmOELCQ/exec',
  shopUpiId: 'paytmqr7247md@ptys',
  adminPassword: 'admin123',
  smsGateway: 'simulated',
  fast2smsApiKey: '',
  twilioAccountSid: '',
  twilioAuthToken: '',
  twilioFromNumber: '',
  androidSmsToken: '',
  androidSmsDeviceId: '',
};

export interface StoreState {
  // Products
  products: Product[];
  categories: { id: string; name: string; emoji: string; color: string; image?: string }[];
  branches: StoreBranch[];
  selectedBranchId: string;
  searchQuery: string;
  selectedCategory: string;
  darkMode: boolean;
  stockRequests: StockRequest[];
  customerNotifications: CustomerNotification[];

  // Cart
  cart: CartItem[];
  cartOpen: boolean;

  // Orders
  orders: Order[];

  // Customer Favorites, Viewed, Subscriptions
  wishlistIds: string[];
  recentlyViewedIds: string[];
  subscriptions: Subscription[];

  // Admin
  adminLoggedIn: boolean;
  adminView: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings' | 'branches' | 'banners';

  // Store Banners
  banners: HomeBanner[];

  // Store Settings
  storeSettings: StoreSettings;
  isAppsScriptOutdated: boolean;

  // UI
  currentPage: 'home' | 'products' | 'cart' | 'checkout' | 'orders' | 'admin' | 'order-success' | 'location' | 'track-order' | 'customer-login' | 'wishlist' | 'subscriptions';
  checkoutOrderId: string | null;
  selectedProductId: string | null;

  // Customer Auth
  currentCustomer: { name: string; phone: string; email?: string; address: string; city: string; pincode: string } | null;

  // Actions
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: string) => void;
  toggleDarkMode: () => void;
  setCurrentPage: (p: StoreState['currentPage']) => void;
  setSelectedProductId: (id: string | null) => void;

  // Cart Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;

  // Order Actions
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updatePaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
  submitOrderFeedback: (orderId: string, feedback: NonNullable<Order['feedback']>) => void;

  // Product Admin Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: { name: string; emoji: string; color?: string; image?: string }) => void;
  updateCategory: (id: string, updates: Partial<{ name: string; emoji: string; color: string; image: string }>) => void;
  deleteCategory: (id: string) => void;
  bulkAddProducts: (products: Omit<Product, 'id'>[]) => void;

  // Branch Actions
  addBranch: (branch: Omit<StoreBranch, 'id'>) => void;
  updateBranch: (id: string, updates: Partial<StoreBranch>) => void;
  deleteBranch: (id: string) => void;
  setSelectedBranchId: (id: string) => void;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;

  // Recently Viewed Actions
  addToRecentlyViewed: (productId: string) => void;

  // Subscription Actions
  addSubscription: (sub: Omit<Subscription, 'id' | 'createdAt' | 'status'>) => void;
  cancelSubscription: (id: string) => void;

  // Admin Actions
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  setAdminView: (view: StoreState['adminView']) => void;

  // Settings Actions
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;

  // Customer Actions
  customerLogin: (customer: { name: string; phone: string; email?: string; address: string; city: string; pincode: string }) => void;
  customerLogout: () => void;

  // Banner Actions
  addBanner: (banner: Omit<HomeBanner, 'id'>) => void;
  updateBanner: (id: string, updates: Partial<HomeBanner>) => void;
  deleteBanner: (id: string) => void;

  // Stock Request Actions
  addStockRequest: (request: Omit<StockRequest, 'id' | 'createdAt' | 'status'>) => void;
  deleteStockRequest: (id: string) => void;
  clearStockRequests: () => void;

  // Customer Notification Actions
  dismissNotification: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;

  // DB Sync Actions
  fetchProducts: () => Promise<void>;
  fetchSettings: () => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: PRODUCTS,
      categories: CATEGORIES,
      branches: [
        {
          id: 'main',
          name: 'Krishna Kirana (Main Branch)',
          phone: '+91 98934 95231',
          whatsapp: '919893495231',
          upiId: 'paytmqr7247md@ptys',
          address: '653, Vidisha Rd, Kalyan Nagar, Bhanpur, Bhopal, MP 462038',
          isActive: true
        }
      ],
      selectedBranchId: 'all',
      searchQuery: '',
      selectedCategory: 'all',
      darkMode: false,
      cart: [],
      cartOpen: false,
      orders: [],
      wishlistIds: [],
      recentlyViewedIds: [],
      subscriptions: [],
      banners: DEFAULT_BANNERS,
      adminLoggedIn: false,
      adminView: 'dashboard',
      currentPage: 'home',
      checkoutOrderId: null,
      selectedProductId: null,
       storeSettings: DEFAULT_SETTINGS,
      isAppsScriptOutdated: false,
      currentCustomer: null,
      stockRequests: [],
      customerNotifications: [],

      setSearchQuery: (q) => set({ searchQuery: q }),
      setSelectedCategory: (c) => set({ selectedCategory: c }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setCurrentPage: (p) => {
        set({ currentPage: p, cartOpen: false });
        window.scrollTo(0, 0);
      },
      setSelectedProductId: (id) => set({ selectedProductId: id }),

      addToCart: (product) => {
        const cart = get().cart;
        const existing = cart.find(i => i.product.id === product.id);
        if (existing) {
          set({ cart: cart.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ cart: [...cart, { product, quantity: 1 }] });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(i => i.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
        } else {
          set({ cart: get().cart.map(i => i.product.id === productId ? { ...i, quantity } : i) });
        }
      },

      clearCart: () => set({ cart: [] }),
      toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),

      getCartTotal: () => {
        const cart = get().cart;
        return cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      },

      getCartItemCount: () => {
        return get().cart.reduce((sum, i) => sum + i.quantity, 0);
      },

      placeOrder: (order) => {
        const id = `ORD${Date.now()}`;
        const now = new Date().toISOString();
        const newOrder: Order = {
          ...order,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ orders: [newOrder, ...(s.orders || [])], checkoutOrderId: id }));
        return id;
      },

      updateOrderStatus: (orderId, status) => {
        set((s) => ({
          orders: (s.orders || []).map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o)
        }));
      },

      submitOrderFeedback: (orderId, feedback) => {
        set((s) => ({
          orders: (s.orders || []).map(o => o.id === orderId ? { ...o, feedback, updatedAt: new Date().toISOString() } : o)
        }));
      },

      updatePaymentStatus: (orderId, status) => {
        set((s) => ({
          orders: (s.orders || []).map(o => o.id === orderId ? { ...o, paymentStatus: status, updatedAt: new Date().toISOString() } : o)
        }));
      },

      addProduct: (product) => {
        const id = `prod_${Date.now()}`;
        const updated = [...get().products, { ...product, id, updatedAt: Date.now() }];
        set({ products: updated });
        const url = get().storeSettings.googleSheetProductsWebhookUrl || get().storeSettings.googleSheetWebhookUrl;
        if (url) {
          syncProductsWithFeedback(url, updated);
        }
      },

      updateProduct: (id, updates) => {
        const oldProduct = get().products.find(p => p.id === id);
        const wasOutOfStock = oldProduct ? !oldProduct.inStock : false;

        const updated = get().products.map(p => p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p);
        set({ products: updated });

        // If product is now in stock, trigger notifications for pending requests
        if (updates.inStock === true && wasOutOfStock) {
          const pendingRequests = (get().stockRequests || []).filter(
            r => r.productId === id && r.status === 'pending'
          );

          if (pendingRequests.length > 0) {
            // Update requests status to notified
            const updatedRequests = (get().stockRequests || []).map(r => 
              (r.productId === id && r.status === 'pending')
                ? { ...r, status: 'notified' as const }
                : r
            );

            // Create customer-visible notifications for each requester
            const now = new Date().toISOString();
            const newNotifications: CustomerNotification[] = pendingRequests.map(_ => ({
              id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              type: 'restock' as const,
              title: '🎉 Product Back in Stock!',
              message: `${oldProduct?.name || 'Your requested product'} is now available! Order now before it sells out.`,
              productId: id,
              productImage: oldProduct?.image,
              createdAt: now,
              read: false,
            }));

            set(s => ({
              stockRequests: updatedRequests,
              customerNotifications: [...newNotifications, ...(s.customerNotifications || [])],
            }));

            // Admin toast
            toast.success(
              `✅ ${pendingRequests.length} customer${pendingRequests.length > 1 ? 's' : ''} notified that "${oldProduct?.name || 'Product'}" is back in stock!`,
              { duration: 5000 }
            );
          }
        }

        const url = get().storeSettings.googleSheetProductsWebhookUrl || get().storeSettings.googleSheetWebhookUrl;
        if (url) {
          syncProductsWithFeedback(url, updated);
        }
      },

      addStockRequest: (req) => {
        const id = `REQ${Date.now()}`;
        const newReq: StockRequest = {
          ...req,
          id,
          createdAt: new Date().toISOString(),
          status: 'pending'
        };
        set(s => ({ stockRequests: [newReq, ...(s.stockRequests || [])] }));
        toast.success('Request registered! We will notify you when this item is back in stock. 🔔');
      },

      deleteStockRequest: (id) => {
        set(s => ({ stockRequests: (s.stockRequests || []).filter(r => r.id !== id) }));
        toast.success('Request deleted');
      },

      clearStockRequests: () => {
        set({ stockRequests: [] });
        toast.success('All requests cleared');
      },

      dismissNotification: (id) => {
        set(s => ({ customerNotifications: (s.customerNotifications || []).filter(n => n.id !== id) }));
      },

      markAllNotificationsRead: () => {
        set(s => ({ customerNotifications: (s.customerNotifications || []).map(n => ({ ...n, read: true })) }));
      },

      clearAllNotifications: () => {
        set({ customerNotifications: [] });
      },

      deleteProduct: (id) => {
        const updated = get().products.filter(p => p.id !== id);
        set({ products: updated });
        const url = get().storeSettings.googleSheetProductsWebhookUrl || get().storeSettings.googleSheetWebhookUrl;
        if (url) {
          syncProductsWithFeedback(url, updated);
        }
      },

      bulkAddProducts: (products) => {
        const newProducts = products.map((p, i) => ({ ...p, id: `prod_bulk_${Date.now()}_${i}`, updatedAt: Date.now() }));
        set((s) => ({ products: [...s.products, ...newProducts] }));
      },

      addCategory: (cat) => {
        const id = cat.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if (!id) return;
        const exists = get().categories.some(c => c.id === id);
        if (exists) return;
        const newCat = {
          id,
          name: cat.name.trim(),
          emoji: cat.emoji.trim() || '📦',
          color: cat.color || 'from-green-500 to-emerald-600',
          image: cat.image?.trim() || '',
        };
        set(s => ({ categories: [...s.categories, newCat] }));
      },

      updateCategory: (id, updates) => {
        set(s => ({
          categories: s.categories.map(c => c.id === id ? { ...c, ...updates } : c)
        }));
      },

      deleteCategory: (id) => {
        set(s => ({ categories: s.categories.filter(c => c.id !== id) }));
      },

      adminLogin: (password) => {
        const { storeSettings } = get();
        if (password === storeSettings.adminPassword) {
          set({ adminLoggedIn: true });
          return true;
        }
        return false;
      },

      adminLogout: () => set({ adminLoggedIn: false, adminView: 'dashboard' }),
      setAdminView: (view) => set({ adminView: view }),

      updateStoreSettings: (settings) => {
        const updated = { ...get().storeSettings, ...settings };
        set({ storeSettings: updated });
        const url = updated.googleSheetProductsWebhookUrl || updated.googleSheetWebhookUrl;
        if (url) {
          const payload = { ...updated, banners: get().banners };
          saveSettingsToSheet(url, payload).catch(err => console.error('Failed to sync settings:', err));
        }
      },

      addBranch: (branch) => {
        const id = `branch_${Date.now()}`;
        const newBranch = { ...branch, id };
        set(s => ({ branches: [...s.branches, newBranch] }));
      },

      updateBranch: (id, updates) => {
        set(s => ({
          branches: s.branches.map(b => b.id === id ? { ...b, ...updates } : b)
        }));
      },

      deleteBranch: (id) => {
        set(s => ({
          branches: s.branches.filter(b => b.id !== id)
        }));
      },

      setSelectedBranchId: (id) => set({ selectedBranchId: id }),

      toggleWishlist: (productId) => {
        const ids = get().wishlistIds || [];
        if (ids.includes(productId)) {
          set({ wishlistIds: ids.filter(id => id !== productId) });
          toast.success('Removed from Wishlist 💔');
        } else {
          set({ wishlistIds: [...ids, productId] });
          toast.success('Added to Wishlist! ❤️');
        }
      },

      clearWishlist: () => set({ wishlistIds: [] }),

      addToRecentlyViewed: (productId) => {
        const ids = (get().recentlyViewedIds || []).filter(id => id !== productId);
        set({ recentlyViewedIds: [productId, ...ids].slice(0, 10) });
      },

      addSubscription: (sub) => {
        const id = `SUB${Date.now()}`;
        const newSub = {
          ...sub,
          id,
          status: 'active' as const,
          createdAt: new Date().toISOString()
        };
        set(s => ({ subscriptions: [newSub, ...(s.subscriptions || [])] }));
        toast.success('Subscription started successfully! 📅');
      },

      cancelSubscription: (id) => {
        set(s => ({
          subscriptions: (s.subscriptions || []).map(sub => sub.id === id ? { ...sub, status: 'cancelled' as const } : sub)
        }));
        toast.success('Subscription cancelled 🛑');
      },

      customerLogin: (customer) => set({ currentCustomer: customer }),
      customerLogout: () => set({ currentCustomer: null }),

      addBanner: (banner) => {
        const id = `banner_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const updated = [...(get().banners || []), { ...banner, id }];
        set({ banners: updated });
        toast.success('Banner added successfully! 📢');
        const url = get().storeSettings.googleSheetProductsWebhookUrl || get().storeSettings.googleSheetWebhookUrl;
        if (url) {
          const payload = { ...get().storeSettings, banners: updated };
          saveSettingsToSheet(url, payload).catch(err => console.error('Failed to sync banners:', err));
        }
      },
      updateBanner: (id, updates) => {
        const updated = (get().banners || []).map((b) => (b.id === id ? { ...b, ...updates } : b));
        set({ banners: updated });
        toast.success('Banner updated! ✏️');
        const url = get().storeSettings.googleSheetProductsWebhookUrl || get().storeSettings.googleSheetWebhookUrl;
        if (url) {
          const payload = { ...get().storeSettings, banners: updated };
          saveSettingsToSheet(url, payload).catch(err => console.error('Failed to sync banners:', err));
        }
      },
      deleteBanner: (id) => {
        const updated = (get().banners || []).filter((b) => b.id !== id);
        set({ banners: updated });
        toast.success('Banner deleted! 🗑️');
        const url = get().storeSettings.googleSheetProductsWebhookUrl || get().storeSettings.googleSheetWebhookUrl;
        if (url) {
          const payload = { ...get().storeSettings, banners: updated };
          saveSettingsToSheet(url, payload).catch(err => console.error('Failed to sync banners:', err));
        }
      },

      fetchProducts: async () => {
        const url = get().storeSettings.googleSheetProductsWebhookUrl || get().storeSettings.googleSheetWebhookUrl;
        if (!url) return;
        try {
          const fetched = await fetchProductsFromSheet(url);
          if (fetched && fetched.length > 0) {
            // Check if Apps Script is outdated by checking if the fetched products have 'images' or 'customWeights' property
            const firstProd = fetched[0];
            const isOutdated = !('images' in firstProd) || !('customWeights' in firstProd);
            set({ isAppsScriptOutdated: isOutdated });

            const localProducts = get().products || [];
            
            // 1. Create a map of fetched products by ID, resolving duplicates by ID/Name
            const fetchedMap = new Map<string, Product>();
            const seenNames = new Set<string>();
            for (const p of fetched) {
              if (p && p.id) {
                const cleanId = p.id.trim();
                const cleanName = p.name.trim().toLowerCase();
                if (!fetchedMap.has(cleanId) && !seenNames.has(cleanName)) {
                  fetchedMap.set(cleanId, p);
                  seenNames.add(cleanName);
                }
              }
            }

            // 2. Conflict resolution using updatedAt
            // If local product has been edited (newer updatedAt) or is local-only, preserve it
            const mergedProducts: Product[] = [];
            const mergedIds = new Set<string>();

            // Apply conflict resolution for local versions
            for (const lp of localProducts) {
              const fetchedProduct = fetchedMap.get(lp.id);
              if (fetchedProduct) {
                if (lp.updatedAt && (!fetchedProduct.updatedAt || lp.updatedAt > fetchedProduct.updatedAt)) {
                  fetchedMap.set(lp.id, lp); // Keep local edited version
                }
              }
            }

            // Add all valid fetched (and resolved) products
            for (const p of fetchedMap.values()) {
              mergedProducts.push(p);
              mergedIds.add(p.id);
            }

            // Add local custom products that are not yet on the sheet (ID starts with 'prod_')
            for (const lp of localProducts) {
              if (lp.id.startsWith('prod_') && !mergedIds.has(lp.id)) {
                const lowerName = lp.name.trim().toLowerCase();
                if (!seenNames.has(lowerName)) {
                  mergedProducts.push(lp);
                  mergedIds.add(lp.id);
                  seenNames.add(lowerName);
                }
              }
            }

            // Also merge any default products from PRODUCTS that are missing
            for (const dp of PRODUCTS) {
              if (!mergedIds.has(dp.id)) {
                const lowerName = dp.name.trim().toLowerCase();
                if (!seenNames.has(lowerName)) {
                  mergedProducts.push(dp);
                  mergedIds.add(dp.id);
                  seenNames.add(lowerName);
                }
              }
            }

            if (mergedProducts.length > 0) {
              set({ products: mergedProducts });
            }
          }
        } catch (err) {
          console.error('Failed to fetch and merge products:', err);
        }
      },

      fetchSettings: async () => {
        const url = get().storeSettings.googleSheetProductsWebhookUrl || get().storeSettings.googleSheetWebhookUrl;
        if (!url) return;
        const settings = await fetchSettingsFromSheet(url);
        if (settings) {
          if (settings.banners && Array.isArray(settings.banners) && settings.banners.length > 0) {
            set({ banners: settings.banners });
          } else if ((!settings.banners || !Array.isArray(settings.banners) || settings.banners.length === 0) && (!get().banners || get().banners.length === 0)) {
            set({ banners: DEFAULT_BANNERS });
          }
          const { banners, ...restSettings } = settings as any;
          set((s) => ({ storeSettings: { ...s.storeSettings, ...restSettings } }));
        }
      },
    }),
    {
      name: 'krishna-kirana-store',
      storage: createJSONStorage(() => ({
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch (e) {
            console.warn('localStorage setItem failed (quota exceeded):', e);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
      partialize: (s) => ({
        cart: s.cart,
        orders: s.orders,
        darkMode: s.darkMode,
        categories: s.categories,
        branches: s.branches,
        selectedBranchId: s.selectedBranchId,
        adminLoggedIn: s.adminLoggedIn,
        storeSettings: s.storeSettings,
        currentCustomer: s.currentCustomer,
        wishlistIds: s.wishlistIds,
        recentlyViewedIds: s.recentlyViewedIds,
        subscriptions: s.subscriptions,
        banners: s.banners || [],
        stockRequests: s.stockRequests || [],
        customerNotifications: s.customerNotifications || [],
      }),
    }
  )
);
