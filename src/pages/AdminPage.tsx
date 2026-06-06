import { useState } from 'react';
import {
  LogOut, Package, ShoppingBag, DollarSign, TrendingUp,
  Plus, Edit2, Trash2, X, ChevronLeft, Download, Search,
  Image as ImageIcon, Link, Star, ToggleLeft, ToggleRight, Save, Store, RefreshCw, Upload, Bell
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Product, CATEGORIES } from '../data/products';
import { Order, HomeBanner } from '../store/useStore';
import toast from 'react-hot-toast';
import SubscriptionInvoiceModal from '../components/SubscriptionInvoiceModal';
import OrderInvoiceModal from '../components/OrderInvoiceModal';
import { APPS_SCRIPT_CODE } from '../utils/appsScriptTemplate';
import SearchableSelect from '../components/SearchableSelect';

const STATUS_COLORS: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const compressImage = (file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions to fit within maxWidth/maxHeight
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string); // fallback to original
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const handleImageUpload = async (file: File, callback: (base64: string) => void) => {
  if (!file.type.startsWith('image/')) {
    toast.error('Only image files are allowed! 🖼️');
    return;
  }
  
  if (file.size > 10 * 1024 * 1024) {
    toast.error('Image size should be less than 10MB! 📁');
    return;
  }

  const toastId = toast.loading('Optimizing & compressing image... ⏳');
  try {
    const compressedBase64 = await compressImage(file, 800, 800, 0.75);
    callback(compressedBase64);
    toast.success('Image optimized & uploaded successfully! 📸', { id: toastId });
  } catch (err) {
    console.error('Image upload optimization error:', err);
    toast.error('Failed to read or optimize image file.', { id: toastId });
  }
};

const handleImagePaste = (e: React.ClipboardEvent<HTMLInputElement>, callback: (base64: string) => void) => {
  const items = e.clipboardData?.items;
  if (!items) return;

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const file = items[i].getAsFile();
      if (file) {
        e.preventDefault();
        handleImageUpload(file, callback);
        return;
      }
    }
  }
};

const handleMultipleImagesUpload = async (files: FileList | null, callback: (base64Array: string[]) => void) => {
  if (!files || files.length === 0) return;
  
  const toastId = toast.loading(`Uploading & optimizing ${files.length} images... ⏳`);
  const uploadedUrls: string[] = [];
  
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const compressedBase64 = await compressImage(file, 800, 800, 0.75);
        uploadedUrls.push(compressedBase64);
      }
    }
    callback(uploadedUrls);
    toast.success(`Successfully uploaded ${uploadedUrls.length} images! 📸`, { id: toastId });
  } catch (err) {
    console.error('Multiple images upload error:', err);
    toast.error('Failed to upload or optimize some images.', { id: toastId });
  }
};

function LoginForm() {
  const { adminLogin, darkMode } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!adminLogin(password)) {
      setError('Invalid password. Try: admin123');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-sm p-8 rounded-3xl border shadow-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="Krishna Kirana Logo"
              className="h-24 w-24 object-contain"
            />
          </div>
          <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Krishna Kirana Control Panel</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-500 ${
                error ? 'border-red-400' : darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300'
              }`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <div className="flex justify-between items-center mt-1.5">
              <span className="text-[10px] text-gray-400">Default Access Credential: <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded font-mono font-bold text-gray-600 dark:text-gray-300">admin123</code></span>
            </div>
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition-all"
          >
            Login to Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { products, orders, darkMode, categories } = useStore();
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;

  const stats = [
    { label: 'Total Products', value: products.length.toLocaleString(), icon: Package, color: 'text-blue-600', bg: darkMode ? 'bg-blue-900/30' : 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingBag, color: 'text-green-600', bg: darkMode ? 'bg-green-900/30' : 'bg-green-50', border: 'border-green-200' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600', bg: darkMode ? 'bg-purple-900/30' : 'bg-purple-50', border: 'border-purple-200' },
    { label: 'Pending Orders', value: pendingOrders.toString(), icon: TrendingUp, color: 'text-orange-600', bg: darkMode ? 'bg-orange-900/30' : 'bg-orange-50', border: 'border-orange-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`p-5 rounded-2xl border ${s.bg} ${s.border} ${darkMode ? 'border-opacity-30' : ''}`}>
            <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} flex items-center justify-center mb-3 shadow-sm`}>
              <s.icon className={s.color} size={20} />
            </div>
            <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{s.value}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className={`rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Orders</h3>
          <span className="text-gray-500 text-sm">{orders.length} total</span>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status'].map(h => (
                    <th key={h} className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className={`border-t ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-xs font-bold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{order.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className={`font-semibold text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>{order.customer.name}</p>
                      <p className="text-gray-500 text-xs">{order.customer.phone}</p>
                    </td>
                    <td className={`px-4 py-3 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{order.items.length} items</td>
                    <td className="px-4 py-3 font-bold text-green-600 text-xs">₹{order.total}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${STATUS_COLORS[order.status]}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Stats */}
      <div className={`rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Products by Category</h3>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categories.filter(c => c.id !== 'all').map(cat => {
            const count = products.filter(p => {
              if (cat.id === 'stationery' || cat.id === 'stationary') {
                return p.category === 'stationery' || p.category === 'stationary';
              }
              return p.category === cat.id;
            }).length;
            return ( 
              <div key={cat.id} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center gap-2`}>
                <span className="text-xl">{cat.emoji}</span>
                <div>
                  <p className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cat.name}</p>
                  <p className="text-gray-500 text-xs">{count} items</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics widgets */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Sales trend bar chart */}
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h4 className={`font-extrabold text-sm mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>📊 Sales Volume (Last 7 Days)</h4>
          <div className="flex items-end justify-between h-40 pt-4 px-2">
            {[
              { day: 'Mon', sales: 4200, pct: 45 },
              { day: 'Tue', sales: 6100, pct: 65 },
              { day: 'Wed', sales: 5000, pct: 53 },
              { day: 'Thu', sales: 7800, pct: 83 },
              { day: 'Fri', sales: 8500, pct: 90 },
              { day: 'Sat', sales: 9400, pct: 100 },
              { day: 'Sun', sales: 7300, pct: 77 },
            ].map(d => (
              <div key={d.day} className="flex flex-col items-center gap-2 w-8 group relative">
                <span className="absolute -top-6 hidden group-hover:block text-[9px] bg-gray-950 text-white px-1.5 py-0.5 rounded font-bold whitespace-nowrap">₹{d.sales}</span>
                <div className="w-full bg-green-500 rounded-t-lg transition-all hover:bg-green-600" style={{ height: `${d.pct}%` }} />
                <span className="text-[10px] text-gray-500 font-bold">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories breakdown circular percentage */}
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h4 className={`font-extrabold text-sm mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>🌾 Category Revenue Share</h4>
          <div className="space-y-2.5">
            {[
              { cat: 'Rice, Atta & Dals', pct: 42, color: 'bg-yellow-500' },
              { cat: 'Oils & Ghee', pct: 25, color: 'bg-green-500' },
              { cat: 'Dairy & Essentials', pct: 18, color: 'bg-blue-500' },
              { cat: 'Snacks & Beverages', pct: 15, color: 'bg-purple-500' },
            ].map(item => (
              <div key={item.cat} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">{item.cat}</span>
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>{item.pct}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface EditForm {
  name: string;
  category: string;
  subcategory: string;
  price: string;
  mrp: string;
  unit: string;
  badge: string;
  image: string;
  description: string;
  rating: string;
  inStock: boolean;
  storeId: string;
  images: string;
  customWeights: string;
}

const EMPTY_EDIT: EditForm = {
  name: '', category: 'rice-atta', subcategory: '', price: '', mrp: '',
  unit: '', badge: '', image: '', description: '', rating: '4.0', inStock: true,
  storeId: 'main', images: '', customWeights: '',
};

function ProductsManager({ branchFilter, setBranchFilter }: { branchFilter: string; setBranchFilter: (b: string) => void }) {
  const { products = [], updateProduct, deleteProduct, addProduct, categories = [], addCategory, darkMode, branches = [], storeSettings } = useStore();
  const activeCategories = categories.length > 0 ? categories : CATEGORIES;
  const activeBranches = branches.length > 0 ? branches : [
    {
      id: 'main',
      name: storeSettings?.shopName || 'Krishna Kirana (Main Branch)',
      phone: storeSettings?.phone || '+91 98934 95231',
      whatsapp: storeSettings?.whatsapp || '919893495231',
      upiId: storeSettings?.shopUpiId || 'paytmqr7247md@ptys',
      address: storeSettings?.address || '653, Vidisha Rd, Kalyan Nagar, Bhanpur, Bhopal, MP 462038',
      isActive: true
    }
  ];
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(EMPTY_EDIT);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<EditForm & { imageUrl: string }>({
    ...EMPTY_EDIT, imageUrl: '',
  });
  const [newImageError, setNewImageError] = useState(false);

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('📦');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }
    const slug = newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const exists = activeCategories.some(c => c.id === slug);
    if (exists) {
      toast.error('Category already exists');
      return;
    }
    addCategory({
      name: newCategoryName.trim(),
      emoji: newCategoryEmoji.trim() || '📦',
      color: 'from-green-500 to-emerald-600',
    });
    toast.success('Category created successfully!');
    
    if (showAddForm) {
      setNewProduct(p => ({ ...p, category: slug }));
    } else if (editProduct) {
      setEditForm(f => ({ ...f, category: slug }));
    }
    
    setShowAddCategoryModal(false);
    setNewCategoryName('');
    setNewCategoryEmoji('📦');
  };

  const filtered = (products || []).filter(p => {
    if (!p) return false;
    const matchSearch = !search || (p.name || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || p.category === category || 
      ((category === 'stationery' || category === 'stationary') && (p.category === 'stationery' || p.category === 'stationary'));
    const matchBranch = branchFilter === 'all' || p.storeId === branchFilter || (branchFilter === 'main' && (!p.storeId || p.storeId === 'main'));
    return matchSearch && matchCat && matchBranch;
  });

  const openEdit = (p: Product) => {
    if (!p) return;
    setEditProduct(p);
    setImagePreviewError(false);
    setEditForm({
      name: p.name || '',
      category: p.category || '',
      subcategory: p.subcategory || '',
      price: (p.price ?? '').toString(),
      mrp: (p.mrp ?? '').toString(),
      unit: p.unit || '',
      badge: p.badge || '',
      image: p.image || '',
      description: p.description || '',
      rating: (p.rating ?? '4.0').toString(),
      inStock: !!p.inStock,
      storeId: p.storeId || 'main',
      images: p.images ? p.images.join(', ') : '',
      customWeights: p.customWeights ? p.customWeights.join(', ') : '',
    });
  };

  const saveEdit = () => {
    if (!editProduct) return;
    const name = (editForm.name || '').trim();
    if (!name) { toast.error('Product name is required'); return; }
    
    const mrp = parseFloat(editForm.mrp);
    if (isNaN(mrp) || mrp <= 0) { toast.error('Enter a valid MRP'); return; }

    const price = (!editForm.price || editForm.price.trim() === '') ? mrp : parseFloat(editForm.price);
    if (isNaN(price) || price <= 0) { toast.error('Enter a valid price'); return; }

    const rating = parseFloat(editForm.rating);
    const imagesArr = editForm.images 
      ? editForm.images.split(/,|\n/).map(s => s.trim()).filter(Boolean)
      : undefined;
    const weightsArr = editForm.customWeights
      ? editForm.customWeights.split(/,|\n/).map(s => s.trim()).filter(Boolean)
      : undefined;

    updateProduct(editProduct.id, {
      name,
      category: editForm.category,
      subcategory: (editForm.subcategory || '').trim(),
      price,
      mrp,
      unit: (editForm.unit || '').trim(),
      badge: (editForm.badge || '').trim() || undefined,
      image: (editForm.image || '').trim() || editProduct.image,
      description: (editForm.description || '').trim() || name,
      rating: isNaN(rating) ? 4.0 : Math.min(5, Math.max(0, rating)),
      inStock: !!editForm.inStock,
      storeId: editForm.storeId || 'main',
      images: imagesArr,
      customWeights: weightsArr,
    });
    setEditProduct(null);
    toast.success('✅ Product updated successfully!');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"?`)) {
      deleteProduct(id);
      toast.success('Product deleted');
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.mrp || !newProduct.unit) {
      toast.error('Name, MRP and Unit are required fields');
      return;
    }
    const mrp = parseFloat(newProduct.mrp);
    if (isNaN(mrp) || mrp <= 0) {
      toast.error('Enter a valid MRP');
      return;
    }
    const priceVal = (!newProduct.price || newProduct.price.trim() === '') ? mrp : parseFloat(newProduct.price);
    if (isNaN(priceVal) || priceVal <= 0) {
      toast.error('Enter a valid price');
      return;
    }
    const fallbackImage = `https://placehold.co/200x200/16a34a/ffffff?text=${encodeURIComponent(newProduct.name.slice(0, 2).toUpperCase())}`;
    const imagesArr = newProduct.images 
      ? newProduct.images.split(/,|\n/).map(s => s.trim()).filter(Boolean)
      : undefined;
    const weightsArr = newProduct.customWeights
      ? newProduct.customWeights.split(/,|\n/).map(s => s.trim()).filter(Boolean)
      : undefined;

    addProduct({
      name: newProduct.name,
      category: newProduct.category,
      subcategory: newProduct.subcategory || newProduct.category,
      price: priceVal,
      mrp,
      unit: newProduct.unit,
      badge: newProduct.badge || undefined,
      image: newProduct.imageUrl.trim() || fallbackImage,
      rating: 4.0,
      reviews: 100,
      inStock: true,
      description: newProduct.description || newProduct.name,
      storeId: newProduct.storeId,
      images: imagesArr,
      customWeights: weightsArr,
    });
    toast.success('✅ Product added!');
    setNewProduct({ ...EMPTY_EDIT, imageUrl: '' });
    setNewImageError(false);
    setShowAddForm(false);
  };

  const downloadCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Subcategory', 'Price', 'MRP', 'Unit', 'Badge', 'Image URL', 'In Stock'];
    const rows = products.map(p => [
      p.id, `"${p.name}"`, p.category, p.subcategory, p.price, p.mrp, p.unit, p.badge || '', p.image, p.inStock
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'krishna-kirana-products.csv';
    a.click();
    toast.success('CSV downloaded!');
  };

  const inp = (dark: boolean) =>
    `w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-500 ${
      dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'
    }`;

  return (
    <div className="space-y-4">

      {/* ─── Edit Modal ─────────────────────────────── */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor:'rgba(0,0,0,0.6)'}}>
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {/* Modal Header */}
            <div className={`sticky top-0 flex items-center justify-between px-6 py-4 border-b rounded-t-3xl ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Edit2 size={18} className="text-blue-600" />
                </div>
                <div>
                  <h2 className={`font-black text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit Product</h2>
                  <p className="text-xs text-gray-500 truncate max-w-[220px]">{editProduct.name}</p>
                </div>
              </div>
              <button onClick={() => setEditProduct(null)} className={`p-2 rounded-xl ${
                darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}>
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* ── Image Section ── */}
              <div className={`p-4 rounded-2xl border-2 border-dashed ${
                darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-green-200 bg-green-50/50'
              }`}>
                <div className="flex items-start gap-4">
                  {/* Preview */}
                  <div className="shrink-0">
                    <div className={`w-24 h-24 rounded-2xl overflow-hidden border-2 ${
                      darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-100'
                    } flex items-center justify-center`}>
                      {editForm.image && !imagePreviewError ? (
                        <img
                          src={editForm.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => setImagePreviewError(true)}
                          key={editForm.image}
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon size={28} className={darkMode ? 'text-gray-500 mx-auto' : 'text-gray-400 mx-auto'} />
                          <p className="text-[10px] text-gray-400 mt-1">{imagePreviewError ? 'Invalid URL' : 'No Image'}</p>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-center mt-1 text-gray-400">Preview</p>
                  </div>

                  {/* URL Input */}
                  <div className="flex-1">
                    <label className={`flex items-center gap-1.5 text-xs font-bold mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <ImageIcon size={13} /> Product Image URL & Upload
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={editForm.image}
                          onChange={e => {
                            setEditForm(f => ({ ...f, image: e.target.value }));
                            setImagePreviewError(false);
                          }}
                          onPaste={e => handleImagePaste(e, (base64) => {
                            setEditForm(f => ({ ...f, image: base64 }));
                            setImagePreviewError(false);
                          })}
                          placeholder="https://example.com/image.jpg or Paste Image"
                          className={`w-full pl-8 pr-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-500 ${
                            darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      <label className={`cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700'
                      }`}>
                        <Upload size={13} />
                        <span>Upload</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, (base64) => {
                                setEditForm(f => ({ ...f, image: base64 }));
                                setImagePreviewError(false);
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                    <p className={`text-[11px] mt-1.5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      💡 Paste any image URL, upload a local file, or **copy & paste an image directly** into the input box!
                    </p>
                    {editForm.image && !imagePreviewError && (
                      <p className="text-[11px] text-green-600 font-semibold mt-1">✅ Image loaded successfully</p>
                    )}
                    {imagePreviewError && (
                      <p className="text-[11px] text-red-500 font-semibold mt-1">❌ Image URL not accessible — try another link</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Basic Info ── */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3">
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Product Name *</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Aashirvaad Atta 5kg" className={inp(darkMode)} />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category *</label>
                  <div className="flex gap-2">
                    <select value={editForm.category} onChange={e => setEditForm(f => ({...f, category: e.target.value}))} className={`${inp(darkMode)} flex-1`}>
                      {activeCategories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddCategoryModal(true)}
                      className="px-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center shadow-md transition-all cursor-pointer text-sm font-bold"
                      title="Create New Category"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subcategory</label>
                  <input type="text" value={editForm.subcategory} onChange={e => setEditForm(f => ({...f, subcategory: e.target.value}))} placeholder="e.g. Atta, Basmati Rice" className={inp(darkMode)} />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Store / Seller *</label>
                  <select value={editForm.storeId} onChange={e => setEditForm(f => ({...f, storeId: e.target.value}))} className={inp(darkMode)}>
                    {activeBranches.map(br => <option key={br.id} value={br.id}>{br.name.replace(' (Main Branch)', '')}</option>)}
                  </select>
                </div>
              </div>

              {/* ── Pricing ── */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price (₹) <span className="text-gray-400 font-normal">(optional — defaults to MRP)</span></label>
                  <input type="number" value={editForm.price} onChange={e => setEditForm(f => ({...f, price: e.target.value}))} placeholder="Leave blank for MRP" className={inp(darkMode)} />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>MRP (₹) *</label>
                  <input type="number" value={editForm.mrp} onChange={e => setEditForm(f => ({...f, mrp: e.target.value}))} placeholder="349" className={inp(darkMode)} />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Unit *</label>
                  <input type="text" value={editForm.unit} onChange={e => setEditForm(f => ({...f, unit: e.target.value}))} placeholder="5 kg" className={inp(darkMode)} />
                </div>
              </div>

              {/* ── Extra ── */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Badge <span className="font-normal text-gray-400">(optional)</span></label>
                  <input type="text" value={editForm.badge} onChange={e => setEditForm(f => ({...f, badge: e.target.value}))} placeholder="Best Seller, Organic, New" className={inp(darkMode)} />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Star size={11} className="inline mr-1" />Rating (0–5)
                  </label>
                  <input type="number" min="0" max="5" step="0.1" value={editForm.rating} onChange={e => setEditForm(f => ({...f, rating: e.target.value}))} placeholder="4.5" className={inp(darkMode)} />
                </div>
                 <div className="sm:col-span-2">
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                  <textarea rows={2} value={editForm.description} onChange={e => setEditForm(f => ({...f, description: e.target.value}))} placeholder="Short description of the product..." className={`${inp(darkMode)} resize-none`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    📸 Multiple Product Images <span className="font-normal text-gray-400">(comma-separated URLs or upload multiple)</span>
                  </label>
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={editForm.images}
                      onChange={e => setEditForm(f => ({...f, images: e.target.value}))}
                      placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                      className={`${inp(darkMode)} resize-none`}
                    />
                    <label className={`cursor-pointer flex flex-col items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-bold transition-all shrink-0 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700'
                    }`}>
                      <Upload size={16} />
                      <span>Upload Files</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        className="hidden" 
                        onChange={e => {
                          handleMultipleImagesUpload(e.target.files, (base64Array) => {
                            const current = editForm.images ? editForm.images.trim() : '';
                            const added = base64Array.join(', ');
                            const combined = current ? `${current}, ${added}` : added;
                            setEditForm(f => ({ ...f, images: combined }));
                          });
                        }}
                      />
                    </label>
                  </div>
                  {/* Thumbnail previews */}
                  {editForm.images && (
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                      {editForm.images.split(/,|\n/).map(s => s.trim()).filter(Boolean).map((url, idx) => (
                        <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-300 shrink-0">
                          <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const remaining = editForm.images
                                ?.split(/,|\n/)
                                .map(s => s.trim())
                                .filter(Boolean)
                                .filter((_, i) => i !== idx)
                                .join(', ') || '';
                              setEditForm(f => ({ ...f, images: remaining }));
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5 hover:bg-red-650"
                            title="Remove Image"
                          >
                            <X size={8} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    ⚖️ Custom Weight/Quantity Variants <span className="font-normal text-gray-400">(comma-separated, e.g. "500 g, 1 kg, 5 kg")</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.customWeights}
                    onChange={e => setEditForm(f => ({...f, customWeights: e.target.value}))}
                    placeholder="Leave empty for auto-generated variants (e.g. 1 kg, 5 kg, 10 kg, 30 kg)"
                    className={inp(darkMode)}
                  />
                </div>
              </div>

              {/* ── Stock Toggle ── */}
              <div className={`flex items-center justify-between p-4 rounded-2xl border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div>
                  <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Stock Availability</p>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {editForm.inStock ? '✅ This product is available for purchase' : '❌ This product is hidden from customers'}
                  </p>
                </div>
                <button
                  onClick={() => setEditForm(f => ({...f, inStock: !f.inStock}))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    editForm.inStock
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : darkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {editForm.inStock ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  {editForm.inStock ? 'In Stock' : 'Out of Stock'}
                </button>
              </div>

              {/* ── Save / Cancel ── */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={saveEdit}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-bold text-sm shadow-lg transition-all"
                >
                  <Save size={16} /> Save Changes
                </button>
                <button
                  onClick={() => setEditProduct(null)}
                  className={`px-5 py-3 rounded-2xl text-sm font-semibold border transition-all ${
                    darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Toolbar ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
        }`}>
          <Search size={15} className="text-gray-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className={`flex-1 text-sm bg-transparent outline-none ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900'}`}
          />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className={`px-3 py-2 rounded-xl border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
          <option value="all">All Categories 📦</option>
          {activeCategories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
        </select>
        <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)}
          className={`px-3 py-2 rounded-xl border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
          <option value="all">🏢 All Branches</option>
          {activeBranches.map(br => <option key={br.id} value={br.id}>📍 {br.name.replace(' (Main Branch)', '')}</option>)}
        </select>
        <button onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold">
          <Plus size={15} /> Add Product
        </button>
        <button onClick={downloadCSV}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${
            darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'
          }`}>
          <Download size={15} /> Export
        </button>
      </div>

      {/* ─── Add Product Form ─────────────────────── */}
      {showAddForm && (
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Plus size={18} className="text-green-600" /> Add New Product
          </h3>

          {/* Image URL + Preview */}
          <div className={`p-4 rounded-2xl border-2 border-dashed mb-4 ${
            darkMode ? 'border-gray-600 bg-gray-700/40' : 'border-green-200 bg-green-50/50'
          }`}>
            <label className={`flex items-center gap-2 text-xs font-bold mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <ImageIcon size={13} /> Product Image URL & Upload <span className="font-normal text-gray-400">(optional — paste URL, upload, or paste image)</span>
            </label>
            <div className="flex gap-3 items-start">
              <div className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border ${
                darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-100'
              } flex items-center justify-center`}>
                {newProduct.imageUrl && !newImageError ? (
                  <img
                    src={newProduct.imageUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={() => setNewImageError(true)}
                    key={newProduct.imageUrl}
                  />
                ) : (
                  <ImageIcon size={22} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newProduct.imageUrl}
                    onChange={e => {
                      setNewProduct(p => ({...p, imageUrl: e.target.value}));
                      setNewImageError(false);
                    }}
                    onPaste={e => handleImagePaste(e, (base64) => {
                      setNewProduct(p => ({...p, imageUrl: base64}));
                      setNewImageError(false);
                    })}
                    placeholder="https://example.com/product.jpg or Paste Image"
                    className={`flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  <label className={`cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700'
                  }`}>
                    <Upload size={13} />
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, (base64) => {
                            setNewProduct(p => ({...p, imageUrl: base64}));
                            setNewImageError(false);
                          });
                        }
                      }}
                    />
                  </label>
                </div>
                {newProduct.imageUrl && !newImageError && <p className="text-[11px] text-green-600 font-semibold mt-1">✅ Image loaded</p>}
                {newImageError && <p className="text-[11px] text-red-500 mt-1">❌ Cannot load image — check URL</p>}
                {!newProduct.imageUrl && <p className="text-[11px] text-gray-400 mt-1">Leave blank to use an auto-generated placeholder, upload a file, or paste an image directly!</p>}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: 'name', label: 'Product Name *', placeholder: 'e.g. Aashirvaad Atta' },
              { key: 'subcategory', label: 'Subcategory', placeholder: 'e.g. Atta' },
              { key: 'unit', label: 'Unit *', placeholder: 'e.g. 5 kg, 1 L' },
              { key: 'price', label: 'Price (₹) (optional — defaults to MRP)', placeholder: 'Leave blank for MRP' },
              { key: 'mrp', label: 'MRP (₹) *', placeholder: 'e.g. 349' },
              { key: 'badge', label: 'Badge', placeholder: 'e.g. Best Seller, Organic' },
              { key: 'description', label: 'Description', placeholder: 'Short product description' },
            ].map(f => (
              <div key={f.key} className={f.key === 'description' ? 'md:col-span-2' : ''}>
                <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{f.label}</label>
                <input
                  type="text"
                  value={(newProduct as any)[f.key]}
                  onChange={e => setNewProduct(p => ({...p, [f.key]: e.target.value}))}
                  placeholder={f.placeholder}
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-green-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>
            ))}
            
            {/* Multiple images and weights section */}
            <div className="sm:col-span-2 md:col-span-3">
              <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-655'}`}>
                📸 Multiple Product Images <span className="font-normal text-gray-400">(comma-separated URLs or upload multiple)</span>
              </label>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={newProduct.images || ''}
                  onChange={e => setNewProduct(p => ({...p, images: e.target.value}))}
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'
                  }`}
                />
                <label className={`cursor-pointer flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl border text-[10px] font-bold transition-all shrink-0 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700'
                }`}>
                  <Upload size={16} />
                  <span>Upload Files</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={e => {
                      handleMultipleImagesUpload(e.target.files, (base64Array) => {
                        const current = newProduct.images ? newProduct.images.trim() : '';
                        const added = base64Array.join(', ');
                        const combined = current ? `${current}, ${added}` : added;
                        setNewProduct(p => ({ ...p, images: combined }));
                      });
                    }}
                  />
                </label>
              </div>
              {/* Thumbnail previews */}
              {newProduct.images && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                  {newProduct.images.split(/,|\n/).map(s => s.trim()).filter(Boolean).map((url, idx) => (
                    <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-300 shrink-0">
                      <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const remaining = newProduct.images
                            ?.split(/,|\n/)
                            .map(s => s.trim())
                            .filter(Boolean)
                            .filter((_, i) => i !== idx)
                            .join(', ') || '';
                          setNewProduct(p => ({ ...p, images: remaining }));
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5 hover:bg-red-650"
                        title="Remove Image"
                      >
                        <X size={8} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sm:col-span-2 md:col-span-3">
              <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-655'}`}>
                ⚖️ Custom Weight/Quantity Variants <span className="font-normal text-gray-400">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={newProduct.customWeights || ''}
                onChange={e => setNewProduct(p => ({...p, customWeights: e.target.value}))}
                placeholder="e.g. 500 g, 1 kg, 5 kg"
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-green-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Category *</label>
              <div className="flex gap-2">
                <select
                  value={newProduct.category}
                  onChange={e => setNewProduct(p => ({...p, category: e.target.value}))}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {activeCategories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(true)}
                  className="px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center justify-center shadow-md transition-all cursor-pointer text-sm font-bold"
                  title="Create New Category"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Store / Seller *</label>
              <select
                value={newProduct.storeId}
                onChange={e => setNewProduct(p => ({...p, storeId: e.target.value}))}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                }`}
              >
                {activeBranches.map(br => <option key={br.id} value={br.id}>{br.name.replace(' (Main Branch)', '')}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAddProduct} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-bold">
              <Plus size={15} /> Add Product
            </button>
            <button onClick={() => { setShowAddForm(false); setNewProduct({...EMPTY_EDIT, imageUrl: ''}); setNewImageError(false); }}
              className={`px-4 py-2.5 rounded-xl text-sm border ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'}`}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Count */}
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Showing {filtered.length} of {products.length} products
      </p>

      {/* ─── Products Table ───────────────────────── */}
      <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className={`sticky top-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                {['Image', 'Product', 'Branch', 'Category', 'Price', 'MRP', 'Unit', 'Stock', 'Actions'].map(h => (
                  <th key={h} className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 200).map(p => (
                <tr key={p.id} className={`border-t ${
                  darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'
                }`}>
                  {/* Image Cell */}
                  <td className="px-4 py-2">
                    <div className="relative group w-12 h-12">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200"
                        onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/48x48/16a34a/ffffff?text=${encodeURIComponent(p.name.slice(0,2))}`; }}
                      />
                      {/* Hover big preview */}
                      <div className="absolute left-14 top-0 z-20 hidden group-hover:flex">
                        <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-green-500 shadow-2xl bg-white">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/112x112/16a34a/ffffff?text=${encodeURIComponent(p.name.slice(0,2))}`; }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <p className={`font-semibold text-xs max-w-[160px] truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.name}</p>
                    {p.badge && <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded-full font-medium">{p.badge}</span>}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      p.storeId === 'main' || !p.storeId
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {(activeBranches.find(b => b.id === p.storeId)?.name || 'Main').replace(' (Main Branch)', '')}
                    </span>
                  </td>
                  <td className={`px-4 py-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {(() => {
                      const cat = activeCategories.find(c => c.id === p.category || 
                        ((c.id === 'stationery' || c.id === 'stationary') && (p.category === 'stationery' || p.category === 'stationary'))
                      );
                      return cat ? `${cat.emoji} ${p.subcategory}` : p.subcategory;
                    })()}
                  </td>
                  <td className="px-4 py-2">
                    <span className="font-bold text-green-600 text-xs">₹{p.price}</span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`text-xs line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>₹{p.mrp}</span>
                  </td>
                  <td className={`px-4 py-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{p.unit}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => { updateProduct(p.id, { inStock: !p.inStock }); toast.success(p.inStock ? 'Marked out of stock' : 'Marked in stock'); }}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer transition-all ${
                        p.inStock ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {p.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold ${
                          darkMode ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        <Edit2 size={11} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className={`p-1.5 rounded-lg ${
                          darkMode ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      {/* ─── Add Category Modal ─────────────────────── */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor:'rgba(0,0,0,0.6)'}}>
          <div className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`font-black text-lg mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🏷️ Create New Category
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category Name *</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Sweets, Beverages"
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-500 ${
                    darkMode ? 'bg-gray-750 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category Emoji (optional)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={newCategoryEmoji}
                  onChange={e => setNewCategoryEmoji(e.target.value)}
                  placeholder="e.g. 🍬"
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-500 ${
                    darkMode ? 'bg-gray-750 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddCategory}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Create Category
              </button>
              <button
                onClick={() => { setShowAddCategoryModal(false); setNewCategoryName(''); setNewCategoryEmoji('📦'); }}
                className={`px-4 py-2.5 rounded-xl text-sm border transition-all cursor-pointer ${
                  darkMode ? 'border-gray-650 text-gray-300 hover:bg-gray-750' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

function OrdersManager() {
  const { orders, updateOrderStatus, updatePaymentStatus, darkMode } = useStore();
  const [filter, setFilter] = useState('all');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all ${
              filter === s ? 'bg-green-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-650' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s.replace('_', ' ')} {s === 'all' ? `(${orders.length})` : `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No orders in this category</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{order.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Payment Pending'}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(order.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-black text-lg">₹{order.total}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{order.items.length} items</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-55'} flex flex-col justify-between`}>
                  <div>
                    <p className={`text-xs font-bold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Customer</p>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{order.customer.name}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-650'}`}>{order.customer.phone}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-655'}`}>{order.customer.address}</p>
                  </div>
                  {order.locationUrl && (
                    <a
                      href={order.locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 hover:underline font-bold transition-all"
                    >
                      📍 🗺️ Open Delivery Map
                    </a>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-55'}`}>
                  <p className={`text-xs font-bold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Payment</p>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {order.paymentMethod.toUpperCase()} {order.upiRefNo ? `(UTR: ${order.upiRefNo})` : ''}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-650'}`}>Delivery: {order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee}`}</p>
                </div>
              </div>

              {/* Order Items List */}
              <div className={`mb-4 p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>🛒 Ordered Items</p>
                <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50 space-y-1.5">
                  {order.items.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center py-1.5 first:pt-0 last:pb-0 text-sm">
                      <div className="flex-1 min-w-0 pr-4">
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.product.name}</span>
                        <span className="text-gray-500 text-xs ml-2">({item.product.unit} × {item.quantity})</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-gray-500 text-xs">₹{item.product.price} each</span>
                        <span className={`font-bold ${darkMode ? 'text-green-600' : 'text-green-500'}`}>₹{item.product.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Feedback Display */}
              {order.feedback && (
                <div className={`mb-4 p-4 rounded-xl border ${
                  darkMode 
                    ? 'bg-yellow-950/20 border-yellow-900/35 text-yellow-450' 
                    : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                }`}>
                  <p className="text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span>⭐ Customer Feedback</span>
                    <span className="text-[10px] font-medium opacity-70">
                      ({new Date(order.feedback.createdAt).toLocaleDateString('en-IN')})
                    </span>
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className="text-xs leading-none">
                          {s <= order.feedback!.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-black">
                      ({order.feedback.rating}/5 stars)
                    </span>
                  </div>
                  {order.feedback.comment && (
                    <p className="text-xs mt-1.5 italic font-medium">
                      "{order.feedback.comment}"
                    </p>
                  )}
                  {/* Items feedback */}
                  {order.feedback.itemsRating && (
                    <div className="mt-2.5 pt-2 border-t border-yellow-300/20 text-[10px] space-y-1">
                      <p className="font-bold uppercase tracking-wide opacity-80">Product Ratings:</p>
                      {Object.entries(order.feedback.itemsRating).map(([itemId, rating]) => {
                        const item = order.items.find(i => i.product.id === itemId);
                        if (!item) return null;
                        return (
                          <div key={itemId} className="flex justify-between items-center opacity-90">
                            <span className="truncate max-w-[70%]">{item.product.name}</span>
                            <span className="font-bold shrink-0">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 items-center w-full">
                <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Update Status:</span>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {(['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'] as Order['status'][]).map(s => (
                    <button
                      key={s}
                      onClick={() => { updateOrderStatus(order.id, s); toast.success(`Order ${s.replace('_', ' ')}`); }}
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all cursor-pointer ${
                        order.status === s
                          ? `${STATUS_COLORS[s]} ring-2 ring-offset-1 ring-green-400`
                          : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-105 text-gray-650 hover:bg-gray-200'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                  {order.paymentStatus === 'pending' && (
                    <button
                      onClick={() => { updatePaymentStatus(order.id, 'paid'); toast.success('Payment marked as paid'); }}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                    >
                      ✓ Mark Paid
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceOrder(order)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200/50 hover:bg-blue-100/50 cursor-pointer flex items-center gap-1 shadow-sm mt-1 sm:mt-0 sm:ml-auto"
                >
                  🧾 Print Bill / Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedInvoiceOrder && (
        <OrderInvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
}

function CustomersManager() {
  const { orders, darkMode } = useStore();
  const customerMap = new Map<string, { name: string; phone: string; orders: typeof orders; totalSpent: number }>();
  orders.forEach(o => {
    const key = o.customer.phone;
    if (!customerMap.has(key)) customerMap.set(key, { name: o.customer.name, phone: o.customer.phone, orders: [], totalSpent: 0 });
    const c = customerMap.get(key)!;
    c.orders.push(o);
    if (o.status !== 'cancelled') c.totalSpent += o.total;
  });
  const customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);

  if (customers.length === 0) return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">👤</div>
      <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>No Customers Yet</p>
      <p className="text-gray-500 text-sm mt-1">Customer data will appear here once orders are placed</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
        {[
          { label: 'Total Customers', value: customers.length, color: darkMode ? 'text-white' : 'text-gray-900' },
          { label: 'Total Revenue', value: `₹${customers.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}`, color: 'text-green-600' },
          { label: 'Repeat Customers', value: customers.filter(c => c.orders.length > 1).length, color: 'text-purple-600' },
        ].map(stat => (
          <div key={stat.label} className={`p-4 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>{['Customer', 'Phone', 'Orders', 'Total Spent', 'Last Order', 'WhatsApp'].map(h => (
                <th key={h} className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.phone} className={`border-t ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {c.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-semibold text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>{c.name}</p>
                        {c.orders.length > 1 && <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold">Repeat</span>}
                      </div>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-xs font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{c.phone}</td>
                  <td className={`px-4 py-3 text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{c.orders.length}</td>
                  <td className="px-4 py-3 text-xs font-black text-green-600">₹{c.totalSpent.toLocaleString()}</td>
                  <td className={`px-4 py-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(c.orders[0].createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <a href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=Hi ${c.name}! Thank you for shopping at Krishna Kirana 🛒`} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold hover:bg-green-200 transition-all">💬 Chat</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SubscriptionsManager() {
  const { products = [], subscriptions = [], addSubscription, cancelSubscription, darkMode } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [quantity, setQuantity] = useState(1);
  const [slot, setSlot] = useState('10 AM – 12 PM');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Bhopal',
    pincode: '',
  });
  const [selectedBillCustomer, setSelectedBillCustomer] = useState<any>(null);

  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const cancelledSubs = subscriptions.filter(s => s.status === 'cancelled');

  const resetForm = () => {
    setSelectedProductId('');
    setFrequency('daily');
    setQuantity(1);
    setSlot('10 AM – 12 PM');
    setStartDate(new Date().toISOString().split('T')[0]);
    setCustomerForm({ name: '', phone: '', address: '', city: 'Bhopal', pincode: '' });
    setShowAddForm(false);
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) {
      toast.error('Please select a product');
      return;
    }
    if (!customerForm.name || !customerForm.phone || !customerForm.address || !customerForm.pincode) {
      toast.error('Please fill all customer and delivery details');
      return;
    }
    addSubscription({
      product: prod,
      frequency,
      quantity,
      customer: { ...customerForm },
      deliverySlot: slot,
      startDate,
    });
    resetForm();
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🗓️ Customer Subscriptions ({subscriptions.length})
        </h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer animate-pulse hover:animate-none"
          >
            <Plus size={15} /> Add Subscription
          </button>
        )}
      </div>
      
      {/* Subscriptions stats cards */}
      <div className="flex gap-4 mb-2">
        <div className={`p-4 rounded-2xl border flex-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className="text-xl font-black text-green-600">{activeSubs.length}</p>
          <p className="text-gray-500 text-xs mt-0.5">Active Deliveries</p>
        </div>
        <div className={`p-4 rounded-2xl border flex-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <p className="text-xl font-black text-gray-400">{cancelledSubs.length}</p>
          <p className="text-gray-500 text-xs mt-0.5">Cancelled Deliveries</p>
        </div>
      </div>

      {/* Add Subscription Form (shown when active) */}
      {showAddForm && (
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-250'}`}>
          <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📅 Add Subscription for Customer
          </h3>
          <form onSubmit={handleSubscribeSubmit} className="space-y-4 text-xs font-semibold">
            <div className="grid sm:grid-cols-2 gap-4">
              
              {/* Product Selector */}
              <div>
                <label className={`block mb-1.5 ${darkMode ? 'text-gray-305' : 'text-gray-600'}`}>Select Product *</label>
                <SearchableSelect
                  value={selectedProductId}
                  onChange={val => setSelectedProductId(val)}
                  options={products.map(p => ({
                    value: p.id,
                    label: `${p.name} (${p.unit}) - ₹${p.price}`
                  }))}
                  darkMode={darkMode}
                  emptyLabel="-- Choose Product --"
                />
              </div>

              {/* Delivery Frequency */}
              <div>
                <label className={`block mb-1.5 ${darkMode ? 'text-gray-305' : 'text-gray-600'}`}>Delivery Frequency *</label>
                <select
                  value={frequency}
                  onChange={e => setFrequency(e.target.value as any)}
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <option value="daily">Everyday (Daily)</option>
                  <option value="weekly">Once a Week</option>
                  <option value="monthly">Once a Month</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className={`block mb-1.5 ${darkMode ? 'text-gray-305' : 'text-gray-600'}`}>Quantity *</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              {/* Preferred Slot */}
              <div>
                <label className={`block mb-1.5 ${darkMode ? 'text-gray-305' : 'text-gray-600'}`}>Preferred Slot *</label>
                <select
                  value={slot}
                  onChange={e => setSlot(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <option value="10 AM – 12 PM">Morning (10 AM - 12 PM)</option>
                  <option value="12 PM – 2 PM">Noon (12 PM - 2 PM)</option>
                  <option value="2 PM – 4 PM">Afternoon (2 PM - 4 PM)</option>
                  <option value="6 PM – 8 PM">Evening (6 PM - 8 PM)</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className={`block mb-1.5 ${darkMode ? 'text-gray-305' : 'text-gray-600'}`}>Start Date *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              {/* Customer Name */}
              <div>
                <label className={`block mb-1.5 ${darkMode ? 'text-gray-305' : 'text-gray-600'}`}>Customer Name *</label>
                <input
                  type="text"
                  value={customerForm.name}
                  onChange={e => setCustomerForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Rahul Sharma"
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              {/* Phone */}
              <div>
                <label className={`block mb-1.5 ${darkMode ? 'text-gray-305' : 'text-gray-605'}`}>Mobile Number *</label>
                <input
                  type="tel"
                  value={customerForm.phone}
                  onChange={e => setCustomerForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="10-digit number"
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-55 border-gray-200'
                  }`}
                />
              </div>

              {/* Pincode */}
              <div>
                <label className={`block mb-1.5 ${darkMode ? 'text-gray-305' : 'text-gray-605'}`}>Pincode *</label>
                <input
                  type="text"
                  value={customerForm.pincode}
                  onChange={e => setCustomerForm(f => ({ ...f, pincode: e.target.value }))}
                  placeholder="462038"
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-55 border-gray-200'
                  }`}
                />
              </div>

              {/* Full Address */}
              <div className="sm:col-span-2">
                <label className={`block mb-1.5 ${darkMode ? 'text-gray-305' : 'text-gray-605'}`}>Full Delivery Address *</label>
                <input
                  type="text"
                  value={customerForm.address}
                  onChange={e => setCustomerForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Flat No, House No, Street name"
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-55 border-gray-205'
                  }`}
                />
              </div>

            </div>

            {/* Admin add form cost calculation */}
            {selectedProductId && (() => {
              const prod = products.find(p => p.id === selectedProductId);
              if (!prod) return null;
              const deliveries = frequency === 'daily' ? 30 : frequency === 'weekly' ? 4 : 1;
              const cost = prod.price * quantity * deliveries;
              return (
                <div className={`p-4 rounded-xl flex items-center justify-between border ${
                  darkMode ? 'bg-green-950/20 border-green-900/30' : 'bg-green-50 border-green-100'
                }`}>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Calculated Monthly Amount</p>
                    <p className="text-[10px] text-green-700 dark:text-green-400 font-medium mt-0.5">
                      ₹{prod.price} × {quantity} Qty × {deliveries} deliveries
                    </p>
                  </div>
                  <span className="text-base font-black text-green-600">₹{cost}</span>
                </div>
              );
            })()}

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Create Subscription
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 font-bold hover:bg-gray-55 dark:hover:bg-gray-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid container with list */}
      <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="p-5 border-b dark:border-gray-700 flex items-center justify-between">
          <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recurring Subscriptions List</h3>
        </div>
        
        {subscriptions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No active or historic subscriptions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  {['Customer', 'Product', 'Frequency', 'Qty', 'Slot', 'Cost / Delivery', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscriptions.map(sub => (
                  <tr key={sub.id} className={`border-t ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <td className="px-4 py-3">
                      <p className={`font-semibold text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>{sub.customer.name}</p>
                      <p className="text-[10px] text-gray-500">{sub.customer.phone}</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[150px]">{sub.customer.address}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={sub.product.image} className="w-8 h-8 rounded-lg object-cover bg-gray-50 border" />
                        <div>
                          <p className={`font-semibold text-xs leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>{sub.product.name}</p>
                          <p className="text-[10px] text-gray-555 mt-0.5">{sub.product.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-xs font-bold text-blue-600">{sub.frequency}</td>
                    <td className="px-4 py-3 text-xs font-bold">{sub.quantity}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{sub.deliverySlot}</td>
                    <td className="px-4 py-3 text-xs font-black text-green-600">₹{sub.product.price * sub.quantity}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBillCustomer({
                            name: sub.customer.name,
                            phone: sub.customer.phone,
                            address: sub.customer.address,
                            city: sub.customer.city || '',
                            pincode: sub.customer.pincode
                          });
                        }}
                        className="px-2 py-1 rounded bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        🧾 Bill
                      </button>
                      {sub.status === 'active' && (
                        <button
                          onClick={() => { cancelSubscription(sub.id); toast.success('Subscription cancelled'); }}
                          className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-650 text-xs font-bold transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedBillCustomer && (
        <SubscriptionInvoiceModal
          customer={selectedBillCustomer}
          onClose={() => setSelectedBillCustomer(null)}
        />
      )}
    </div>
  );
}

function SettingsManager() {
  const { storeSettings, updateStoreSettings, categories, addCategory, updateCategory, deleteCategory, darkMode } = useStore();
  const [form, setForm] = useState({ ...storeSettings });
  const [saved, setSaved] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('📦');
  const [newCatImage, setNewCatImage] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailInput, setTestEmailInput] = useState(storeSettings.email || '');
  const [showAppsScriptCode, setShowAppsScriptCode] = useState(false);

  const handleTestEmailOtp = async () => {
    if (!form.googleSheetWebhookUrl || !form.googleSheetWebhookUrl.trim()) {
      toast.error('Please configure the Webhook URL (Sheet 1) first!');
      return;
    }
    if (!form.googleSheetWebhookUrl.trim().startsWith('https://script.google.com')) {
      toast.error('Invalid Webhook URL. It must start with https://script.google.com');
      return;
    }
    if (!testEmailInput || !testEmailInput.trim().includes('@')) {
      toast.error('Please enter a valid test email address.');
      return;
    }

    setTestingEmail(true);
    const testOtp = Math.floor(1000 + Math.random() * 9000).toString();
    try {
      await fetch(form.googleSheetWebhookUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendSMS',
          gateway: form.smsGateway || 'simulated',
          fast2smsApiKey: form.fast2smsApiKey || '',
          twilioAccountSid: form.twilioAccountSid || '',
          twilioAuthToken: form.twilioAuthToken || '',
          twilioFromNumber: form.twilioFromNumber || '',
          androidSmsToken: form.androidSmsToken || '',
          androidSmsDeviceId: form.androidSmsDeviceId || '',
          shopName: form.shopName || 'Krishna Kirana',
          phone: form.phone ? form.phone.replace(/[\s-+]/g, '').slice(-10) : '',
          email: testEmailInput.trim(),
          otp: testOtp,
        }),
      });
      toast.success(`Test OTP request sent to ${testEmailInput.trim()}! Please check your inbox and spam folder in 1-2 minutes. 📬`);
    } catch (err: any) {
      console.error('Test OTP error:', err);
      toast.error(`Error sending test: ${err.message || err}`);
    } finally {
      setTestingEmail(false);
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toast.error('Category name is required');
      return;
    }
    const slug = newCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const exists = categories.some(c => c.id === slug);
    if (exists) {
      toast.error('Category already exists');
      return;
    }
    addCategory({
      name: newCatName.trim(),
      emoji: newCatEmoji.trim() || '📦',
      color: 'from-green-500 to-emerald-600',
      image: newCatImage.trim(),
    });
    toast.success('Category created successfully!');
    setNewCatName('');
    setNewCatEmoji('📦');
    setNewCatImage('');
  };
  const save = () => {
    const adminPassword = (form.adminPassword || '').trim();
    if (!adminPassword) {
      toast.error('Admin password cannot be empty!');
      return;
    }
    const orderWebhook = (form.googleSheetWebhookUrl || '').trim();
    if (orderWebhook && !orderWebhook.startsWith('https://')) {
      toast.error('Order Webhook URL must use a secure https:// connection!');
      return;
    }
    const catalogWebhook = (form.googleSheetProductsWebhookUrl || '').trim();
    if (catalogWebhook && !catalogWebhook.startsWith('https://')) {
      toast.error('Catalog Webhook URL must use a secure https:// connection!');
      return;
    }
    updateStoreSettings({
      ...form,
      googleSheetWebhookUrl: orderWebhook,
      googleSheetProductsWebhookUrl: catalogWebhook,
    });
    setSaved(true);
    toast.success('✅ Settings saved securely!');
    setTimeout(() => setSaved(false), 3000);
  };

  const inp = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'}`;
  const card = `p-5 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`;
  const lbl = (t: string) => <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t}</label>;
  const hd = (emoji: string, title: string) => <div className="flex items-center gap-2 mb-4"><span className="text-xl">{emoji}</span><h3 className={`font-black text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3></div>;

  return (
    <div className="space-y-5">
      <div className={card}>
        {hd('🏪', 'Shop Information')}
        <div className="grid sm:grid-cols-2 gap-3">
          <div>{lbl('Shop Name')}<input className={inp} value={form.shopName} onChange={e => setForm(f => ({...f, shopName: e.target.value}))} /></div>
          <div>{lbl('Tagline')}<input className={inp} value={form.tagline} onChange={e => setForm(f => ({...f, tagline: e.target.value}))} /></div>
          <div className="sm:col-span-2">{lbl('Shop Address')}<input className={inp} value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} /></div>
          <div className="sm:col-span-2">{lbl('Google Maps Link')}<input className={inp} value={form.mapsLink} onChange={e => setForm(f => ({...f, mapsLink: e.target.value}))} placeholder="https://goo.gl/maps/..." /></div>
          <div>{lbl('Business Hours')}<input className={inp} value={form.businessHours} onChange={e => setForm(f => ({...f, businessHours: e.target.value}))} /></div>
          <div>{lbl('Email')}<input type="email" className={inp} value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} /></div>
        </div>
      </div>

      <div className={card}>
        {hd('📱', 'Contact & WhatsApp & Payment')}
        <div className="grid sm:grid-cols-2 gap-3">
          <div>{lbl('Phone Number (display)')}<input className={inp} value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+91 98765 43210" /></div>
          <div>{lbl('WhatsApp Number (digits only with country code)')}<input className={inp} value={form.whatsapp} onChange={e => setForm(f => ({...f, whatsapp: e.target.value}))} placeholder="919876543210" /></div>
          <div className="sm:col-span-2">{lbl('Shop UPI ID (for QR Code payments)')}<input className={inp} value={form.shopUpiId || ''} onChange={e => setForm(f => ({...f, shopUpiId: e.target.value}))} placeholder="e.g. shopname@okaxis, 9876543210@paytm" /></div>
        </div>
        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>💡 WhatsApp: wa.me/{form.whatsapp} | Shop UPI ID: {form.shopUpiId || 'Not Configured'}</p>
      </div>

      <div className={card}>
        {hd('🏷️', 'Category Management')}
        <form onSubmit={handleCreateCategory} className="space-y-4 mb-4">
          <div className="grid sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              {lbl('New Category Name *')}
              <input 
                className={inp} 
                value={newCatName} 
                onChange={e => setNewCatName(e.target.value)} 
                placeholder="e.g. Sweets, Beverages" 
              />
            </div>
            <div>
              {lbl('Emoji')}
              <input 
                className={inp} 
                value={newCatEmoji} 
                onChange={e => setNewCatEmoji(e.target.value)} 
                placeholder="e.g. 🍬" 
              />
            </div>
            <div>
              {lbl('Image URL / Upload')}
              <div className="flex gap-2 items-center">
                <input 
                  className={inp} 
                  value={newCatImage} 
                  onChange={e => setNewCatImage(e.target.value)} 
                  placeholder="Paste URL or upload..." 
                />
                <label className="flex items-center justify-center p-2.5 rounded-xl border bg-gray-100 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-gray-700 cursor-pointer transition-colors shrink-0">
                  <Upload size={14} className="text-gray-600 dark:text-gray-300" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file, (base64) => setNewCatImage(base64));
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
          <button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer border-none"
          >
            Create Category
          </button>
        </form>
        
        {lbl('Active Categories (Edit Image URL or Upload in real-time):')}
        <div className="grid gap-2 mt-2 max-h-[300px] overflow-y-auto pr-1">
          {categories.map(c => {
            const isBuiltIn = [
              'all', 'rice-atta', 'oils-ghee', 'dal-pulses', 'spices', 'biscuits-snacks',
              'beverages', 'dairy', 'fruits-veggies', 'personal-care', 'cleaning',
              'baby-care', 'frozen', 'instant-food', 'bread-bakery', 'sweets'
            ].includes(c.id);
            return (
              <div 
                key={c.id} 
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border ${
                  darkMode ? 'bg-gray-750 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2 shrink-0 sm:w-1/3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-gray-850 border shrink-0">
                    {c.image ? (
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm">{c.emoji}</span>
                    )}
                  </div>
                  <span className="font-bold text-xs truncate">{c.name}</span>
                </div>
                <div className="flex-1 flex gap-2 items-center">
                  <input
                    type="text"
                    className={`flex-1 px-3 py-1.5 rounded-lg border text-xs outline-none focus:ring-1 focus:ring-green-500 ${
                      darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    placeholder="Customize Image URL..."
                    value={c.image || ''}
                    onChange={e => updateCategory(c.id, { image: e.target.value })}
                  />
                  <label className="flex items-center justify-center p-2 rounded-lg border bg-gray-100 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-gray-700 cursor-pointer transition-colors shrink-0" title="Upload custom image">
                    <Upload size={12} className="text-gray-600 dark:text-gray-300" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, (base64) => updateCategory(c.id, { image: base64 }));
                        }
                      }}
                    />
                  </label>
                  {!isBuiltIn && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete the category "${c.name}"?`)) {
                          deleteCategory(c.id);
                          toast.success(`Category "${c.name}" deleted successfully!`);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 focus:outline-none p-1 shrink-0 bg-transparent border-none cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={card}>
        {hd('🛵', 'Delivery Settings')}
        <div className="grid grid-cols-3 gap-3">
          <div>{lbl('Delivery Fee (₹)')}<input type="number" className={inp} value={form.deliveryFee} onChange={e => setForm(f => ({...f, deliveryFee: Number(e.target.value)}))} /></div>
          <div>{lbl('Free Delivery Above (₹)')}<input type="number" className={inp} value={form.freeDeliveryAbove} onChange={e => setForm(f => ({...f, freeDeliveryAbove: Number(e.target.value)}))} /></div>
          <div>{lbl('Min Order Amount (₹)')}<input type="number" className={inp} value={form.minOrderAmount} onChange={e => setForm(f => ({...f, minOrderAmount: Number(e.target.value)}))} /></div>
        </div>
      </div>

      <div className={card}>
        {hd('📊', 'Google Sheets Integration')}
        <div className="space-y-4">
          <div>
            {lbl('Order & Customer Webhook URL (Sheet 1)')}
            <input 
              className={inp} 
              value={form.googleSheetWebhookUrl} 
              onChange={e => setForm(f => ({...f, googleSheetWebhookUrl: e.target.value}))} 
              placeholder="https://script.google.com/macros/s/.../exec" 
            />
            <p className={`text-[11px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Automatically syncs orders and customer profile details, and sends OTP emails.
            </p>
          </div>
          <div>
            {lbl('Product & Catalog Webhook URL (Sheet 2)')}
            <input 
              className={inp} 
              value={form.googleSheetProductsWebhookUrl || ''} 
              onChange={e => setForm(f => ({...f, googleSheetProductsWebhookUrl: e.target.value}))} 
              placeholder="https://script.google.com/macros/s/.../exec" 
            />
            <p className={`text-[11px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Syncs product catalog (images, price, stock, category) and store settings.
            </p>
          </div>
        </div>

        {/* Copy Apps Script section */}
        <div className={`mt-4 p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <span className="font-bold text-xs flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
              ⚙️ Google Apps Script Webhook Code
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(APPS_SCRIPT_CODE);
                toast.success('📋 Webhook code copied to clipboard!');
              }}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg shadow-sm active:scale-95 transition-transform w-fit"
            >
              Copy Script Code
            </button>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
            Copy this script, paste it in Google Sheet Apps Script, and deploy as Web App.
          </p>
          <button
            type="button"
            onClick={() => setShowAppsScriptCode(!showAppsScriptCode)}
            className="text-xs text-blue-600 hover:text-blue-700 hover:underline focus:outline-none mb-2 block font-medium"
          >
            {showAppsScriptCode ? 'Hide Code' : '👁️ Show / Preview Webhook Code'}
          </button>
          {showAppsScriptCode && (
            <textarea
              readOnly
              value={APPS_SCRIPT_CODE}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              className={`w-full h-48 text-[10px] font-mono p-2.5 rounded-lg border focus:outline-none ${darkMode ? 'bg-gray-900 border-gray-700 text-green-400' : 'bg-white border-gray-300 text-green-800'}`}
            />
          )}
        </div>

        {/* Test OTP Email delivery section */}
        {form.googleSheetWebhookUrl && form.googleSheetWebhookUrl.startsWith('https://script.google.com') && (
          <div className={`mt-4 p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-emerald-50/40 border-emerald-200'}`}>
            <p className="font-bold text-xs mb-1.5 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              📬 Test OTP Email Delivery
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
              Enter your email and click test to verify if your script is deployed correctly and can send OTP codes:
            </p>
            <div className="flex gap-2 max-w-md">
              <input
                type="email"
                className={`flex-1 text-xs py-1.5 px-3 rounded-lg border focus:outline-none focus:ring-1 ${darkMode ? 'bg-gray-700 border-gray-600 focus:ring-emerald-500' : 'bg-white border-gray-300 focus:ring-emerald-500'}`}
                placeholder="name@gmail.com"
                value={testEmailInput}
                onChange={e => setTestEmailInput(e.target.value)}
              />
              <button
                type="button"
                disabled={testingEmail}
                onClick={handleTestEmailOtp}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50 active:scale-95 transition-all flex items-center gap-1.5"
              >
                {testingEmail ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Sending...
                  </>
                ) : 'Send Test OTP'}
              </button>
            </div>
          </div>
        )}

        <div className={`mt-4 p-4 rounded-xl text-xs space-y-2.5 ${darkMode ? 'bg-gray-700/60 text-gray-300' : 'bg-blue-50 text-blue-800'}`}>
          <p className="font-bold text-sm">📋 One-time Setup Instructions (2 minutes):</p>
          
          <div className="space-y-1">
            <p className="font-semibold text-green-600 dark:text-green-400">📂 Sheet 1: Orders, Customers & Email Verification</p>
            <p className="pl-3">1. Create a Google Sheet. Name it e.g., <i>"Krishna Kirana - Orders & Customers"</i>.</p>
            <p className="pl-3">2. Go to <b>Extensions → Apps Script</b>, paste the code copied from the button above, and click Save.</p>
            <p className="pl-3">
              3. Click <b>Deploy → New Deployment</b>. Click the gear icon next to "Select type" and choose <b>Web App</b>.
            </p>
            <div className="pl-6 py-1 bg-yellow-100/50 dark:bg-yellow-950/20 border-l-2 border-yellow-500 text-[11px] text-yellow-900 dark:text-yellow-300 my-1 rounded">
              <span className="font-bold">⚠️ CRITICAL PERMISSION CONFIGURATION:</span>
              <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                <li>Set <b>"Execute as"</b> to <b>"Me (your-email@gmail.com)"</b></li>
                <li>Set <b>"Who has access"</b> to <b>"Anyone"</b></li>
                <li>When prompted, click <i>"Authorize access"</i> and allow the required Gmail & Sheets access permissions.</li>
              </ul>
            </div>
            <p className="pl-3">4. Deploy and copy the Web App URL into the first field above.</p>
          </div>

          <div className="space-y-1 pt-1.5 border-t border-dashed border-gray-500/20">
            <p className="font-semibold text-green-600 dark:text-green-400">🏷️ Sheet 2: Products & Catalog (Optional)</p>
            <p className="pl-3">1. Create a separate Google Sheet (or use the same one). Name it e.g., <i>"Krishna Kirana - Catalog"</i>.</p>
            <p className="pl-3">2. Go to <b>Extensions → Apps Script</b>, paste the same webhook code, and click Save.</p>
            <p className="pl-3">3. Deploy as a Web App (using the exact same permission settings) and paste the Web App URL into the second field above.</p>
          </div>

          <div className="pt-1.5 border-t border-dashed border-gray-500/20">
            <p className="italic text-[11px] opacity-90">
              💡 <b>Tip:</b> If you want to keep everything in a single Google Sheet, you can paste the same webhook URL in both fields.
            </p>
          </div>
          
          {(form.googleSheetWebhookUrl || form.googleSheetProductsWebhookUrl) && (
            <p className="text-green-600 font-bold mt-1.5 flex items-center gap-1 text-[11px]">
              <span>💡 Remember to click "Save All Settings" below to apply!</span>
            </p>
          )}
        </div>
      </div>

      <div className={card}>
        {hd('💬', 'SMS OTP Gateway Settings')}
        <div className="space-y-4">
          <div>
            {lbl('SMS OTP Gateway Mode')}
            <select
              className={inp}
              value={form.smsGateway || 'simulated'}
              onChange={e => setForm(f => ({...f, smsGateway: e.target.value as any}))}
            >
              <option value="simulated">Simulated / Mock Toast (For Testing / Free Demo)</option>
              <option value="fast2sms">Fast2SMS Gateway (India Dev Route)</option>
              <option value="twilio">Twilio SMS Gateway (Global Route)</option>
              <option value="android">Android SMS Gateway (100% Free via SemySMS)</option>
            </select>
            <p className={`text-[11px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Select 'Simulated' for offline / mock OTP popups. Choose Twilio, Fast2SMS, or Android Gateway for actual mobile SMS dispatch.
            </p>
          </div>

          {form.smsGateway === 'android' && (
            <div className="p-4 border border-teal-500/20 rounded-xl bg-teal-50/10 space-y-3 animate-fade-up">
              <p className="text-xs text-teal-700 dark:text-teal-400 font-bold flex items-center gap-1">
                📱 100% Free Android SMS Gateway (SemySMS.net) Setup:
              </p>
              <ol className="list-decimal list-inside text-[11px] text-gray-500 dark:text-gray-400 space-y-1.5 pl-1 leading-relaxed">
                <li>Register a free account on <a href="https://semysms.net" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline font-semibold">SemySMS.net</a>.</li>
                <li>Download their free Android app from the SemySMS website and install it on your phone.</li>
                <li>Log in to the app on your phone. Copy your <b>API Token</b> and <b>Device ID</b> from the SemySMS dashboard.</li>
                <li>Paste them below. The website will automatically use your phone's free SIM SMS pack to send OTP codes!</li>
              </ol>
              <div className="grid sm:grid-cols-2 gap-3 mt-1">
                <div>
                  {lbl('SemySMS API Token')}
                  <input
                    type="password"
                    className={inp}
                    value={form.androidSmsToken || ''}
                    onChange={e => setForm(f => ({...f, androidSmsToken: e.target.value}))}
                    placeholder="Enter SemySMS Token"
                  />
                </div>
                <div>
                  {lbl('SemySMS Device ID')}
                  <input
                    className={inp}
                    value={form.androidSmsDeviceId || ''}
                    onChange={e => setForm(f => ({...f, androidSmsDeviceId: e.target.value}))}
                    placeholder="e.g. 12345"
                  />
                </div>
              </div>
            </div>
          )}

          {form.smsGateway === 'fast2sms' && (
            <div className="p-4 border border-green-500/20 rounded-xl bg-green-50/10 space-y-3">
              <div>
                {lbl('Fast2SMS Authorization API Key')}
                <input
                  type="password"
                  className={inp}
                  value={form.fast2smsApiKey || ''}
                  onChange={e => setForm(f => ({...f, fast2smsApiKey: e.target.value}))}
                  placeholder="Enter Fast2SMS API Authorization Token"
                />
                <p className={`text-[11px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Get your authorization token from the Fast2SMS Dashboard (offers ₹50 free testing balance).
                </p>
              </div>
            </div>
          )}

          {form.smsGateway === 'twilio' && (
            <div className="p-4 border border-blue-500/20 rounded-xl bg-blue-50/10 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  {lbl('Twilio Account SID')}
                  <input
                    className={inp}
                    value={form.twilioAccountSid || ''}
                    onChange={e => setForm(f => ({...f, twilioAccountSid: e.target.value}))}
                    placeholder="AC..."
                  />
                </div>
                <div>
                  {lbl('Twilio Auth Token')}
                  <input
                    type="password"
                    className={inp}
                    value={form.twilioAuthToken || ''}
                    onChange={e => setForm(f => ({...f, twilioAuthToken: e.target.value}))}
                    placeholder="Enter Twilio Auth Token"
                  />
                </div>
              </div>
              <div>
                {lbl('Twilio Sender Phone Number ("From" Number)')}
                <input
                  className={inp}
                  value={form.twilioFromNumber || ''}
                  onChange={e => setForm(f => ({...f, twilioFromNumber: e.target.value}))}
                  placeholder="e.g. +18559092809"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={card}>
        {hd('🔒', 'Admin Password')}
        <div>{lbl('Change Admin Password')}<input type="password" className={inp} value={form.adminPassword} onChange={e => setForm(f => ({...f, adminPassword: e.target.value}))} placeholder="New password" /></div>
        <p className={`text-xs mt-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Current password is saved in your browser. Don't forget the new password!</p>
      </div>

      <button onClick={save} className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-base shadow-lg transition-all ${saved ? 'bg-green-500 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
        {saved ? '✅ All Settings Saved!' : '💾 Save All Settings'}
      </button>
    </div>
  );
}

function BranchesManager({ setActiveTab, setBranchFilter }: { setActiveTab: (t: string) => void; setBranchFilter: (b: string) => void }) {
  const { branches = [], addBranch, updateBranch, deleteBranch, darkMode, products = [] } = useStore();
  const getProductCount = (branchId: string) => {
    return (products || []).filter(p => p.storeId === branchId || (branchId === 'main' && (!p.storeId || p.storeId === 'main'))).length;
  };
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    upiId: '',
    address: '',
    isActive: true,
  });

  const resetForm = () => {
    setForm({ name: '', phone: '', whatsapp: '', upiId: '', address: '', isActive: true });
    setShowAddForm(false);
    setEditingBranchId(null);
  };

  const handleSave = () => {
    const name = (form.name || '').trim();
    const phone = (form.phone || '').trim();
    const address = (form.address || '').trim();
    if (!name || !phone || !address) {
      toast.error('Name, Phone and Address are required');
      return;
    }

    const cleanForm = {
      name,
      phone,
      whatsapp: (form.whatsapp || '').trim() || phone,
      upiId: (form.upiId || '').trim() || undefined,
      address,
      isActive: !!form.isActive,
    };

    if (editingBranchId) {
      updateBranch(editingBranchId, cleanForm);
      toast.success('Branch updated successfully! 🏪');
    } else {
      addBranch(cleanForm);
      toast.success('Branch created successfully! 🎉');
    }
    resetForm();
  };

  const handleEdit = (b: typeof branches[0]) => {
    if (!b) return;
    setEditingBranchId(b.id);
    setForm({
      name: b.name || '',
      phone: b.phone || '',
      whatsapp: b.whatsapp || '',
      upiId: b.upiId || '',
      address: b.address || '',
      isActive: !!b.isActive,
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (id === 'main') {
      toast.error('Cannot delete the main branch');
      return;
    }
    if (window.confirm(`Are you sure you want to delete branch "${name}"?`)) {
      deleteBranch(id);
      toast.success('Branch deleted');
    }
  };

  const inp = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-500 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'
  }`;

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🏪 Store Branches / Partners ({branches.length})
        </h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-all cursor-pointer"
          >
            <Plus size={15} /> Add Store / Branch
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {showAddForm && (
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🏪 {editingBranchId ? 'Edit Store Branch' : 'Add Store / Branch'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Store/Seller Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Bhopal Old Town Branch"
                className={inp}
              />
            </div>
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mobile Number *</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="e.g. +91 98765 43210"
                className={inp}
              />
            </div>
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>WhatsApp (Optional)</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                placeholder="e.g. 919876543210"
                className={inp}
              />
            </div>
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>UPI ID for Direct Payment (Optional)</label>
              <input
                type="text"
                value={form.upiId}
                onChange={e => setForm(f => ({ ...f, upiId: e.target.value }))}
                placeholder="e.g. branchname@paytm"
                className={inp}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Store Address *</label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="Shop No. 12, Market Area, Bhopal"
                className={inp}
              />
            </div>
            <div className="sm:col-span-2 flex items-center justify-between p-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
              <div>
                <span className={`text-xs font-bold block ${darkMode ? 'text-white' : 'text-gray-900'}`}>Is Branch Active?</span>
                <span className="text-[10px] text-gray-500">Inactive branches won't be visible to customers</span>
              </div>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  form.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {form.isActive ? '✓ Active' : '✗ Inactive'}
              </button>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-bold shadow-md transition-all"
            >
              {editingBranchId ? 'Save Changes' : 'Create Store Branch'}
            </button>
            <button
              onClick={resetForm}
              className={`px-4 py-2.5 rounded-xl text-sm border ${
                darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Branches List */}
      <div className="grid sm:grid-cols-2 gap-4">
        {branches.map(b => (
          <div
            key={b.id}
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-lg ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{b.name}</h4>
                  <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                    b.id === 'main' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {b.id === 'main' ? 'Primary Branch' : `Partner ID: ${b.id}`}
                  </span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  b.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {b.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="space-y-1.5 text-xs mt-3 text-gray-500 dark:text-gray-400">
                <p>📞 Phone: <span className="font-semibold text-gray-700 dark:text-gray-200">{b.phone}</span></p>
                <p>💬 WhatsApp: <span className="font-semibold text-gray-700 dark:text-gray-200">{b.whatsapp}</span></p>
                {b.upiId && <p>💳 UPI ID: <span className="font-mono font-semibold text-gray-700 dark:text-gray-200">{b.upiId}</span></p>}
                <p>📍 Address: <span className="font-semibold text-gray-700 dark:text-gray-200">{b.address}</span></p>
                <p className="flex items-center gap-1.5 pt-1 font-bold text-green-600 dark:text-green-400">
                  📦 Products In Store: <span className="px-2 py-0.5 bg-green-50 dark:bg-green-950/30 rounded-md">{getProductCount(b.id)} items</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-150 dark:border-gray-700">
              <button
                onClick={() => {
                  setBranchFilter(b.id);
                  setActiveTab('products');
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold ${
                  darkMode ? 'bg-green-950/20 text-green-400 hover:bg-green-900/30' : 'bg-green-50 text-green-650 hover:bg-green-100'
                }`}
              >
                🔍 View Inventory
              </button>
              <button
                onClick={() => handleEdit(b)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                  darkMode ? 'bg-gray-750 text-blue-400 hover:bg-gray-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
                title="Edit Branch"
              >
                <Edit2 size={12} />
              </button>
              {b.id !== 'main' && (
                <button
                  onClick={() => handleDelete(b.id, b.name)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                    darkMode ? 'bg-gray-750 text-red-400 hover:bg-gray-700' : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                  title="Delete Branch"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BannersManager() {
  const { banners = [], addBanner, updateBanner, deleteBanner, products, categories, darkMode } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialForm = {
    title: '',
    subtitle: '',
    badge: '',
    cta: '',
    bg: 'from-green-600 via-green-700 to-emerald-800',
    emoji: '',
    image: '',
    linkProduct: '',
    linkCategory: '',
  };

  const [form, setForm] = useState(initialForm);
  const [customBg, setCustomBg] = useState('');

  const resetForm = () => {
    setForm(initialForm);
    setCustomBg('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (banner: HomeBanner) => {
    const isPreset = [
      'from-green-600 via-green-700 to-emerald-800',
      'from-orange-500 via-red-500 to-pink-600',
      'from-purple-600 via-indigo-600 to-blue-700',
      'from-pink-500 via-rose-500 to-red-650',
      'from-amber-500 via-orange-500 to-yellow-600',
    ].includes(banner.bg || '');

    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      badge: banner.badge || '',
      cta: banner.cta || '',
      bg: isPreset ? (banner.bg || '') : 'custom',
      emoji: banner.emoji || '',
      image: banner.image || '',
      linkProduct: banner.linkProduct || '',
      linkCategory: banner.linkCategory || '',
    });

    if (!isPreset && banner.bg) {
      setCustomBg(banner.bg);
    } else {
      setCustomBg('');
    }

    setEditingId(banner.id);
    setShowForm(true);
  };

  const handleSave = () => {
    const title = (form.title || '').trim();
    if (!title) {
      toast.error('Banner Title is required! 🏷️');
      return;
    }

    const finalBg = form.bg === 'custom' ? (customBg || '').trim() : form.bg;

    const bannerData = {
      title,
      subtitle: (form.subtitle || '').trim(),
      badge: (form.badge || '').trim() || undefined,
      cta: (form.cta || '').trim() || undefined,
      bg: finalBg || undefined,
      emoji: (form.emoji || '').trim() || undefined,
      image: form.image || undefined,
      linkProduct: form.linkProduct || undefined,
      linkCategory: form.linkCategory || undefined,
    };

    if (editingId) {
      updateBanner(editingId, bannerData);
    } else {
      addBanner(bannerData);
    }
    resetForm();
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete banner "${title}"?`)) {
      deleteBanner(id);
    }
  };

  const presetGradients = [
    { label: 'Emerald Oasis (Green)', value: 'from-green-600 via-green-700 to-emerald-800' },
    { label: 'Sunset Glow (Orange)', value: 'from-orange-500 via-red-500 to-pink-600' },
    { label: 'Ocean Breeze (Blue)', value: 'from-blue-600 via-indigo-600 to-blue-700' },
    { label: 'Berry Punch (Pink)', value: 'from-pink-500 via-rose-500 to-red-650' },
    { label: 'Golden Sunrise (Amber)', value: 'from-amber-500 via-orange-500 to-yellow-600' },
    { label: 'Custom CSS Gradient', value: 'custom' },
  ];

  const inp = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-500 ${
    darkMode ? 'bg-gray-750 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'
  }`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Banner Campaigns</h2>
          <p className="text-gray-500 text-sm">Create high-impact promotional sliders at the top of the homepage</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} /> Create Banner
          </button>
        )}
      </div>

      {showForm && (
        <div className={`p-6 rounded-3xl border shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`font-bold mb-4 text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {editingId ? 'Edit Promotion Banner' : 'Create Promotion Banner'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Banner Title *</label>
              <textarea
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Fresh Groceries&#10;Delivered in 30 Mins"
                rows={2}
                className={inp}
              />
              <span className="text-[10px] text-gray-500">Supports line-breaks. Use Enter to split text beautifully.</span>
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subtitle / Offer Details</label>
              <textarea
                value={form.subtitle}
                onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                placeholder="Quality products at unbeatable prices"
                rows={2}
                className={inp}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Badge Label</label>
              <input
                type="text"
                value={form.badge}
                onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                placeholder="⚡ EXPRESS DELIVERY"
                className={inp}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>CTA Button Text</label>
              <input
                type="text"
                value={form.cta}
                onChange={e => setForm(f => ({ ...f, cta: e.target.value }))}
                placeholder="Shop Now"
                className={inp}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Banner Gradient Style</label>
              <select
                value={form.bg}
                onChange={e => setForm(f => ({ ...f, bg: e.target.value }))}
                className={inp}
              >
                {presetGradients.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            {form.bg === 'custom' && (
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Custom CSS / Tailwind Classes</label>
                <input
                  type="text"
                  value={customBg}
                  onChange={e => setCustomBg(e.target.value)}
                  placeholder="from-purple-600 via-pink-600 to-red-500"
                  className={inp}
                />
              </div>
            )}

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Banner Emoji Icon (Optional)</label>
              <input
                type="text"
                value={form.emoji}
                onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                placeholder="🥦 or 🍎"
                className={inp}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Link to Category (Optional)</label>
              <select
                value={form.linkCategory}
                onChange={e => setForm(f => ({ ...f, linkCategory: e.target.value, linkProduct: '' }))}
                className={inp}
              >
                <option value="">No link redirection</option>
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Link to Product (Optional)</label>
              <SearchableSelect
                value={form.linkProduct}
                onChange={val => setForm(f => ({ ...f, linkProduct: val, linkCategory: '' }))}
                options={products.map(p => ({
                  value: p.name,
                  label: `${p.name} (₹${p.price})`
                }))}
                darkMode={darkMode}
                emptyLabel="No link redirection"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Banner Background Image (Base64 file or paste image clipboard)
              </label>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, base64 => setForm(f => ({ ...f, image: base64 })));
                    }}
                    className={inp}
                  />
                  <input
                    type="text"
                    placeholder="Or click here and press Ctrl+V to paste an image..."
                    onPaste={e => handleImagePaste(e, base64 => setForm(f => ({ ...f, image: base64 })))}
                    className={`${inp} mt-2`}
                  />
                </div>
                {form.image && (
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 flex items-center justify-center">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, image: '' }))}
                      className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              {editingId ? 'Save Changes' : 'Create Banner Campaign'}
            </button>
            <button
              onClick={resetForm}
              className={`px-4 py-2.5 rounded-xl text-sm border cursor-pointer ${
                darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active Banners Display */}
      <div className="space-y-4">
        <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Active Banner Campaigns ({banners.length})
        </h3>
        {banners.length === 0 ? (
          <div className={`p-8 text-center rounded-2xl border border-dashed ${darkMode ? 'bg-gray-905 border-gray-700 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
            <ImageIcon className="mx-auto mb-2 opacity-50" size={28} />
            <p className="text-sm font-medium">No custom banners set.</p>
            <p className="text-xs opacity-75 mt-1">Store is currently showing default placeholder banners.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {banners.map((b) => {
              return (
                <div
                  key={b.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Tiny preview */}
                    <div className={`w-28 h-20 rounded-xl overflow-hidden relative flex-shrink-0 flex items-center justify-center text-white bg-gradient-to-br ${b.bg || 'from-green-600 to-emerald-800'}`}>
                      {b.image && (
                        <img src={b.image} alt={b.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                      )}
                      <div className="relative z-10 text-center p-1">
                        {b.emoji && <div className="text-lg">{b.emoji}</div>}
                        <div className="text-[9px] font-black leading-tight line-clamp-2" style={{ whiteSpace: 'pre-line' }}>{b.title}</div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-black tracking-wide ${
                          darkMode ? 'bg-green-950/40 text-green-400 border border-green-900/50' : 'bg-green-50 text-green-700'
                        }`}>
                          {b.badge || 'PROMOTION'}
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleEdit(b)}
                            className="text-blue-500 hover:text-blue-600 p-0.5"
                            title="Edit Banner"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id, b.title)}
                            className="text-red-500 hover:text-red-650 p-0.5"
                            title="Delete Banner"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <h4 className={`text-xs font-bold line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{b.title.replace('\n', ' ')}</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">{b.subtitle || 'No description'}</p>
                      <div className="text-[9px] text-gray-450 dark:text-gray-500 pt-1 space-y-0.5">
                        {b.linkCategory && <p>🔗 Links Category: <span className="font-semibold text-gray-600 dark:text-gray-300">{b.linkCategory}</span></p>}
                        {b.linkProduct && <p>🔗 Links Search: <span className="font-semibold text-gray-600 dark:text-gray-300">{b.linkProduct}</span></p>}
                        {!b.linkCategory && !b.linkProduct && <p className="italic">No links attached</p>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StockRequestsManager() {
  const { stockRequests = [], deleteStockRequest, clearStockRequests, updateProduct, products, darkMode } = useStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'notified'>('all');
  const [search, setSearch] = useState('');

  const filteredRequests = stockRequests.filter(r => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch = 
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.customerContact.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = stockRequests.filter(r => r.status === 'pending').length;
  const notifiedCount = stockRequests.filter(r => r.status === 'notified').length;

  const handleRestock = (productId: string) => {
    updateProduct(productId, { inStock: true });
  };

  return (
    <div className={`p-6 rounded-3xl border shadow-premium ${
      darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
    }`}>
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Stock & Restock Requests</h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold">
            Track products that customers are requesting to buy but are currently out of stock.
          </p>
        </div>

        {/* Clear Button */}
        {stockRequests.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all requests?')) {
                clearStockRequests();
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl transition-all self-start md:self-center"
          >
            Clear All Requests
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-2xl border ${
          darkMode ? 'bg-gray-950/40 border-gray-800' : 'bg-gray-50 border-gray-150'
        }`}>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Requests</div>
          <div className="text-2xl font-black mt-1 text-[#2ECC71]">{stockRequests.length}</div>
        </div>
        <div className={`p-4 rounded-2xl border ${
          darkMode ? 'bg-gray-950/40 border-gray-800' : 'bg-gray-50 border-gray-150'
        }`}>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Pending Alerts</div>
          <div className="text-2xl font-black mt-1 text-orange-500">{pendingCount}</div>
        </div>
        <div className={`p-4 rounded-2xl border ${
          darkMode ? 'bg-gray-950/40 border-gray-800' : 'bg-gray-50 border-gray-150'
        }`}>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Customers Notified</div>
          <div className="text-2xl font-black mt-1 text-blue-500">{notifiedCount}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-5">
        {/* Tabs Filter */}
        <div className={`flex p-1 rounded-xl gap-1 shrink-0 ${
          darkMode ? 'bg-gray-950' : 'bg-gray-105'
        }`}>
          {(['all', 'pending', 'notified'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer border-none outline-none ${
                filter === f
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-450 hover:text-gray-950 dark:hover:text-white bg-transparent'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search request or customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-xl border font-semibold text-xs transition-all focus:outline-none focus:ring-1 focus:ring-green-500 ${
              darkMode 
                ? 'bg-gray-950 border-gray-800 text-white placeholder-gray-600' 
                : 'bg-white border-gray-200 text-gray-850 placeholder-gray-400 shadow-sm'
            }`}
          />
        </div>
      </div>

      {/* Table / Grid list */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-3xl border-gray-250 dark:border-gray-800">
          <p className="text-gray-400 text-sm font-semibold">No stock requests found matching criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] font-black uppercase tracking-wider ${
                darkMode ? 'border-gray-800 text-gray-400' : 'border-gray-150 text-gray-550'
              }`}>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Date Requested</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800/80">
              {filteredRequests.map(req => {
                const prod = products.find(p => p.id === req.productId);
                const isCurrentInStock = prod ? prod.inStock : false;

                return (
                  <tr key={req.id} className={`text-xs hover:bg-gray-55/50 dark:hover:bg-gray-800/20 transition-all ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={req.productImage || 'https://placehold.co/50x50/2ecc71/ffffff?text=P'} 
                          alt={req.productName} 
                          className="w-10 h-10 rounded-lg object-contain bg-white border border-gray-200 dark:border-gray-800 p-1"
                        />
                        <div>
                          <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {req.productName}
                          </div>
                          <div className="text-[10px] text-gray-450 dark:text-gray-400 flex items-center gap-1.5 mt-0.5 font-bold">
                            ID: <span className="font-mono">{req.productId}</span>
                            <span className="opacity-40">|</span>
                            {isCurrentInStock ? (
                              <span className="text-[#2ECC71] font-black">In Stock</span>
                            ) : (
                              <span className="text-red-500 font-black">Out of Stock</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {req.customerName}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                          {req.customerContact}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-450">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.8 rounded-lg font-black text-[9px] uppercase tracking-wide ${
                        req.status === 'pending'
                          ? 'bg-orange-50 text-orange-500 border border-orange-200 dark:bg-orange-950/20 dark:border-orange-900/30'
                          : 'bg-blue-55 text-blue-600 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/30'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {req.status === 'pending' && (
                          <button
                            onClick={() => handleRestock(req.productId)}
                            className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer border-none outline-none"
                            title="Mark Product In Stock & Notify Customer"
                          >
                            Mark In Stock & Notify
                          </button>
                        )}
                        <button
                          onClick={() => deleteStockRequest(req.id)}
                          className="text-red-500 hover:text-red-650 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer border-none bg-transparent"
                          title="Delete Request"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { adminLoggedIn, adminLogout, setAdminView, setCurrentPage, darkMode, orders, stockRequests = [] } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [branchFilter, setBranchFilter] = useState('all');

  if (!adminLoggedIn) return <LoginForm />;

  const views = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'stock-requests', label: 'Stock Requests', icon: Bell },
    { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw },
    { id: 'customers', label: 'Customers', icon: DollarSign },
    { id: 'branches', label: 'Branches', icon: Store },
    { id: 'settings', label: 'Settings', icon: Save },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Admin Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentPage('home')} className={`p-2 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
              <ChevronLeft size={18} />
            </button>
            <img src="/logo.png" alt="logo" className="h-10 w-10 object-contain" />
            <div>
              <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin Panel</h1>
              <p className="text-gray-500 text-sm">Krishna Kirana Management</p>
            </div>
          </div>
          <button
            onClick={() => { adminLogout(); toast.success('Logged out successfully'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>

        {/* Nav Tabs */}
        <div className={`flex gap-1 mb-6 p-1 rounded-2xl overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => {
                setActiveTab(v.id);
                if (v.id !== 'subscriptions') {
                  setAdminView(v.id as any);
                }
              }}
              className={`flex-1 min-w-fit flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === v.id
                  ? 'bg-green-600 text-white shadow-md'
                  : darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <v.icon size={15} />
              <span className="hidden sm:block">{v.label}</span>
              {v.id === 'orders' && orders.filter(o => o.status === 'pending').length > 0 && (
                <span className="bg-orange-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {orders.filter(o => o.status === 'pending').length}
                </span>
              )}
              {v.id === 'stock-requests' && stockRequests.filter(r => r.status === 'pending').length > 0 && (
                <span className="bg-orange-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {stockRequests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'products' && <ProductsManager branchFilter={branchFilter} setBranchFilter={setBranchFilter} />}
        {activeTab === 'banners' && <BannersManager />}
        {activeTab === 'orders' && <OrdersManager />}
        {activeTab === 'stock-requests' && <StockRequestsManager />}
        {activeTab === 'subscriptions' && <SubscriptionsManager />}
        {activeTab === 'customers' && <CustomersManager />}
        {activeTab === 'branches' && <BranchesManager setActiveTab={setActiveTab} setBranchFilter={setBranchFilter} />}
        {activeTab === 'settings' && <SettingsManager />}
      </div>
    </div>
  );
}
