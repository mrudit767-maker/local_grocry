import { getSupabase } from '../lib/supabase';
import { Product, Category } from '../data/products';
import { Order, Customer, StoreSettings, HomeBanner } from '../store/useStore';

// ==========================================
// 1. PRODUCTS
// ==========================================

export function mapRowToProduct(row: any): Product {
  return {
    id: String(row.id),
    name: String(row.name || ''),
    category: String(row.category || ''),
    subcategory: row.subcategory ? String(row.subcategory) : undefined,
    price: Number(row.price || 0),
    mrp: Number(row.mrp || 0),
    unit: String(row.unit || '1 pc'),
    image: String(row.image || ''),
    images: Array.isArray(row.images) ? row.images : [],
    customWeights: Array.isArray(row.custom_weights) ? row.custom_weights : [],
    badge: row.badge ? String(row.badge) : undefined,
    rating: Number(row.rating || 4),
    description: String(row.description || ''),
    inStock: Boolean(row.in_stock),
    storeId: row.store_id ? String(row.store_id) : 'main',
    expiryDate: row.expiry_date ? String(row.expiry_date) : undefined,
    updatedAt: row.updated_at ? Number(row.updated_at) : undefined,
  };
}

export function mapProductToRow(p: Product): any {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory || null,
    price: p.price,
    mrp: p.mrp,
    unit: p.unit,
    image: p.image,
    images: Array.isArray(p.images) ? p.images : [],
    custom_weights: Array.isArray(p.customWeights) ? p.customWeights : [],
    badge: p.badge || null,
    rating: p.rating || 4,
    description: p.description || '',
    in_stock: p.inStock,
    store_id: p.storeId || 'main',
    expiry_date: p.expiryDate || null,
    updated_at: p.updatedAt || Date.now(),
  };
}

export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase fetchProducts error:', error);
      return null;
    }

    return (data || []).map(mapRowToProduct);
  } catch (err) {
    console.error('Failed to fetch products from Supabase:', err);
    return null;
  }
}

export async function saveProductToSupabase(product: Product): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const row = mapProductToRow(product);
    const { error } = await supabase
      .from('products')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('Supabase saveProduct error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save product to Supabase:', err);
    return false;
  }
}

export async function deleteProductFromSupabase(productId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Supabase deleteProduct error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete product from Supabase:', err);
    return false;
  }
}

export async function bulkUpsertProductsToSupabase(products: Product[]): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || products.length === 0) return false;

  try {
    const rows = products.map(mapProductToRow);
    // Batch upsert in chunks of 100 to avoid payload limits
    const chunkSize = 100;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const { error } = await supabase
        .from('products')
        .upsert(chunk, { onConflict: 'id' });

      if (error) {
        console.error('Supabase bulk upsert products error:', error);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error('Failed to bulk upsert products to Supabase:', err);
    return false;
  }
}

// ==========================================
// 2. CATEGORIES
// ==========================================

export async function fetchCategoriesFromSupabase(): Promise<Category[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase fetchCategories error:', error);
      return null;
    }

    if (!data || data.length === 0) return null;

    return data.map((r) => ({
      id: r.id,
      name: r.name,
      emoji: r.emoji || '📦',
      color: r.color || 'from-green-500 to-emerald-600',
      image: r.image || undefined,
    }));
  } catch (err) {
    console.error('Failed to fetch categories from Supabase:', err);
    return null;
  }
}

export async function bulkUpsertCategoriesToSupabase(categories: Category[]): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || categories.length === 0) return false;

  try {
    const rows = categories.map((c) => ({
      id: c.id,
      name: c.name,
      emoji: c.emoji || '📦',
      color: c.color || 'from-green-500 to-emerald-600',
      image: c.image || null,
    }));

    const { error } = await supabase.from('categories').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.error('Supabase bulk upsert categories error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to bulk upsert categories to Supabase:', err);
    return false;
  }
}

// ==========================================
// 3. ORDERS
// ==========================================

export function mapRowToOrder(row: any): Order {
  return {
    id: row.id,
    date: row.date || new Date(row.created_at || Date.now()).toISOString().split('T')[0],
    items: Array.isArray(row.items) ? row.items : [],
    total: Number(row.total || 0),
    status: (row.status || 'pending') as Order['status'],
    customerName: row.customer_name || '',
    phone: row.phone || '',
    address: row.address || '',
    deliverySlot: row.order_json?.deliverySlot || undefined,
    paymentMethod: (row.payment_method || 'cod') as any,
    paymentStatus: (row.payment_status || 'pending') as any,
    upiRefNo: row.order_json?.upiRefNo || undefined,
    locationUrl: row.order_json?.locationUrl || undefined,
  };
}

export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetchOrders error:', error);
      return null;
    }

    return (data || []).map(mapRowToOrder);
  } catch (err) {
    console.error('Failed to fetch orders from Supabase:', err);
    return null;
  }
}

export async function saveOrderToSupabase(order: Order): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const itemsSummary = (order.items || [])
      .map((item) => `${item.name} (${item.unit || '1 pc'}) x ${item.quantity}`)
      .join(', ');

    const row = {
      id: order.id,
      date: order.date,
      customer_name: order.customerName,
      phone: order.phone,
      address: order.address,
      total: order.total,
      status: order.status,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus || 'pending',
      items: order.items,
      items_summary: itemsSummary,
      order_json: {
        deliverySlot: order.deliverySlot,
        upiRefNo: order.upiRefNo,
        locationUrl: order.locationUrl,
      },
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('orders').upsert(row, { onConflict: 'id' });
    if (error) {
      console.error('Supabase saveOrder error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save order to Supabase:', err);
    return false;
  }
}

export async function updateOrderStatusInSupabase(
  orderId: string,
  status: Order['status'],
  paymentStatus?: string
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const updatePayload: any = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (paymentStatus) {
      updatePayload.payment_status = paymentStatus;
    }

    const { error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId);

    if (error) {
      console.error('Supabase updateOrderStatus error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to update order status in Supabase:', err);
    return false;
  }
}

// ==========================================
// 4. CUSTOMERS
// ==========================================

export async function fetchCustomerFromSupabase(identifier: string): Promise<Customer | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const cleanId = identifier.trim();
    const cleanPhone = cleanId.replace(/[^0-9]/g, '');

    let query = supabase.from('customers').select('*');

    if (cleanPhone.length >= 10) {
      query = query.or(`phone.eq.${cleanPhone},phone.eq.+91 ${cleanPhone},id.eq.${cleanId},email.eq.${cleanId}`);
    } else {
      query = query.or(`id.eq.${cleanId},email.eq.${cleanId}`);
    }

    const { data, error } = await query.limit(1);

    if (error || !data || data.length === 0) {
      return null;
    }

    const r = data[0];
    return {
      id: r.id,
      name: r.name,
      phone: r.phone,
      email: r.email,
      address: r.address,
      city: r.city,
      pincode: r.pincode,
      dateRegistered: r.date_registered,
    };
  } catch (err) {
    console.error('Failed to fetch customer from Supabase:', err);
    return null;
  }
}

export async function saveCustomerToSupabase(customer: Customer): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const row = {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email || null,
      address: customer.address || null,
      city: customer.city || null,
      pincode: customer.pincode || null,
      date_registered: customer.dateRegistered || new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('customers').upsert(row, { onConflict: 'id' });
    if (error) {
      console.error('Supabase saveCustomer error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save customer to Supabase:', err);
    return false;
  }
}

// ==========================================
// 5. STOCK REQUESTS (Notify Me)
// ==========================================

export async function saveStockRequestToSupabase(request: {
  productId: string;
  productName: string;
  productImage?: string;
  customerName: string;
  customerContact: string;
}): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const row = {
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      product_id: request.productId,
      product_name: request.productName,
      product_image: request.productImage || null,
      customer_name: request.customerName,
      customer_contact: request.customerContact,
      status: 'pending',
    };

    const { error } = await supabase.from('stock_requests').insert(row);
    if (error) {
      console.error('Supabase saveStockRequest error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save stock request to Supabase:', err);
    return false;
  }
}

export async function fetchStockRequestsFromSupabase(): Promise<any[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('stock_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetchStockRequests error:', error);
      return null;
    }
    return data || [];
  } catch (err) {
    console.error('Failed to fetch stock requests from Supabase:', err);
    return null;
  }
}

// ==========================================
// 6. STORE SETTINGS
// ==========================================

export async function fetchSettingsFromSupabase(): Promise<Partial<StoreSettings> | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 'main')
      .limit(1);

    if (error || !data || data.length === 0) {
      return null;
    }

    const r = data[0];
    return {
      shopName: r.shop_name,
      tagline: r.tagline,
      phone: r.phone,
      whatsapp: r.whatsapp,
      email: r.email,
      address: r.address,
      mapsLink: r.maps_link,
      businessHours: r.business_hours,
      minOrderAmount: Number(r.min_order_amount || 0),
      deliveryFee: Number(r.delivery_fee || 0),
      freeDeliveryAbove: Number(r.free_delivery_above || 0),
      shopUpiId: r.shop_upi_id,
      adminPassword: r.admin_password,
      bulkPackSize2: r.bulk_pack_size_2 !== null ? Number(r.bulk_pack_size_2) : undefined,
      bulkPackDiscount2: r.bulk_pack_discount_2 !== null ? Number(r.bulk_pack_discount_2) : undefined,
      bulkPackSize3: r.bulk_pack_size_3 !== null ? Number(r.bulk_pack_size_3) : undefined,
      bulkPackDiscount3: r.bulk_pack_discount_3 !== null ? Number(r.bulk_pack_discount_3) : undefined,
    };
  } catch (err) {
    console.error('Failed to fetch settings from Supabase:', err);
    return null;
  }
}

export async function saveSettingsToSupabase(settings: StoreSettings): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const row = {
      id: 'main',
      shop_name: settings.shopName,
      tagline: settings.tagline,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      email: settings.email,
      address: settings.address,
      maps_link: settings.mapsLink,
      business_hours: settings.businessHours,
      min_order_amount: settings.minOrderAmount,
      delivery_fee: settings.deliveryFee,
      free_delivery_above: settings.freeDeliveryAbove,
      shop_upi_id: settings.shopUpiId,
      admin_password: settings.adminPassword,
      bulk_pack_size_2: settings.bulkPackSize2 ?? 3,
      bulk_pack_discount_2: settings.bulkPackDiscount2 ?? 5,
      bulk_pack_size_3: settings.bulkPackSize3 ?? 6,
      bulk_pack_discount_3: settings.bulkPackDiscount3 ?? 10,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('store_settings').upsert(row, { onConflict: 'id' });
    if (error) {
      console.error('Supabase saveSettings error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save settings to Supabase:', err);
    return false;
  }
}

// ==========================================
// 7. BANNERS
// ==========================================

export async function fetchBannersFromSupabase(): Promise<HomeBanner[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) return null;

    return data.map((b) => ({
      id: b.id,
      title: b.title || '',
      subtitle: b.subtitle || '',
      cta: b.cta || '',
      bg: b.bg || '',
      emoji: b.emoji || '',
      badge: b.badge || '',
      image: b.image || '',
      linkCategory: b.link_category || 'all',
    }));
  } catch (err) {
    console.error('Failed to fetch banners from Supabase:', err);
    return null;
  }
}

export async function bulkUpsertBannersToSupabase(banners: HomeBanner[]): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase || banners.length === 0) return false;

  try {
    const rows = banners.map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      cta: b.cta,
      bg: b.bg,
      emoji: b.emoji,
      badge: b.badge,
      image: b.image,
      link_category: b.linkCategory,
    }));

    const { error } = await supabase.from('banners').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.error('Supabase bulk upsert banners error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to bulk upsert banners to Supabase:', err);
    return false;
  }
}
