/* Supabase Schema for Kirana Grocery Store */

-- 1. Create storage bucket for product images (Public access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for product-images bucket
DROP POLICY IF EXISTS "Public Access Product Images" ON storage.objects;
CREATE POLICY "Public Access Product Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Upload Product Images" ON storage.objects;
CREATE POLICY "Public Upload Product Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Update Product Images" ON storage.objects;
CREATE POLICY "Public Update Product Images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Delete Product Images" ON storage.objects;
CREATE POLICY "Public Delete Product Images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');


-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    mrp NUMERIC NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT '1 pc',
    image TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    custom_weights JSONB DEFAULT '[]'::jsonb,
    badge TEXT,
    rating NUMERIC DEFAULT 4.0,
    description TEXT,
    in_stock BOOLEAN DEFAULT true,
    store_id TEXT DEFAULT 'main',
    expiry_date TEXT,
    updated_at BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    emoji TEXT DEFAULT '📦',
    color TEXT DEFAULT 'from-green-500 to-emerald-600',
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    date TEXT,
    customer_name TEXT,
    phone TEXT,
    address TEXT,
    total NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending',
    payment_method TEXT DEFAULT 'cod',
    payment_status TEXT DEFAULT 'pending',
    items JSONB DEFAULT '[]'::jsonb,
    items_summary TEXT,
    order_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    pincode TEXT,
    date_registered TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Stock Requests (Notify Me) Table
CREATE TABLE IF NOT EXISTS public.stock_requests (
    id TEXT PRIMARY KEY,
    product_id TEXT,
    product_name TEXT,
    product_image TEXT,
    customer_name TEXT,
    customer_contact TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Banners Table
CREATE TABLE IF NOT EXISTS public.banners (
    id TEXT PRIMARY KEY,
    title TEXT,
    subtitle TEXT,
    cta TEXT,
    bg TEXT,
    emoji TEXT,
    badge TEXT,
    image TEXT,
    link_category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    shop_name TEXT DEFAULT 'Krishna Kirana',
    tagline TEXT DEFAULT 'Premium Grocery',
    phone TEXT DEFAULT '+91 98934 95231',
    whatsapp TEXT DEFAULT '919893495231',
    email TEXT DEFAULT 'mrudit767@gmail.com',
    address TEXT DEFAULT '653, Vidisha Rd, Kalyan Nagar, Bhanpur, Bhopal, MP 462038',
    maps_link TEXT DEFAULT 'https://www.google.com/maps/search/653+Vidisha+Rd+Kalyan+Nagar+Bhanpur+Bhopal+Madhya+Pradesh+462038',
    business_hours TEXT DEFAULT 'Mon-Sun: 7AM - 10PM',
    min_order_amount NUMERIC DEFAULT 0,
    delivery_fee NUMERIC DEFAULT 49,
    free_delivery_above NUMERIC DEFAULT 299,
    shop_upi_id TEXT DEFAULT 'paytmqr7247md@ptys',
    admin_password TEXT DEFAULT 'admin123',
    bulk_pack_size_2 NUMERIC DEFAULT 3,
    bulk_pack_discount_2 NUMERIC DEFAULT 5,
    bulk_pack_size_3 NUMERIC DEFAULT 6,
    bulk_pack_discount_3 NUMERIC DEFAULT 10,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert default settings row if missing
INSERT INTO public.store_settings (id, shop_name, tagline)
VALUES ('main', 'Krishna Kirana', 'Premium Grocery')
ON CONFLICT (id) DO NOTHING;

-- Row Level Security (RLS) Configuration
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Products Policies
DROP POLICY IF EXISTS "Public select products" ON public.products;
CREATE POLICY "Public select products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert products" ON public.products;
CREATE POLICY "Public insert products" ON public.products FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update products" ON public.products;
CREATE POLICY "Public update products" ON public.products FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete products" ON public.products;
CREATE POLICY "Public delete products" ON public.products FOR DELETE USING (true);

-- Categories Policies
DROP POLICY IF EXISTS "Public select categories" ON public.categories;
CREATE POLICY "Public select categories" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert categories" ON public.categories;
CREATE POLICY "Public insert categories" ON public.categories FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update categories" ON public.categories;
CREATE POLICY "Public update categories" ON public.categories FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete categories" ON public.categories;
CREATE POLICY "Public delete categories" ON public.categories FOR DELETE USING (true);

-- Orders Policies
DROP POLICY IF EXISTS "Public select orders" ON public.orders;
CREATE POLICY "Public select orders" ON public.orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update orders" ON public.orders;
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);

-- Customers Policies
DROP POLICY IF EXISTS "Public select customers" ON public.customers;
CREATE POLICY "Public select customers" ON public.customers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert customers" ON public.customers;
CREATE POLICY "Public insert customers" ON public.customers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update customers" ON public.customers;
CREATE POLICY "Public update customers" ON public.customers FOR UPDATE USING (true);

-- Stock Requests Policies
DROP POLICY IF EXISTS "Public select stock_requests" ON public.stock_requests;
CREATE POLICY "Public select stock_requests" ON public.stock_requests FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert stock_requests" ON public.stock_requests;
CREATE POLICY "Public insert stock_requests" ON public.stock_requests FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update stock_requests" ON public.stock_requests;
CREATE POLICY "Public update stock_requests" ON public.stock_requests FOR UPDATE USING (true);

-- Banners Policies
DROP POLICY IF EXISTS "Public select banners" ON public.banners;
CREATE POLICY "Public select banners" ON public.banners FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert banners" ON public.banners;
CREATE POLICY "Public insert banners" ON public.banners FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update banners" ON public.banners;
CREATE POLICY "Public update banners" ON public.banners FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Public delete banners" ON public.banners;
CREATE POLICY "Public delete banners" ON public.banners FOR DELETE USING (true);

-- Store Settings Policies
DROP POLICY IF EXISTS "Public select store_settings" ON public.store_settings;
CREATE POLICY "Public select store_settings" ON public.store_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert store_settings" ON public.store_settings;
CREATE POLICY "Public insert store_settings" ON public.store_settings FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update store_settings" ON public.store_settings;
CREATE POLICY "Public update store_settings" ON public.store_settings FOR UPDATE USING (true);

-- Enable Realtime publication for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;
