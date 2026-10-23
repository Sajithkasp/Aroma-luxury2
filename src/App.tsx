import React, { useState, useEffect } from 'react';
import { 
  StoreConfig, 
  Product, 
  CartItem, 
  CustomerOrder, 
  ManualExpense,
  OrderStatus,
  BlockId,
  LegalDocument
} from './types/store';
import { DEFAULT_STORE_CONFIG, DEFAULT_PRODUCTS, DEFAULT_SAMPLE_ORDERS, DEFAULT_SAMPLE_EXPENSES } from './data/defaultStore';
import { STORE_PRESETS } from './data/storePresets';
import { AdminTopBar } from './components/admin/AdminTopBar';
import { AdminBlockCustomizer } from './components/admin/AdminBlockCustomizer';
import { Header } from './components/common/Header';
import { HeroBlock } from './components/blocks/HeroBlock';
import { CategoryShowcaseBlock } from './components/blocks/CategoryShowcaseBlock';
import { TrustBadgesBlock } from './components/blocks/TrustBadgesBlock';
import { FlashSaleBlock } from './components/blocks/FlashSaleBlock';
import { ValuePropsBlock } from './components/blocks/ValuePropsBlock';
import { ProductGridBlock } from './components/blocks/ProductGridBlock';
import { PromoBannerBlock } from './components/blocks/PromoBannerBlock';
import { FaqBlock } from './components/blocks/FaqBlock';
import { TestimonialsBlock } from './components/blocks/TestimonialsBlock';
import { ContactBlock } from './components/blocks/ContactBlock';
import { FooterBlock } from './components/blocks/FooterBlock';
import { CartDrawer } from './components/common/CartDrawer';
import { CheckoutModal } from './components/common/CheckoutModal';
import { ProductDetailModal } from './components/common/ProductDetailModal';
import { ProductDetailPage } from './components/products/ProductDetailPage';
import { SearchModal } from './components/common/SearchModal';
import { WishlistDrawer } from './components/common/WishlistDrawer';
import { LegalDocumentModal } from './components/common/LegalDocumentModal';
import { 
  isSupabaseConfigured,
  fetchStoreConfigFromSupabase,
  saveStoreConfigToSupabase,
  fetchProductsFromSupabase,
  saveProductToSupabase,
  deleteProductFromSupabase,
  fetchOrdersFromSupabase,
  saveOrderToSupabase,
  updateOrderStatusInSupabase,
  deleteOrderFromSupabase,
  fetchExpensesFromSupabase,
  saveExpenseToSupabase,
  deleteExpenseFromSupabase,
} from './services/supabase';

export default function App() {
  // Persistence Keys
  const STORAGE_KEY_CONFIG = 'aurora_luxe_config_v2';
  const STORAGE_KEY_PRODUCTS = 'aurora_luxe_products_v2';
  const STORAGE_KEY_CART = 'aurora_luxe_cart_v2';
  const STORAGE_KEY_WISHLIST = 'aurora_luxe_wishlist_v2';
  const STORAGE_KEY_ORDERS = 'aurora_luxe_orders_v2';
  const STORAGE_KEY_EXPENSES = 'aurora_luxe_expenses_v2';

  // State initialization with localStorage fallback
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STORE_CONFIG,
          ...parsed,
          header: { ...DEFAULT_STORE_CONFIG.header, ...(parsed.header || {}) },
          theme: { ...DEFAULT_STORE_CONFIG.theme, ...(parsed.theme || {}) },
          trustBadges: { ...DEFAULT_STORE_CONFIG.trustBadges, ...(parsed.trustBadges || {}) },
          flashSale: { ...DEFAULT_STORE_CONFIG.flashSale, ...(parsed.flashSale || {}) },
          faq: { ...DEFAULT_STORE_CONFIG.faq, ...(parsed.faq || {}) },
          paymentMethods: (parsed.paymentMethods && parsed.paymentMethods.length > 0)
            ? parsed.paymentMethods
            : DEFAULT_STORE_CONFIG.paymentMethods,
          legalDocuments: (parsed.legalDocuments && parsed.legalDocuments.length > 0)
            ? parsed.legalDocuments
            : DEFAULT_STORE_CONFIG.legalDocuments,
        };
      }
      return DEFAULT_STORE_CONFIG;
    } catch {
      return DEFAULT_STORE_CONFIG;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      return saved ? JSON.parse(saved) : DEFAULT_SAMPLE_ORDERS;
    } catch {
      return DEFAULT_SAMPLE_ORDERS;
    }
  });

  const [expenses, setExpenses] = useState<ManualExpense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXPENSES);
      return saved ? JSON.parse(saved) : DEFAULT_SAMPLE_EXPENSES;
    } catch {
      return DEFAULT_SAMPLE_EXPENSES;
    }
  });

  // Supabase Initial Hydration: load remote data if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchStoreConfigFromSupabase().then((remoteConfig) => {
        if (remoteConfig) {
          setStoreConfig(remoteConfig);
        }
      });
      fetchProductsFromSupabase().then((remoteProducts) => {
        if (remoteProducts && remoteProducts.length > 0) {
          setProducts(remoteProducts);
        }
      });
      fetchOrdersFromSupabase().then((remoteOrders) => {
        if (remoteOrders && remoteOrders.length > 0) {
          setOrders(remoteOrders);
        }
      });
      fetchExpensesFromSupabase().then((remoteExpenses) => {
        if (remoteExpenses && remoteExpenses.length > 0) {
          setExpenses(remoteExpenses);
        }
      });
    }
  }, []);

  // Admin & UI State
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isBlockCustomizerOpen, setIsBlockCustomizerOpen] = useState(false);
  const [customizerInitialTab, setCustomizerInitialTab] = useState<'blocks' | 'theme' | 'legal' | 'payments' | 'products' | 'orders' | 'pnl' | 'presets'>('blocks');

  // Dedicated Product Page State
  const [activeProductPage, setActiveProductPage] = useState<Product | null>(null);

  // Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [activeLegalDocId, setActiveLegalDocId] = useState<string | undefined>(undefined);

  const handleOpenLegalModal = (docId?: string) => {
    setActiveLegalDocId(docId);
    setIsLegalModalOpen(true);
  };

  // Search & Promo code
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);

  // Dedicated Product Page Navigation with Hash & Browser Back Button
  const handleOpenProductPage = (product: Product) => {
    setActiveProductPage(product);
    window.location.hash = `product-${product.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStore = () => {
    setActiveProductPage(null);
    if (window.location.hash.startsWith('#product-')) {
      history.pushState(null, '', window.location.pathname);
    }
    setTimeout(() => {
      const el = document.getElementById('catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product-')) {
        const id = hash.replace('#product-', '');
        const found = products.find((p) => p.id === id);
        if (found) {
          setActiveProductPage(found);
          return;
        }
      }
      if (!hash || hash === '#' || hash === '#catalog' || hash === '#story') {
        setActiveProductPage(null);
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, [products]);

  // Save to localStorage and Supabase on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(storeConfig));
    if (isSupabaseConfigured()) {
      saveStoreConfigToSupabase(storeConfig);
    }
  }, [storeConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  // Order Management Handlers
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status, trackingNumber: trackingNumber || ord.trackingNumber }
          : ord
      )
    );
    if (isSupabaseConfigured()) {
      updateOrderStatusInSupabase(orderId, status, trackingNumber);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    if (isSupabaseConfigured()) {
      deleteOrderFromSupabase(orderId);
    }
  };

  const handleAddManualOrder = (order: CustomerOrder) => {
    setOrders((prev) => [order, ...prev]);
    if (isSupabaseConfigured()) {
      saveOrderToSupabase(order);
    }
  };

  // Manual Expenses Handlers for P&L
  const handleAddExpense = (expense: ManualExpense) => {
    setExpenses((prev) => [expense, ...prev]);
    if (isSupabaseConfigured()) {
      saveExpenseToSupabase(expense);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (isSupabaseConfigured()) {
      deleteExpenseFromSupabase(id);
    }
  };

  // Product Actions
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setActiveProductPage((prev) => (prev?.id === updated.id ? updated : prev));
    if (isSupabaseConfigured()) {
      saveProductToSupabase(updated);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCartItems((prev) => prev.filter((item) => item.product.id !== id));
    setWishlistIds((prev) => prev.filter((pid) => pid !== id));
    if (isSupabaseConfigured()) {
      deleteProductFromSupabase(id);
    }
  };

  const handleDuplicateProduct = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      title: `${product.title} (Copy)`,
    };
    setProducts((prev) => [duplicated, ...prev]);
    if (isSupabaseConfigured()) {
      saveProductToSupabase(duplicated);
    }
  };

  // Directly fulfills user's request:
  // "Frontend eke product ekak add karanawanam admin eken add product click karama frontend eke penawa wagema oroduct box eka ethan penna one. Powerpoint eken drag karala fill karanawa wage awashya line eka click kara fill karanna puluwan wenna one ea welawema front end ekata add wenna one"
  // "Customer product eka click karama open wena page eke add karala thiyena anith images penna one. Me option eka aluthen add karana product walatath valid wenna one."
  const handleAddNewProduct = () => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      title: 'New Handcrafted Collection Item',
      price: 14500,
      costPrice: 6500,
      originalPrice: 17500,
      category: storeConfig.categories[1] || 'Living & Tableware',
      image: '/src/assets/images/product_leather_backpack_1792583490827.jpg',
      images: [
        '/src/assets/images/product_leather_backpack_1792583490827.jpg',
        '/src/assets/images/hero_storefront_flagship_1792583490522.jpg',
        '/src/assets/images/product_minimalist_timepiece_1792583491655.jpg',
      ],
      description: 'Click this line to edit product description. Crafted with meticulous attention to detail and tactile quality.',
      badge: 'New Arrival',
      inStock: true,
      rating: 5.0,
      reviewsCount: 1,
      featured: true,
    };

    setProducts((prev) => [newProduct, ...prev]);
    setIsAdmin(true);
    if (isSupabaseConfigured()) {
      saveProductToSupabase(newProduct);
    }

    // Scroll to catalog grid smoothly
    setTimeout(() => {
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1, variant?: { size?: string; color?: string }) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) => it.product.id === product.id && it.selectedSize === variant?.size && it.selectedColor === variant?.color
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, selectedSize: variant?.size, selectedColor: variant?.color }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((it) => it.product.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((it) => (it.product.id === productId ? { ...it, quantity } : it))
      );
    }
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((it) => it.product.id !== productId));
  };

  // Promo Code Handler
  const handleApplyPromoCode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === storeConfig.promoBanner.discountCode.toUpperCase() || trimmed === 'AURA20' || trimmed === 'WELCOME10') {
      const percent = trimmed === 'WELCOME10' ? 10 : 20;
      setAppliedPromoCode(trimmed);
      setAppliedDiscountPercent(percent);
      return true;
    }
    return false;
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Order Placement
  const handleOrderPlaced = (order: CustomerOrder) => {
    setOrders((prev) => [order, ...prev]);
    if (isSupabaseConfigured()) {
      saveOrderToSupabase(order);
    }
  };

  // Preset switch
  const handleLoadPreset = (presetId: string) => {
    const preset = STORE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setStoreConfig(preset.config);
      setProducts(preset.products);
      setIsBlockCustomizerOpen(false);
    }
  };

  // Reset to default
  const handleResetToDefaults = () => {
    setStoreConfig(DEFAULT_STORE_CONFIG);
    setProducts(DEFAULT_PRODUCTS);
    setCartItems([]);
    setWishlistIds([]);
    setOrders([]);
    setIsBlockCustomizerOpen(false);
  };

  // Reorder modular block helper
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...storeConfig.blockOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    setStoreConfig({ ...storeConfig, blockOrder: newOrder });
  };

  // Toggle modular block visibility helper
  const handleToggleBlockVisibility = (blockId: BlockId) => {
    switch (blockId) {
      case 'hero':
        setStoreConfig({ ...storeConfig, hero: { ...storeConfig.hero, visible: !storeConfig.hero.visible } });
        break;
      case 'categoryShowcase':
        setStoreConfig({
          ...storeConfig,
          categoryShowcase: {
            ...(storeConfig.categoryShowcase || DEFAULT_STORE_CONFIG.categoryShowcase!),
            visible: !(storeConfig.categoryShowcase?.visible ?? true),
          },
        });
        break;
      case 'valueProps':
        setStoreConfig({ ...storeConfig, valueProps: { ...storeConfig.valueProps, visible: !storeConfig.valueProps.visible } });
        break;
      case 'products':
        setStoreConfig({ ...storeConfig, productGrid: { ...storeConfig.productGrid, visible: !storeConfig.productGrid.visible } });
        break;
      case 'promoBanner':
        setStoreConfig({ ...storeConfig, promoBanner: { ...storeConfig.promoBanner, visible: !storeConfig.promoBanner.visible } });
        break;
      case 'testimonials':
        setStoreConfig({ ...storeConfig, testimonials: { ...storeConfig.testimonials, visible: !storeConfig.testimonials.visible } });
        break;
      case 'faq':
        setStoreConfig({ ...storeConfig, faq: { ...storeConfig.faq, visible: !storeConfig.faq.visible } });
        break;
      case 'contact':
        setStoreConfig({
          ...storeConfig,
          contact: {
            ...(storeConfig.contact || DEFAULT_STORE_CONFIG.contact!),
            visible: !(storeConfig.contact?.visible ?? true),
          },
        });
        break;
      case 'trustBadges':
        setStoreConfig({ ...storeConfig, trustBadges: { ...storeConfig.trustBadges, visible: !storeConfig.trustBadges.visible } });
        break;
      case 'flashSale':
        setStoreConfig({ ...storeConfig, flashSale: { ...storeConfig.flashSale, visible: !storeConfig.flashSale.visible } });
        break;
      case 'footer':
        setStoreConfig({ ...storeConfig, footer: { ...storeConfig.footer, visible: !storeConfig.footer.visible } });
        break;
    }
  };

  // Add new category
  const handleAddCategory = (newCat: string) => {
    if (!storeConfig.categories.includes(newCat)) {
      setStoreConfig({
        ...storeConfig,
        categories: [...storeConfig.categories, newCat],
      });
    }
  };

  // Render individual block according to blockId
  const renderBlock = (blockId: BlockId, index: number) => {
    switch (blockId) {
      case 'hero':
        return (
          <HeroBlock
            key="hero"
            config={storeConfig.hero}
            isAdmin={isAdmin}
            onUpdate={(updated) => setStoreConfig({ ...storeConfig, hero: updated })}
            onMoveUp={index > 0 ? () => handleMoveBlock(index, 'up') : undefined}
            onMoveDown={index < storeConfig.blockOrder.length - 1 ? () => handleMoveBlock(index, 'down') : undefined}
            onToggleHide={() => handleToggleBlockVisibility('hero')}
            onExploreClick={() => {
              const el = document.getElementById('catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        );

      case 'categoryShowcase':
        return (
          <CategoryShowcaseBlock
            key="categoryShowcase"
            config={storeConfig.categoryShowcase || DEFAULT_STORE_CONFIG.categoryShowcase}
            isAdmin={isAdmin}
            onUpdate={(updated) => setStoreConfig({ ...storeConfig, categoryShowcase: updated })}
            onSelectCategory={(cat) => {
              const el = document.getElementById('catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onMoveUp={index > 0 ? () => handleMoveBlock(index, 'up') : undefined}
            onMoveDown={index < storeConfig.blockOrder.length - 1 ? () => handleMoveBlock(index, 'down') : undefined}
            onToggleHide={() => handleToggleBlockVisibility('categoryShowcase')}
          />
        );

      case 'trustBadges':
        return (
          <TrustBadgesBlock
            key="trustBadges"
            config={storeConfig.trustBadges || DEFAULT_STORE_CONFIG.trustBadges!}
            isAdmin={isAdmin}
            onUpdate={(updated) => setStoreConfig({ ...storeConfig, trustBadges: updated })}
            onMoveUp={index > 0 ? () => handleMoveBlock(index, 'up') : undefined}
            onMoveDown={index < storeConfig.blockOrder.length - 1 ? () => handleMoveBlock(index, 'down') : undefined}
            onToggleHide={() => handleToggleBlockVisibility('trustBadges')}
            onOpenLegalModal={handleOpenLegalModal}
          />
        );

      case 'flashSale':
        return (
          <FlashSaleBlock
            key="flashSale"
            config={storeConfig.flashSale || DEFAULT_STORE_CONFIG.flashSale!}
            isAdmin={isAdmin}
            onUpdate={(updated) => setStoreConfig({ ...storeConfig, flashSale: updated })}
            onApplyPromoCode={(code) => {
              handleApplyPromoCode(code);
              setIsCartOpen(true);
            }}
            onMoveUp={index > 0 ? () => handleMoveBlock(index, 'up') : undefined}
            onMoveDown={index < storeConfig.blockOrder.length - 1 ? () => handleMoveBlock(index, 'down') : undefined}
            onToggleHide={() => handleToggleBlockVisibility('flashSale')}
          />
        );

      case 'valueProps':
        return (
          <ValuePropsBlock
            key="valueProps"
            config={storeConfig.valueProps}
            isAdmin={isAdmin}
            onUpdate={(updated) => setStoreConfig({ ...storeConfig, valueProps: updated })}
            onMoveUp={index > 0 ? () => handleMoveBlock(index, 'up') : undefined}
            onMoveDown={index < storeConfig.blockOrder.length - 1 ? () => handleMoveBlock(index, 'down') : undefined}
            onToggleHide={() => handleToggleBlockVisibility('valueProps')}
          />
        );

      case 'products':
        return (
          <ProductGridBlock
            key="products"
            config={storeConfig.productGrid}
            products={products}
            categories={storeConfig.categories}
            currency={storeConfig.theme.currency}
            isAdmin={isAdmin}
            wishlistIds={wishlistIds}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onUpdateConfig={(updated) => setStoreConfig({ ...storeConfig, productGrid: updated })}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onDuplicateProduct={handleDuplicateProduct}
            onAddNewProduct={handleAddNewProduct}
            onOpenProductPage={handleOpenProductPage}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onToggleWishlist={handleToggleWishlist}
            onAddCategory={handleAddCategory}
            onMoveUp={index > 0 ? () => handleMoveBlock(index, 'up') : undefined}
            onMoveDown={index < storeConfig.blockOrder.length - 1 ? () => handleMoveBlock(index, 'down') : undefined}
            onToggleHide={() => handleToggleBlockVisibility('products')}
          />
        );

      case 'promoBanner':
        return (
          <PromoBannerBlock
            key="promoBanner"
            config={storeConfig.promoBanner}
            isAdmin={isAdmin}
            onUpdate={(updated) => setStoreConfig({ ...storeConfig, promoBanner: updated })}
            onApplyPromoCode={(code) => {
              handleApplyPromoCode(code);
              setIsCartOpen(true);
            }}
            onMoveUp={index > 0 ? () => handleMoveBlock(index, 'up') : undefined}
            onMoveDown={index < storeConfig.blockOrder.length - 1 ? () => handleMoveBlock(index, 'down') : undefined}
            onToggleHide={() => handleToggleBlockVisibility('promoBanner')}
          />
        );

      case 'faq':
        return (
          <FaqBlock
            key="faq"
            config={storeConfig.faq || DEFAULT_STORE_CONFIG.faq!}
            isAdmin={isAdmin}
            onUpdate={(updated) => setStoreConfig({ ...storeConfig, faq: updated })}
            onMoveUp={index > 0 ? () => handleMoveBlock(index, 'up') : undefined}
            onMoveDown={index < storeConfig.blockOrder.length - 1 ? () => handleMoveBlock(index, 'down') : undefined}
            onToggleHide={() => handleToggleBlockVisibility('faq')}
            onOpenLegalModal={handleOpenLegalModal}
          />
        );

      case 'testimonials':
        return (
          <TestimonialsBlock
            key="testimonials"
            config={storeConfig.testimonials}
            isAdmin={isAdmin}
            onUpdate={(updated) => setStoreConfig({ ...storeConfig, testimonials: updated })}
            onMoveUp={index > 0 ? () => handleMoveBlock(index, 'up') : undefined}
            onMoveDown={index < storeConfig.blockOrder.length - 1 ? () => handleMoveBlock(index, 'down') : undefined}
            onToggleHide={() => handleToggleBlockVisibility('testimonials')}
          />
        );

      case 'contact':
        return (
          <ContactBlock
            key="contact"
            config={storeConfig.contact || DEFAULT_STORE_CONFIG.contact}
            isAdmin={isAdmin}
            onUpdate={(updated) => setStoreConfig({ ...storeConfig, contact: updated })}
            onMoveUp={index > 0 ? () => handleMoveBlock(index, 'up') : undefined}
            onMoveDown={index < storeConfig.blockOrder.length - 1 ? () => handleMoveBlock(index, 'down') : undefined}
            onToggleHide={() => handleToggleBlockVisibility('contact')}
          />
        );

      case 'footer':
        return (
          <FooterBlock
            key="footer"
            config={storeConfig.footer}
            storeName={storeConfig.header.storeName}
            isAdmin={isAdmin}
            legalDocuments={storeConfig.legalDocuments || DEFAULT_STORE_CONFIG.legalDocuments}
            onOpenLegalModal={handleOpenLegalModal}
            onAddNewLegalDoc={() => {
              setCustomizerInitialTab('legal');
              setIsBlockCustomizerOpen(true);
            }}
            onEditLegalDoc={(doc) => {
              setCustomizerInitialTab('legal');
              setIsBlockCustomizerOpen(true);
            }}
            onDeleteLegalDoc={(docId) => {
              const updated = (storeConfig.legalDocuments || []).filter((d) => d.id !== docId);
              setStoreConfig({ ...storeConfig, legalDocuments: updated });
            }}
            onUpdate={(updated) => setStoreConfig({ ...storeConfig, footer: updated })}
            onMoveUp={index > 0 ? () => handleMoveBlock(index, 'up') : undefined}
            onMoveDown={index < storeConfig.blockOrder.length - 1 ? () => handleMoveBlock(index, 'down') : undefined}
            onToggleHide={() => handleToggleBlockVisibility('footer')}
          />
        );

      default:
        return null;
    }
  };

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  // Determine viewport width container styling if in simulation mode
  const viewportContainerClass =
    isAdmin && viewportMode === 'tablet'
      ? 'max-w-[768px] mx-auto my-6 border-8 border-zinc-800 rounded-3xl shadow-2xl overflow-hidden theme-surface'
      : isAdmin && viewportMode === 'mobile'
      ? 'max-w-[390px] mx-auto my-6 border-8 border-zinc-800 rounded-3xl shadow-2xl overflow-hidden theme-surface'
      : 'w-full';

  return (
    <div
      className={`min-h-screen theme-container theme-${storeConfig.theme.palette}`}
      style={{
        ...(storeConfig.theme.fontColor
          ? { color: storeConfig.theme.fontColor, '--text-primary': storeConfig.theme.fontColor }
          : {}),
        ...(storeConfig.theme.accentColor
          ? { '--accent-color': storeConfig.theme.accentColor }
          : {}),
        ...(storeConfig.theme.bgColor
          ? { backgroundColor: storeConfig.theme.bgColor, '--bg-primary': storeConfig.theme.bgColor }
          : {}),
        ...(storeConfig.theme.cardBgColor
          ? { '--card-bg': storeConfig.theme.cardBgColor }
          : {}),
      } as React.CSSProperties}
    >
      {/* Admin Studio Sticky Toolbar */}
      <AdminTopBar
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        onAddProduct={handleAddNewProduct}
        onOpenBlockCustomizer={(tab = 'blocks') => {
          setCustomizerInitialTab(tab);
          setIsBlockCustomizerOpen(true);
        }}
        onResetStore={handleResetToDefaults}
        onExportStore={() => {
          setCustomizerInitialTab('theme');
          setIsBlockCustomizerOpen(true);
        }}
        viewportMode={viewportMode}
        setViewportMode={setViewportMode}
        totalProductsCount={products.length}
        totalOrdersCount={orders.length}
      />

      {/* Main Viewport Container */}
      <div className={viewportContainerClass}>
        {/* Header Block adhering to Top Bar Contract */}
        <Header
          config={storeConfig.header}
          isAdmin={isAdmin}
          cartCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
          wishlistCount={wishlistIds.length}
          onOpenCart={() => setIsCartOpen(true)}
          onToggleAdmin={() => setIsAdmin(!isAdmin)}
          onUpdateHeader={(updated) => setStoreConfig({ ...storeConfig, header: updated })}
          onSearchClick={() => setIsSearchOpen(true)}
          onWishlistClick={() => setIsWishlistOpen(true)}
          onHomeClick={handleBackToStore}
        />

        {/* Dynamic Modular Blocks OR Dedicated Product Page View (Fulfills user request) */}
        <main>
          {activeProductPage ? (
            <ProductDetailPage
              product={activeProductPage}
              currency={storeConfig.theme.currency}
              isAdmin={isAdmin}
              isWishlisted={wishlistIds.includes(activeProductPage.id)}
              allProducts={products}
              customCartButton={storeConfig.customCartButton}
              onBack={handleBackToStore}
              onUpdateProduct={(updated) => {
                handleUpdateProduct(updated);
                setActiveProductPage(updated);
              }}
              onAddToCart={(p, qty, variant) => handleAddToCart(p, qty, variant)}
              onBuyNow={(p, qty, variant) => {
                handleAddToCart(p, qty, variant);
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              onToggleWishlist={handleToggleWishlist}
              onSelectProduct={handleOpenProductPage}
            />
          ) : (
            storeConfig.blockOrder.map((blockId, index) => renderBlock(blockId, index))
          )}
        </main>
      </div>

      {/* Slide-out Cart Drawer with Custom Action Button & Link */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={storeConfig.theme.currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        promoCode={appliedPromoCode}
        appliedDiscountPercent={appliedDiscountPercent}
        onApplyPromoCode={handleApplyPromoCode}
        customButton={storeConfig.customCartButton}
        onUpdateCustomButton={(btn) => setStoreConfig({ ...storeConfig, customCartButton: btn })}
        isAdmin={isAdmin}
      />

      {/* Checkout Modal with Dynamic Admin Payment Methods */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currency={storeConfig.theme.currency}
        appliedDiscountPercent={appliedDiscountPercent}
        paymentMethods={storeConfig.paymentMethods}
        onOrderPlaced={handleOrderPlaced}
        onClearCart={() => setCartItems([])}
      />

      {/* Product Quick-View Detail Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        currency={storeConfig.theme.currency}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        currency={storeConfig.theme.currency}
        onSelectProduct={(p) => {
          handleOpenProductPage(p);
          setIsSearchOpen(false);
        }}
        onApplySearchQuery={(q) => {
          handleBackToStore();
          setSearchQuery(q);
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        currency={storeConfig.theme.currency}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onRemoveWishlist={handleToggleWishlist}
        onSelectProduct={(p) => {
          handleOpenProductPage(p);
          setIsWishlistOpen(false);
        }}
      />

      {/* Legal & Policy Modal (Customer View & Quick Admin Edit) */}
      <LegalDocumentModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        documents={storeConfig.legalDocuments || DEFAULT_STORE_CONFIG.legalDocuments || []}
        activeDocumentId={activeLegalDocId}
        isAdmin={isAdmin}
        onEditDocument={(doc) => {
          setIsLegalModalOpen(false);
          setCustomizerInitialTab('legal');
          setIsBlockCustomizerOpen(true);
        }}
      />

      {/* Admin Block & Theme Customizer Drawer */}
      <AdminBlockCustomizer
        isOpen={isBlockCustomizerOpen}
        onClose={() => setIsBlockCustomizerOpen(false)}
        initialTab={customizerInitialTab}
        config={storeConfig}
        products={products}
        orders={orders}
        expenses={expenses}
        onUpdateConfig={(newConfig) => setStoreConfig(newConfig)}
        onUpdateProducts={(newProducts) => setProducts(newProducts)}
        onLoadPreset={handleLoadPreset}
        onResetToDefaults={handleResetToDefaults}
        onAddNewProduct={handleAddNewProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        onAddManualOrder={handleAddManualOrder}
        onAddExpense={handleAddExpense}
        onDeleteExpense={handleDeleteExpense}
      />
    </div>
  );
}
