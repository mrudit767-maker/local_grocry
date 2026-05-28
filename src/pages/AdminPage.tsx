import { useState } from 'react';
import {
  LogOut, Package, ShoppingBag, DollarSign, TrendingUp,
  Plus, Edit2, Trash2, X, ChevronLeft, Download, Search,
  Image as ImageIcon, Link, Star, ToggleLeft, ToggleRight, Save
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Product, CATEGORIES } from '../data/products';
import { Order } from '../store/useStore';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
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
            <p className="text-gray-400 text-xs mt-1">Hint: admin123</p>
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
  const { products, orders, darkMode } = useStore();
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
          {CATEGORIES.filter(c => c.id !== 'all').map(cat => {
            const count = products.filter(p => p.category === cat.id).length;
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
}

const EMPTY_EDIT: EditForm = {
  name: '', category: 'rice-atta', subcategory: '', price: '', mrp: '',
  unit: '', badge: '', image: '', description: '', rating: '4.0', inStock: true,
};

function ProductsManager() {
  const { products, updateProduct, deleteProduct, addProduct, darkMode } = useStore();
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

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || p.category === category;
    return matchSearch && matchCat;
  });

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setImagePreviewError(false);
    setEditForm({
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price.toString(),
      mrp: p.mrp.toString(),
      unit: p.unit,
      badge: p.badge || '',
      image: p.image || '',
      description: p.description || '',
      rating: p.rating.toString(),
      inStock: p.inStock,
    });
  };

  const saveEdit = () => {
    if (!editProduct) return;
    const price = parseFloat(editForm.price);
    const mrp = parseFloat(editForm.mrp);
    const rating = parseFloat(editForm.rating);
    if (!editForm.name.trim()) { toast.error('Product name is required'); return; }
    if (isNaN(price) || price <= 0) { toast.error('Enter a valid price'); return; }
    if (isNaN(mrp) || mrp <= 0) { toast.error('Enter a valid MRP'); return; }
    updateProduct(editProduct.id, {
      name: editForm.name.trim(),
      category: editForm.category,
      subcategory: editForm.subcategory.trim(),
      price,
      mrp,
      unit: editForm.unit.trim(),
      badge: editForm.badge.trim() || undefined,
      image: editForm.image.trim() || editProduct.image,
      description: editForm.description.trim() || editForm.name.trim(),
      rating: isNaN(rating) ? 4.0 : Math.min(5, Math.max(0, rating)),
      inStock: editForm.inStock,
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
    if (!newProduct.name || !newProduct.price || !newProduct.mrp || !newProduct.unit) {
      toast.error('Fill all required fields');
      return;
    }
    const fallbackImage = `https://placehold.co/200x200/16a34a/ffffff?text=${encodeURIComponent(newProduct.name.slice(0, 2).toUpperCase())}`;
    addProduct({
      name: newProduct.name,
      category: newProduct.category,
      subcategory: newProduct.subcategory || newProduct.category,
      price: parseFloat(newProduct.price),
      mrp: parseFloat(newProduct.mrp),
      unit: newProduct.unit,
      badge: newProduct.badge || undefined,
      image: newProduct.imageUrl.trim() || fallbackImage,
      rating: 4.0,
      reviews: 100,
      inStock: true,
      description: newProduct.description || newProduct.name,
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
                      <ImageIcon size={13} /> Product Image URL
                    </label>
                    <div className="relative">
                      <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="url"
                        value={editForm.image}
                        onChange={e => {
                          setEditForm(f => ({ ...f, image: e.target.value }));
                          setImagePreviewError(false);
                        }}
                        placeholder="https://example.com/product-image.jpg"
                        className={`w-full pl-8 pr-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-500 ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <p className={`text-[11px] mt-1.5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      💡 Paste any image URL — Google Images, Unsplash, your own server. The preview updates automatically.
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
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Product Name *</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Aashirvaad Atta 5kg" className={inp(darkMode)} />
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category *</label>
                  <select value={editForm.category} onChange={e => setEditForm(f => ({...f, category: e.target.value}))} className={inp(darkMode)}>
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subcategory</label>
                  <input type="text" value={editForm.subcategory} onChange={e => setEditForm(f => ({...f, subcategory: e.target.value}))} placeholder="e.g. Atta, Basmati Rice" className={inp(darkMode)} />
                </div>
              </div>

              {/* ── Pricing ── */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price (₹) *</label>
                  <input type="number" value={editForm.price} onChange={e => setEditForm(f => ({...f, price: e.target.value}))} placeholder="299" className={inp(darkMode)} />
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
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
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
              <ImageIcon size={13} /> Product Image URL <span className="font-normal text-gray-400">(optional — paste from Google Images, etc.)</span>
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
              <div className="flex-1">
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={e => {
                    setNewProduct(p => ({...p, imageUrl: e.target.value}));
                    setNewImageError(false);
                  }}
                  placeholder="https://example.com/product.jpg"
                  className={`w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-green-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                  }`}
                />
                {newProduct.imageUrl && !newImageError && <p className="text-[11px] text-green-600 font-semibold mt-1">✅ Image loaded</p>}
                {newImageError && <p className="text-[11px] text-red-500 mt-1">❌ Cannot load image — check URL</p>}
                {!newProduct.imageUrl && <p className="text-[11px] text-gray-400 mt-1">Leave blank to use an auto-generated placeholder</p>}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: 'name', label: 'Product Name *', placeholder: 'e.g. Aashirvaad Atta' },
              { key: 'subcategory', label: 'Subcategory', placeholder: 'e.g. Atta' },
              { key: 'unit', label: 'Unit *', placeholder: 'e.g. 5 kg, 1 L' },
              { key: 'price', label: 'Price (₹) *', placeholder: 'e.g. 299' },
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
            <div>
              <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Category *</label>
              <select
                value={newProduct.category}
                onChange={e => setNewProduct(p => ({...p, category: e.target.value}))}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
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
                {['Image', 'Product', 'Category', 'Price', 'MRP', 'Unit', 'Stock', 'Actions'].map(h => (
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
                  <td className={`px-4 py-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {CATEGORIES.find(c => c.id === p.category)?.emoji} {p.subcategory}
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
      </div>
    </div>
  );
}

function OrdersManager() {
  const { orders, updateOrderStatus, updatePaymentStatus, darkMode } = useStore();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all ${
              filter === s ? 'bg-green-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-xs font-bold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Customer</p>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{order.customer.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{order.customer.phone}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{order.customer.address}</p>
                </div>
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-xs font-bold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Payment</p>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{order.paymentMethod.toUpperCase()}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Delivery: {order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee}`}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Update Status:</span>
                {(['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'] as Order['status'][]).map(s => (
                  <button
                    key={s}
                    onClick={() => { updateOrderStatus(order.id, s); toast.success(`Order ${s.replace('_', ' ')}`); }}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                      order.status === s
                        ? `${STATUS_COLORS[s]} ring-2 ring-offset-1 ring-green-400`
                        : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
                {order.paymentStatus === 'pending' && (
                  <button
                    onClick={() => { updatePaymentStatus(order.id, 'paid'); toast.success('Payment marked as paid'); }}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white hover:bg-green-700"
                  >
                    ✓ Mark Paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
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

function SettingsManager() {
  const { storeSettings, updateStoreSettings, darkMode } = useStore();
  const [form, setForm] = useState({ ...storeSettings });
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateStoreSettings(form);
    setSaved(true);
    toast.success('✅ Settings saved!');
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
        {hd('📱', 'Contact & WhatsApp')}
        <div className="grid sm:grid-cols-2 gap-3">
          <div>{lbl('Phone Number (display)')}<input className={inp} value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+91 98765 43210" /></div>
          <div>{lbl('WhatsApp Number (digits only with country code)')}<input className={inp} value={form.whatsapp} onChange={e => setForm(f => ({...f, whatsapp: e.target.value}))} placeholder="919876543210" /></div>
        </div>
        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>💡 WhatsApp link: wa.me/{form.whatsapp}</p>
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
        <div>{lbl('Apps Script Webhook URL')}<input className={inp} value={form.googleSheetWebhookUrl} onChange={e => setForm(f => ({...f, googleSheetWebhookUrl: e.target.value}))} placeholder="https://script.google.com/macros/s/.../exec" /></div>
        <div className={`mt-3 p-4 rounded-xl text-xs space-y-1.5 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-800'}`}>
          <p className="font-bold">📋 One-time Setup (2 minutes):</p>
          <p>1. Google Sheets → Extensions → Apps Script → paste the webhook code</p>
          <p>2. Deploy → New Deployment → Web App → Anyone can access → Copy URL</p>
          <p>3. Paste URL above and click Save</p>
          {form.googleSheetWebhookUrl && <p className="text-green-600 font-bold mt-1">✅ Webhook configured — all new orders auto-save to Sheet!</p>}
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

export default function AdminPage() {
  const { adminLoggedIn, adminLogout, adminView, setAdminView, setCurrentPage, darkMode, orders } = useStore();

  if (!adminLoggedIn) return <LoginForm />;

  const views = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Save },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
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
              onClick={() => setAdminView(v.id as any)}
              className={`flex-1 min-w-fit flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                adminView === v.id
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
            </button>
          ))}
        </div>

        {/* Content */}
        {adminView === 'dashboard' && <Dashboard />}
        {adminView === 'products' && <ProductsManager />}
        {adminView === 'orders' && <OrdersManager />}
        {adminView === 'customers' && <CustomersManager />}
        {adminView === 'settings' && <SettingsManager />}
      </div>
    </div>
  );
}
