import { createClient } from '@supabase/supabase-js';
import { 
  StoreConfig, 
  Product, 
  CustomerOrder, 
  ManualExpense, 
  LegalDocument,
  OrderStatus 
} from '../types/store';

// Storage key for user-entered credentials in UI (if not passed via Vite env)
const SUPABASE_STORAGE_URL_KEY = 'aurora_supabase_url';
const SUPABASE_STORAGE_ANON_KEY = 'aurora_supabase_anon_key';

// Read from Vite environment variables first, then localStorage
export const getSupabaseCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(SUPABASE_STORAGE_URL_KEY) : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(SUPABASE_STORAGE_ANON_KEY) : null;

  const url = (envUrl && envUrl !== 'https://your-project-ref.supabase.co' ? envUrl : localUrl) || '';
  const key = (envKey && envKey !== 'your-anon-public-key' ? envKey : localKey) || '';

  return { url: url.trim(), key: key.trim() };
};

export const setCustomSupabaseCredentials = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem(SUPABASE_STORAGE_URL_KEY, url.trim());
    else localStorage.removeItem(SUPABASE_STORAGE_URL_KEY);

    if (key) localStorage.setItem(SUPABASE_STORAGE_ANON_KEY, key.trim());
    else localStorage.removeItem(SUPABASE_STORAGE_ANON_KEY);
  }
};

let supabaseClientInstance: ReturnType<typeof createClient> | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export const getSupabaseClient = () => {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) return null;

  if (!supabaseClientInstance || lastUsedUrl !== url || lastUsedKey !== key) {
    supabaseClientInstance = createClient(url, key);
    lastUsedUrl = url;
    lastUsedKey = key;
  }
  return supabaseClientInstance;
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.startsWith('https://') && key.length > 20);
};

/* -------------------------------------------------------------
 * 1. STORE CONFIG API
 * ----------------------------------------------------------- */
export const fetchStoreConfigFromSupabase = async (): Promise<StoreConfig | null> => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('store_config')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.warn('Supabase fetchStoreConfig warning:', error.message);
      }
      return null;
    }

    if (!data) return null;

    return {
      theme: data.theme,
      header: data.header,
      hero: data.hero,
      categoryShowcase: data.category_showcase,
      productGrid: data.product_grid,
      valueProps: data.value_props,
      promoBanner: data.promo_banner,
      testimonials: data.testimonials,
      faq: data.faq,
      contact: data.contact,
      footer: data.footer,
      trustBadges: data.trust_badges,
      flashSale: data.flash_sale,
      legalDocuments: data.legal_documents || [],
      paymentMethods: data.payment_methods || [],
      customCartButton: data.custom_cart_button,
      blockOrder: data.block_order || [],
      categories: data.categories || [],
      freeShippingThreshold: Number(data.free_shipping_threshold) || 500,
    };
  } catch (err) {
    console.error('Failed to load store config from Supabase:', err);
    return null;
  }
};

export const saveStoreConfigToSupabase = async (config: StoreConfig): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const payload = {
      id: 'default',
      theme: config.theme,
      header: config.header,
      hero: config.hero,
      category_showcase: config.categoryShowcase,
      product_grid: config.productGrid,
      value_props: config.valueProps,
      promo_banner: config.promoBanner,
      testimonials: config.testimonials,
      faq: config.faq,
      contact: config.contact,
      footer: config.footer,
      trust_badges: config.trustBadges,
      flash_sale: config.flashSale,
      legal_documents: config.legalDocuments,
      payment_methods: config.paymentMethods,
      custom_cart_button: config.customCartButton,
      block_order: config.blockOrder,
      categories: config.categories,
      free_shipping_threshold: config.freeShippingThreshold,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('store_config')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Supabase saveStoreConfig error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save store config to Supabase:', err);
    return false;
  }
};

/* -------------------------------------------------------------
 * 2. PRODUCTS API
 * ----------------------------------------------------------- */
export const fetchProductsFromSupabase = async (): Promise<Product[] | null> => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Supabase fetchProducts warning:', error.message);
      return null;
    }

    if (!data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      price: Number(row.price),
      costPrice: row.cost_price ? Number(row.cost_price) : undefined,
      originalPrice: row.original_price ? Number(row.original_price) : undefined,
      category: row.category,
      image: row.image,
      images: row.images || [row.image],
      description: row.description || '',
      badge: row.badge || undefined,
      inStock: row.in_stock ?? true,
      rating: Number(row.rating) || 5.0,
      reviewsCount: Number(row.reviews_count) || 0,
      featured: Boolean(row.featured),
      variants: row.variants || undefined,
    }));
  } catch (err) {
    console.error('Failed to load products from Supabase:', err);
    return null;
  }
};

export const saveProductToSupabase = async (product: Product): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const payload = {
      id: product.id,
      title: product.title,
      price: product.price,
      cost_price: product.costPrice || 0,
      original_price: product.originalPrice || null,
      category: product.category,
      image: product.image,
      images: product.images || [product.image],
      description: product.description,
      badge: product.badge || null,
      in_stock: product.inStock,
      rating: product.rating,
      reviews_count: product.reviewsCount,
      featured: product.featured || false,
      variants: product.variants || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Supabase saveProduct error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save product to Supabase:', err);
    return false;
  }
};

export const deleteProductFromSupabase = async (id: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteProduct error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete product from Supabase:', err);
    return false;
  }
};

/* -------------------------------------------------------------
 * 3. CUSTOMER ORDERS API
 * ----------------------------------------------------------- */
export const fetchOrdersFromSupabase = async (): Promise<CustomerOrder[] | null> => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('customer_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchOrders warning:', error.message);
      return null;
    }
    if (!data) return null;

    return data.map((row: any) => ({
      id: row.id,
      date: row.date,
      items: row.items,
      subtotal: Number(row.subtotal),
      discount: Number(row.discount) || 0,
      shipping: Number(row.shipping) || 0,
      total: Number(row.total),
      cogs: row.cogs ? Number(row.cogs) : undefined,
      customer: row.customer,
      paymentMethod: row.payment_method,
      status: row.status as OrderStatus,
      trackingNumber: row.tracking_number || undefined,
      adminNotes: row.admin_notes || undefined,
    }));
  } catch (err) {
    console.error('Failed to load orders from Supabase:', err);
    return null;
  }
};

export const saveOrderToSupabase = async (order: CustomerOrder): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const payload = {
      id: order.id,
      date: order.date,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      total: order.total,
      cogs: order.cogs || 0,
      customer: order.customer,
      payment_method: order.paymentMethod,
      status: order.status,
      tracking_number: order.trackingNumber || null,
      admin_notes: order.adminNotes || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('customer_orders')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Supabase saveOrder error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save order to Supabase:', err);
    return false;
  }
};

export const updateOrderStatusInSupabase = async (
  orderId: string, 
  status: OrderStatus, 
  trackingNumber?: string
): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const updateData: any = { status, updated_at: new Date().toISOString() };
    if (trackingNumber !== undefined) {
      updateData.tracking_number = trackingNumber;
    }

    const { error } = await supabase
      .from('customer_orders')
      .update(updateData)
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
};

export const deleteOrderFromSupabase = async (orderId: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('customer_orders').delete().eq('id', orderId);
    if (error) {
      console.error('Supabase deleteOrder error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete order from Supabase:', err);
    return false;
  }
};

/* -------------------------------------------------------------
 * 4. EXPENSES API
 * ----------------------------------------------------------- */
export const fetchExpensesFromSupabase = async (): Promise<ManualExpense[] | null> => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('manual_expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.warn('Supabase fetchExpenses warning:', error.message);
      return null;
    }
    if (!data) return null;

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      amount: Number(row.amount),
      category: row.category,
      date: row.date,
      notes: row.notes || undefined,
    }));
  } catch (err) {
    console.error('Failed to load expenses from Supabase:', err);
    return null;
  }
};

export const saveExpenseToSupabase = async (expense: ManualExpense): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const payload = {
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      notes: expense.notes || null,
    };

    const { error } = await supabase
      .from('manual_expenses')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Supabase saveExpense error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save expense to Supabase:', err);
    return false;
  }
};

export const deleteExpenseFromSupabase = async (id: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('manual_expenses').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteExpense error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete expense from Supabase:', err);
    return false;
  }
};

/* -------------------------------------------------------------
 * 5. SUPABASE STORAGE BUCKET IMAGE UPLOAD API
 * ----------------------------------------------------------- */
export const uploadImageToSupabase = async (
  file: File | Blob, 
  folder: string = 'products'
): Promise<string | null> => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const bucketName = 'store-media';
    const fileExt = file instanceof File ? file.name.split('.').pop() || 'jpg' : 'jpg';
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Supabase image upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (err) {
    console.error('Failed to upload image to Supabase:', err);
    return null;
  }
};

/* -------------------------------------------------------------
 * 6. CONTACT INQUIRIES & NEWSLETTER API
 * ----------------------------------------------------------- */
export const submitContactInquiry = async (inquiry: {
  name: string;
  email: string;
  message: string;
}): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('contact_inquiries').insert([
      {
        id: `inq-${Date.now()}`,
        name: inquiry.name,
        email: inquiry.email,
        message: inquiry.message,
        status: 'unread',
        created_at: new Date().toISOString(),
      },
    ]);
    return !error;
  } catch {
    return false;
  }
};

export const subscribeNewsletter = async (email: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('newsletter_subscribers').upsert(
      [
        {
          id: `sub-${Date.now()}`,
          email: email.trim().toLowerCase(),
          subscribed_at: new Date().toISOString(),
        },
      ],
      { onConflict: 'email' }
    );
    return !error;
  } catch {
    return false;
  }
};
