import { createClient } from '@supabase/supabase-js';
import { 
  StoreConfig, 
  Product, 
  CustomerOrder, 
  ManualExpense, 
  LegalDocument,
  OrderStatus,
  BlockId
} from '../types/store';
import { DEFAULT_STORE_CONFIG, DEFAULT_PRODUCTS } from '../data/defaultStore';

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
 * 1. STORE CONFIG API (With Deep Merging to prevent blank screens)
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

    // Normalize blockOrder to avoid unmatched block keys
    const rawBlockOrder = Array.isArray(data.block_order) ? data.block_order : [];
    const validBlockIds: BlockId[] = [
      'hero', 'categoryShowcase', 'trustBadges', 'flashSale', 'valueProps', 
      'products', 'promoBanner', 'testimonials', 'faq', 'contact', 'footer'
    ];
    let normalizedBlockOrder: BlockId[] = rawBlockOrder
      .map((id: string): BlockId | null => {
        if (id === 'categories') return 'categoryShowcase';
        if (id === 'promo') return 'promoBanner';
        if (id === 'value_props') return 'valueProps';
        if (validBlockIds.includes(id as BlockId)) return id as BlockId;
        return null;
      })
      .filter((id): id is BlockId => id !== null);

    if (normalizedBlockOrder.length === 0) {
      normalizedBlockOrder = DEFAULT_STORE_CONFIG.blockOrder;
    }

    const mergedTheme = {
      ...DEFAULT_STORE_CONFIG.theme,
      ...(data.theme || {}),
      palette: data.theme?.palette || DEFAULT_STORE_CONFIG.theme.palette || 'aurora-luxe',
      currency: data.theme?.currency || DEFAULT_STORE_CONFIG.theme.currency || 'Rs.',
      fontStyle: data.theme?.fontStyle || DEFAULT_STORE_CONFIG.theme.fontStyle || 'serif',
      borderRadius: data.theme?.borderRadius || DEFAULT_STORE_CONFIG.theme.borderRadius || 'md',
    };

    const mergedHeader = {
      ...DEFAULT_STORE_CONFIG.header,
      ...(data.header || {}),
      showAnnouncement: data.header?.showAnnouncement !== undefined ? Boolean(data.header.showAnnouncement) : true,
      navLinks: (data.header?.navLinks && Array.isArray(data.header.navLinks) && data.header.navLinks.length > 0)
        ? data.header.navLinks.map((nl: any, idx: number) => ({
            id: nl.id || `nav-${idx}`,
            label: nl.label || 'Link',
            href: nl.href || '#',
          }))
        : DEFAULT_STORE_CONFIG.header.navLinks,
    };

    const mergedHero = {
      ...DEFAULT_STORE_CONFIG.hero,
      ...(data.hero || {}),
      visible: data.hero?.visible !== undefined ? Boolean(data.hero.visible) : true,
      title: data.hero?.title || DEFAULT_STORE_CONFIG.hero.title,
      subtitle: data.hero?.subtitle || DEFAULT_STORE_CONFIG.hero.subtitle,
      badgeText: data.hero?.badgeText || data.hero?.badge || DEFAULT_STORE_CONFIG.hero.badgeText,
      ctaText: data.hero?.ctaText || data.hero?.primaryButtonText || DEFAULT_STORE_CONFIG.hero.ctaText,
      heroImage: data.hero?.heroImage || data.hero?.bgImage || DEFAULT_STORE_CONFIG.hero.heroImage,
    };

    const mergedCategoryShowcase = {
      ...DEFAULT_STORE_CONFIG.categoryShowcase,
      ...(data.category_showcase || {}),
      visible: data.category_showcase?.visible !== undefined ? Boolean(data.category_showcase.visible) : true,
      items: (data.category_showcase?.items && Array.isArray(data.category_showcase.items) && data.category_showcase.items.length > 0)
        ? data.category_showcase.items
        : DEFAULT_STORE_CONFIG.categoryShowcase.items,
    };

    const mergedProductGrid = {
      ...DEFAULT_STORE_CONFIG.productGrid,
      ...(data.product_grid || {}),
      visible: data.product_grid?.visible !== undefined ? Boolean(data.product_grid.visible) : true,
      columns: (data.product_grid?.columns === 2 || data.product_grid?.columns === 3 || data.product_grid?.columns === 4)
        ? data.product_grid.columns
        : DEFAULT_STORE_CONFIG.productGrid.columns,
      showCategories: data.product_grid?.showCategories !== undefined ? Boolean(data.product_grid.showCategories) : true,
    };

    const mergedValueProps = {
      ...DEFAULT_STORE_CONFIG.valueProps,
      ...(data.value_props || {}),
      visible: data.value_props?.visible !== undefined ? Boolean(data.value_props.visible) : true,
      items: (data.value_props?.items && Array.isArray(data.value_props.items) && data.value_props.items.length > 0)
        ? data.value_props.items
        : DEFAULT_STORE_CONFIG.valueProps.items,
    };

    const mergedPromoBanner = {
      ...DEFAULT_STORE_CONFIG.promoBanner,
      ...(data.promo_banner || {}),
      visible: data.promo_banner?.visible !== undefined ? Boolean(data.promo_banner.visible) : true,
    };

    const mergedTestimonials = {
      ...DEFAULT_STORE_CONFIG.testimonials,
      ...(data.testimonials || {}),
      visible: data.testimonials?.visible !== undefined ? Boolean(data.testimonials.visible) : true,
      items: (data.testimonials?.items && Array.isArray(data.testimonials.items) && data.testimonials.items.length > 0)
        ? data.testimonials.items
        : DEFAULT_STORE_CONFIG.testimonials.items,
    };

    const mergedFaq = {
      ...DEFAULT_STORE_CONFIG.faq,
      ...(data.faq || {}),
      visible: data.faq?.visible !== undefined ? Boolean(data.faq.visible) : true,
      items: (data.faq?.items && Array.isArray(data.faq.items) && data.faq.items.length > 0)
        ? data.faq.items
        : DEFAULT_STORE_CONFIG.faq.items,
    };

    const mergedContact = {
      ...DEFAULT_STORE_CONFIG.contact,
      ...(data.contact || {}),
      visible: data.contact?.visible !== undefined ? Boolean(data.contact.visible) : true,
    };

    const mergedFooter = {
      ...DEFAULT_STORE_CONFIG.footer,
      ...(data.footer || {}),
      visible: data.footer?.visible !== undefined ? Boolean(data.footer.visible) : true,
    };

    const mergedTrustBadges = {
      ...DEFAULT_STORE_CONFIG.trustBadges,
      ...(data.trust_badges || {}),
      visible: data.trust_badges?.visible !== undefined ? Boolean(data.trust_badges.visible) : true,
      items: (data.trust_badges?.items && Array.isArray(data.trust_badges.items) && data.trust_badges.items.length > 0)
        ? data.trust_badges.items
        : (DEFAULT_STORE_CONFIG.trustBadges?.items || []),
    };

    const mergedFlashSale = {
      ...DEFAULT_STORE_CONFIG.flashSale,
      ...(data.flash_sale || {}),
      visible: data.flash_sale?.visible !== undefined ? Boolean(data.flash_sale.visible) : false,
    };

    return {
      theme: mergedTheme,
      header: mergedHeader,
      hero: mergedHero,
      categoryShowcase: mergedCategoryShowcase,
      productGrid: mergedProductGrid,
      valueProps: mergedValueProps,
      promoBanner: mergedPromoBanner,
      testimonials: mergedTestimonials,
      faq: mergedFaq,
      contact: mergedContact,
      footer: mergedFooter,
      trustBadges: mergedTrustBadges,
      flashSale: mergedFlashSale,
      legalDocuments: (data.legal_documents && Array.isArray(data.legal_documents) && data.legal_documents.length > 0) 
        ? data.legal_documents 
        : DEFAULT_STORE_CONFIG.legalDocuments,
      paymentMethods: (data.payment_methods && Array.isArray(data.payment_methods) && data.payment_methods.length > 0) 
        ? data.payment_methods 
        : DEFAULT_STORE_CONFIG.paymentMethods,
      customCartButton: data.custom_cart_button || DEFAULT_STORE_CONFIG.customCartButton,
      blockOrder: normalizedBlockOrder,
      categories: (data.categories && Array.isArray(data.categories) && data.categories.length > 0) 
        ? data.categories 
        : DEFAULT_STORE_CONFIG.categories,
      freeShippingThreshold: Number(data.free_shipping_threshold) || 5000,
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
 * 2. PRODUCTS API (With Complete Null Safety)
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
      id: row.id || `prod-${Math.random().toString(36).substring(2, 7)}`,
      title: row.title || 'Untitled Product',
      price: Number(row.price) >= 0 ? Number(row.price) : 0,
      costPrice: row.cost_price ? Number(row.cost_price) : undefined,
      originalPrice: row.original_price ? Number(row.original_price) : undefined,
      category: row.category || 'All',
      image: row.image || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      images: Array.isArray(row.images) && row.images.length > 0 
        ? row.images 
        : [row.image || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'],
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
