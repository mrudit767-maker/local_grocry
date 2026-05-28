import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, PRODUCTS } from '../data/products';

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
  createdAt: string;
  updatedAt: string;
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
  adminPassword: string;
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
  googleSheetWebhookUrl: 'https://script.google.com/macros/s/AKfycbxVRf2r-AqdQYV40t7HaQQ9Em_VrpzdaoRKex8pEvixMHpmz83_UtPDxyFc7a13Mrl8YQ/exec',
  adminPassword: 'admin123',
};

export interface StoreState {
  // Products
  products: Product[];
  searchQuery: string;
  selectedCategory: string;
  darkMode: boolean;

  // Cart
  cart: CartItem[];
  cartOpen: boolean;

  // Orders
  orders: Order[];

  // Admin
  adminLoggedIn: boolean;
  adminView: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings';

  // Store Settings
  storeSettings: StoreSettings;

  // UI
  currentPage: 'home' | 'products' | 'cart' | 'checkout' | 'orders' | 'admin' | 'order-success' | 'location' | 'track-order' | 'customer-login';
  checkoutOrderId: string | null;

  // Customer Auth
  currentCustomer: { name: string; phone: string; address: string; city: string; pincode: string } | null;

  // Actions
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: string) => void;
  toggleDarkMode: () => void;
  setCurrentPage: (p: StoreState['currentPage']) => void;

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

  // Product Admin Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  bulkAddProducts: (products: Omit<Product, 'id'>[]) => void;

  // Admin Actions
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  setAdminView: (view: StoreState['adminView']) => void;

  // Settings Actions
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;

  // Customer Actions
  customerLogin: (customer: { name: string; phone: string; address: string; city: string; pincode: string }) => void;
  customerLogout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: PRODUCTS,
      searchQuery: '',
      selectedCategory: 'all',
      darkMode: false,
      cart: [],
      cartOpen: false,
      orders: [],
      adminLoggedIn: false,
      adminView: 'dashboard',
      currentPage: 'home',
      checkoutOrderId: null,
      storeSettings: DEFAULT_SETTINGS,
      currentCustomer: null,

      setSearchQuery: (q) => set({ searchQuery: q }),
      setSelectedCategory: (c) => set({ selectedCategory: c }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setCurrentPage: (p) => set({ currentPage: p, cartOpen: false }),

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
        set((s) => ({ orders: [newOrder, ...s.orders], checkoutOrderId: id }));
        return id;
      },

      updateOrderStatus: (orderId, status) => {
        set((s) => ({
          orders: s.orders.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o)
        }));
      },

      updatePaymentStatus: (orderId, status) => {
        set((s) => ({
          orders: s.orders.map(o => o.id === orderId ? { ...o, paymentStatus: status, updatedAt: new Date().toISOString() } : o)
        }));
      },

      addProduct: (product) => {
        const id = `prod_${Date.now()}`;
        set((s) => ({ products: [...s.products, { ...product, id }] }));
      },

      updateProduct: (id, updates) => {
        set((s) => ({ products: s.products.map(p => p.id === id ? { ...p, ...updates } : p) }));
      },

      deleteProduct: (id) => {
        set((s) => ({ products: s.products.filter(p => p.id !== id) }));
      },

      bulkAddProducts: (products) => {
        const newProducts = products.map((p, i) => ({ ...p, id: `prod_bulk_${Date.now()}_${i}` }));
        set((s) => ({ products: [...s.products, ...newProducts] }));
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
        set((s) => ({ storeSettings: { ...s.storeSettings, ...settings } }));
      },

      customerLogin: (customer) => set({ currentCustomer: customer }),
      customerLogout: () => set({ currentCustomer: null }),
    }),
    {
      name: 'krishna-kirana-store',
      partialize: (s) => ({
        cart: s.cart,
        orders: s.orders,
        darkMode: s.darkMode,
        products: s.products,
        adminLoggedIn: s.adminLoggedIn,
        storeSettings: s.storeSettings,
        currentCustomer: s.currentCustomer,
      }),
    }
  )
);
