import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cache client instances based on URL and Key
let cachedClient: SupabaseClient | null = null;
let cachedUrl: string | null = null;
let cachedKey: string | null = null;

export function getSupabaseCredentials(): { url: string; key: string } {
  // 1. Check environment variables
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  // 2. Check localStorage store settings (allows runtime configuration in Admin Panel)
  let storeUrl = '';
  let storeKey = '';
  try {
    const raw = localStorage.getItem('krishna-kirana-store');
    if (raw) {
      const parsed = JSON.parse(raw);
      storeUrl = parsed?.state?.storeSettings?.supabaseUrl || '';
      storeKey = parsed?.state?.storeSettings?.supabaseAnonKey || '';
    }
  } catch (e) {
    // Ignore JSON parse errors
  }

  const url = (storeUrl || envUrl || '').trim();
  const key = (storeKey || envKey || '').trim();

  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    key.length > 20
  );
}

export function getSupabase(overrideUrl?: string, overrideKey?: string): SupabaseClient | null {
  const credentials = getSupabaseCredentials();
  const url = (overrideUrl || credentials.url).trim();
  const key = (overrideKey || credentials.key).trim();

  if (!url || !key || !url.startsWith('https://')) {
    return null;
  }

  if (cachedClient && cachedUrl === url && cachedKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    cachedUrl = url;
    cachedKey = key;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(
  testUrl?: string,
  testKey?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const client = getSupabase(testUrl, testKey);
    if (!client) {
      return {
        success: false,
        message: 'Invalid Supabase URL or Anon Key. URL must start with https:// and end with .supabase.co',
      };
    }

    // Attempt a light query on the products or store_settings table
    const { data, error } = await client.from('store_settings').select('id').limit(1);

    if (error) {
      // If table doesn't exist yet, but connection was authenticated
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase! (Note: Tables are not yet created. Please run supabase_schema.sql in your Supabase SQL Editor).',
        };
      }
      return {
        success: false,
        message: `Supabase Error (${error.code || 'UNKNOWN'}): ${error.message}`,
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase database!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Connection failed. Please check your network and credentials.',
    };
  }
}
