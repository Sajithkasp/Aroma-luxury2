import React, { useState, useEffect } from 'react';
import { 
  StoreConfig, 
  Product, 
  CustomerOrder, 
  ManualExpense,
  OrderStatus,
  BlockId, 
  ColorTheme, 
  FontStyle, 
  Currency, 
  CornerRadius,
  PaymentMethodConfig,
  CustomCartButtonConfig,
  SocialLinkItem,
  SocialPlatform,
  LegalDocument
} from '../../types/store';
import { STORE_PRESETS } from '../../data/storePresets';
import { formatPrice } from '../../utils/formatters';
import { OrderManagementView } from './OrderManagementView';
import { PnLReportView } from './PnLReportView';
import { DEFAULT_STORE_CONFIG, PRESET_IMAGE_SUGGESTIONS } from '../../data/defaultStore';
import { 
  X, 
  Layers, 
  Palette, 
  ShoppingBag, 
  Store, 
  TrendingUp,
  CreditCard,
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Download, 
  RotateCcw, 
  Check, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  Banknote,
  Building,
  Zap,
  ShieldCheck,
  FileText,
  Edit3
} from 'lucide-react';

interface AdminBlockCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'blocks' | 'theme' | 'legal' | 'payments' | 'products' | 'orders' | 'pnl' | 'presets';
  config: StoreConfig;
  products: Product[];
  orders: CustomerOrder[];
  expenses: ManualExpense[];
  onUpdateConfig: (newConfig: StoreConfig) => void;
  onUpdateProducts: (newProducts: Product[]) => void;
  onLoadPreset: (presetId: string) => void;
  onResetToDefaults: () => void;
  onAddNewProduct: () => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onAddManualOrder: (order: CustomerOrder) => void;
  onAddExpense: (expense: ManualExpense) => void;
  onDeleteExpense: (id: string) => void;
}

export const AdminBlockCustomizer: React.FC<AdminBlockCustomizerProps> = ({
  isOpen,
  onClose,
  initialTab = 'blocks',
  config,
  products,
  orders,
  expenses,
  onUpdateConfig,
  onUpdateProducts,
  onLoadPreset,
  onResetToDefaults,
  onAddNewProduct,
  onUpdateOrderStatus,
  onDeleteOrder,
  onAddManualOrder,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'theme' | 'legal' | 'payments' | 'products' | 'orders' | 'pnl' | 'presets'>(
    initialTab
  );

  // Form state for adding custom payment method
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [newPayName, setNewPayName] = useState('');
  const [newPayDesc, setNewPayDesc] = useState('');
  const [newPayInstructions, setNewPayInstructions] = useState('');
  const [newPayType, setNewPayType] = useState<'cod' | 'card' | 'bank_transfer' | 'bnpl' | 'custom'>('bank_transfer');

  // Form state for Legal Documents Management
  const [isAddingLegalDoc, setIsAddingLegalDoc] = useState(false);
  const [editingLegalDocId, setEditingLegalDocId] = useState<string | null>(null);
  const [legalTitle, setLegalTitle] = useState('');
  const [legalCategory, setLegalCategory] = useState<'shipping' | 'returns' | 'privacy' | 'terms' | 'guarantee' | 'custom'>('shipping');
  const [legalSummary, setLegalSummary] = useState('');
  const [legalContent, setLegalContent] = useState('');

  // Form state for Product Editing (with full original/slashed price support)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodFormTitle, setProdFormTitle] = useState('');
  const [prodFormCategory, setProdFormCategory] = useState('');
  const [prodFormPrice, setProdFormPrice] = useState<number>(0);
  const [prodFormOriginalPrice, setProdFormOriginalPrice] = useState<string>('');
  const [prodFormCostPrice, setProdFormCostPrice] = useState<number>(0);
  const [prodFormBadge, setProdFormBadge] = useState('');
  const [prodFormDescription, setProdFormDescription] = useState('');
  const [prodFormInStock, setProdFormInStock] = useState(true);

  const handleStartEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdFormTitle(prod.title);
    setProdFormCategory(prod.category);
    setProdFormPrice(prod.price);
    setProdFormOriginalPrice(prod.originalPrice ? String(prod.originalPrice) : '');
    setProdFormCostPrice(prod.costPrice || 0);
    setProdFormBadge(prod.badge || '');
    setProdFormDescription(prod.description || '');
    setProdFormInStock(prod.inStock);
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const origPriceNum = parseFloat(prodFormOriginalPrice);
    const updated: Product = {
      ...editingProduct,
      title: prodFormTitle.trim() || 'Untitled Product',
      category: prodFormCategory.trim() || 'General',
      price: Math.max(0, prodFormPrice),
      originalPrice: (!isNaN(origPriceNum) && origPriceNum > 0) ? origPriceNum : undefined,
      costPrice: Math.max(0, prodFormCostPrice),
      badge: prodFormBadge.trim() || undefined,
      description: prodFormDescription.trim(),
      inStock: prodFormInStock,
    };
    onUpdateProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    setEditingProduct(null);
  };

  // Sync activeTab when initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  if (!isOpen) return null;

  // Reorder blocks
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...config.blockOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    onUpdateConfig({ ...config, blockOrder: newOrder });
  };

  // Toggle block visibility
  const handleToggleBlock = (blockId: BlockId) => {
    switch (blockId) {
      case 'hero':
        onUpdateConfig({ ...config, hero: { ...config.hero, visible: !config.hero.visible } });
        break;
      case 'trustBadges':
        onUpdateConfig({ ...config, trustBadges: { ...config.trustBadges, visible: !config.trustBadges?.visible } });
        break;
      case 'flashSale':
        onUpdateConfig({ ...config, flashSale: { ...config.flashSale, visible: !config.flashSale?.visible } });
        break;
      case 'categoryShowcase':
        onUpdateConfig({
          ...config,
          categoryShowcase: {
            ...(config.categoryShowcase || DEFAULT_STORE_CONFIG.categoryShowcase!),
            visible: !(config.categoryShowcase?.visible ?? true),
          },
        });
        break;
      case 'valueProps':
        onUpdateConfig({ ...config, valueProps: { ...config.valueProps, visible: !config.valueProps.visible } });
        break;
      case 'products':
        onUpdateConfig({ ...config, productGrid: { ...config.productGrid, visible: !config.productGrid.visible } });
        break;
      case 'promoBanner':
        onUpdateConfig({ ...config, promoBanner: { ...config.promoBanner, visible: !config.promoBanner.visible } });
        break;
      case 'faq':
        onUpdateConfig({ ...config, faq: { ...config.faq, visible: !config.faq?.visible } });
        break;
      case 'testimonials':
        onUpdateConfig({ ...config, testimonials: { ...config.testimonials, visible: !config.testimonials.visible } });
        break;
      case 'contact':
        onUpdateConfig({
          ...config,
          contact: {
            ...(config.contact || DEFAULT_STORE_CONFIG.contact!),
            visible: !(config.contact?.visible ?? true),
          },
        });
        break;
      case 'footer':
        onUpdateConfig({ ...config, footer: { ...config.footer, visible: !config.footer.visible } });
        break;
    }
  };

  const getBlockName = (id: BlockId): string => {
    switch (id) {
      case 'hero': return 'Hero Showcase Banner';
      case 'categoryShowcase': return 'Category Showcase Cards / List';
      case 'trustBadges': return 'Trust & Quality Badges Strip';
      case 'flashSale': return 'Live Flash Sale & Countdown';
      case 'valueProps': return 'Brand Value Propositions';
      case 'products': return 'Featured Collections & Product Catalog';
      case 'promoBanner': return 'Seasonal Promo Banner';
      case 'faq': return 'Frequently Asked Questions (FAQ)';
      case 'testimonials': return 'Customer Reviews & Proof';
      case 'contact': return 'Contact Us & Stay In Touch';
      case 'footer': return 'Footer & Brand Story';
      default: return id;
    }
  };

  const isBlockVisible = (id: BlockId): boolean => {
    switch (id) {
      case 'hero': return config.hero.visible;
      case 'categoryShowcase': return config.categoryShowcase ? config.categoryShowcase.visible : true;
      case 'trustBadges': return config.trustBadges ? config.trustBadges.visible : true;
      case 'flashSale': return config.flashSale ? config.flashSale.visible : true;
      case 'valueProps': return config.valueProps.visible;
      case 'products': return config.productGrid.visible;
      case 'promoBanner': return config.promoBanner.visible;
      case 'faq': return config.faq ? config.faq.visible : true;
      case 'testimonials': return config.testimonials.visible;
      case 'contact': return config.contact ? config.contact.visible : true;
      case 'footer': return config.footer.visible;
      default: return true;
    }
  };

  // Payment Methods Handlers
  const handleTogglePaymentMethod = (id: string) => {
    const updated = (config.paymentMethods || []).map((m) =>
      m.id === id ? { ...m, enabled: !m.enabled } : m
    );
    onUpdateConfig({ ...config, paymentMethods: updated });
  };

  const handleDeletePaymentMethod = (id: string) => {
    const updated = (config.paymentMethods || []).filter((m) => m.id !== id);
    onUpdateConfig({ ...config, paymentMethods: updated });
  };

  const handleAddPaymentMethodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayName.trim()) return;
    const newMethod: PaymentMethodConfig = {
      id: `pay-${Date.now()}`,
      name: newPayName.trim(),
      description: newPayDesc.trim() || 'Direct customer payment route',
      instructions: newPayInstructions.trim() || undefined,
      type: newPayType,
      enabled: true,
    };
    onUpdateConfig({
      ...config,
      paymentMethods: [...(config.paymentMethods || []), newMethod],
    });
    setNewPayName('');
    setNewPayDesc('');
    setNewPayInstructions('');
    setIsAddingPayment(false);
  };

  // Legal Documents Handlers (with fallback to default documents)
  const currentLegalDocs: LegalDocument[] = (config.legalDocuments && config.legalDocuments.length > 0)
    ? config.legalDocuments
    : (DEFAULT_STORE_CONFIG.legalDocuments || []);

  const handleToggleLegalDoc = (id: string) => {
    const updated = currentLegalDocs.map((d: LegalDocument) =>
      d.id === id ? { ...d, enabled: !d.enabled } : d
    );
    onUpdateConfig({ ...config, legalDocuments: updated });
  };

  const handleDeleteLegalDoc = (id: string) => {
    const updated = currentLegalDocs.filter((d: LegalDocument) => d.id !== id);
    onUpdateConfig({ ...config, legalDocuments: updated });
    if (editingLegalDocId === id) {
      setEditingLegalDocId(null);
    }
  };

  const handleStartEditLegalDoc = (doc: LegalDocument) => {
    setEditingLegalDocId(doc.id);
    setIsAddingLegalDoc(false);
    setLegalTitle(doc.title);
    setLegalCategory(doc.category);
    setLegalSummary(doc.summary);
    setLegalContent(doc.content);
  };

  const handleStartCreateLegalDoc = () => {
    setEditingLegalDocId(null);
    setIsAddingLegalDoc(true);
    setLegalTitle('');
    setLegalCategory('shipping');
    setLegalSummary('');
    setLegalContent('');
  };

  const handleSaveLegalDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalTitle.trim() || !legalContent.trim()) return;

    if (editingLegalDocId) {
      const updated = currentLegalDocs.map((d: LegalDocument) =>
        d.id === editingLegalDocId
          ? {
              ...d,
              title: legalTitle.trim(),
              category: legalCategory,
              summary: legalSummary.trim(),
              content: legalContent.trim(),
              lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            }
          : d
      );
      onUpdateConfig({ ...config, legalDocuments: updated });
      setEditingLegalDocId(null);
    } else {
      const newDoc: LegalDocument = {
        id: `doc-${Date.now()}`,
        title: legalTitle.trim(),
        slug: legalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: legalCategory,
        summary: legalSummary.trim(),
        content: legalContent.trim(),
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        enabled: true,
      };
      onUpdateConfig({
        ...config,
        legalDocuments: [...currentLegalDocs, newDoc],
      });
      setIsAddingLegalDoc(false);
    }
    setLegalTitle('');
    setLegalSummary('');
    setLegalContent('');
  };

  // Export JSON
  const handleExportJson = () => {
    const data = { config, products, orders, expenses, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `store-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const drawerMaxWidthClass =
    activeTab === 'orders' || activeTab === 'pnl' || activeTab === 'legal' ? 'max-w-5xl' : 'max-w-2xl';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className={`relative w-full ${drawerMaxWidthClass} bg-white shadow-2xl flex flex-col h-full z-10 border-l border-zinc-200 transition-all duration-300`}>
        {/* Top Header */}
        <div className="p-4 bg-blue-900 text-white flex items-center justify-between border-b border-blue-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h2 className="font-bold text-sm tracking-wide">STORE CUSTOMIZER & MANAGEMENT STUDIO</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-blue-200 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-200 bg-zinc-50 px-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('blocks')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'blocks'
                ? 'border-blue-600 text-blue-600 font-bold bg-white'
                : 'border-transparent text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Blocks</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'theme'
                ? 'border-blue-600 text-blue-600 font-bold bg-white'
                : 'border-transparent text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme & Logo</span>
          </button>

          {/* LEGAL & POLICIES TAB */}
          <button
            onClick={() => setActiveTab('legal')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'legal'
                ? 'border-blue-600 text-blue-600 font-bold bg-white'
                : 'border-transparent text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Legal & Policies ({currentLegalDocs.length})</span>
          </button>

          {/* PAYMENT METHODS TAB */}
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'payments'
                ? 'border-blue-600 text-blue-600 font-bold bg-white'
                : 'border-transparent text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payments</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'products'
                ? 'border-blue-600 text-blue-600 font-bold bg-white'
                : 'border-transparent text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600 font-bold bg-white'
                : 'border-transparent text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pnl')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'pnl'
                ? 'border-blue-600 text-blue-600 font-bold bg-white'
                : 'border-transparent text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>P&L Report & Costs</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'presets'
                ? 'border-blue-600 text-blue-600 font-bold bg-white'
                : 'border-transparent text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Presets</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BLOCKS MANAGER */}
          {activeTab === 'blocks' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Modular Page Blocks</h3>
                <p className="text-xs text-zinc-500">
                  Reorder blocks up/down or toggle visibility. The storefront immediately updates in real-time.
                </p>
              </div>

              <div className="space-y-2.5">
                {config.blockOrder.map((blockId, index) => {
                  const visible = isBlockVisible(blockId);
                  return (
                    <div
                      key={blockId}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        visible
                          ? 'bg-white border-zinc-200 shadow-xs'
                          : 'bg-zinc-100 border-zinc-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-zinc-100 text-zinc-500 text-xs font-mono font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-zinc-900">{getBlockName(blockId)}</p>
                          <span className="text-[11px] text-zinc-500">
                            {visible ? 'Active on Storefront' : 'Hidden from customers'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveBlock(index, 'up')}
                          className="p-1 text-zinc-400 hover:text-zinc-900 disabled:opacity-30 rounded hover:bg-zinc-100"
                          title="Move block up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={index === config.blockOrder.length - 1}
                          onClick={() => handleMoveBlock(index, 'down')}
                          className="p-1 text-zinc-400 hover:text-zinc-900 disabled:opacity-30 rounded hover:bg-zinc-100"
                          title="Move block down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleBlock(blockId)}
                          className={`p-1.5 rounded transition-colors ${
                            visible
                              ? 'text-zinc-700 hover:bg-zinc-100'
                              : 'text-rose-500 hover:bg-rose-50'
                          }`}
                          title={visible ? 'Hide section' : 'Show section'}
                        >
                          {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Cart Button Quick Setup */}
              <div className="pt-4 border-t border-zinc-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  Cart Custom Action Button
                </h4>
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Show WhatsApp / Custom Action Button in Cart</span>
                    <input
                      type="checkbox"
                      checked={config.customCartButton?.visible}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          customCartButton: {
                            ...(config.customCartButton || { text: 'Order via WhatsApp', url: 'https://wa.me/94771234567', style: 'whatsapp' }),
                            visible: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-0.5">Button Text:</label>
                    <input
                      type="text"
                      value={config.customCartButton?.text || ''}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          customCartButton: { ...config.customCartButton, text: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-xs"
                      placeholder="e.g. Order via WhatsApp"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-0.5">Button URL Destination:</label>
                    <input
                      type="url"
                      value={config.customCartButton?.url || ''}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          customCartButton: { ...config.customCartButton, url: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-xs font-mono"
                      placeholder="https://wa.me/9477... or https://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THEME, CURRENCY & BRAND LOGO */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              {/* Currency Selector */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">
                  Store Currency Symbol
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['Rs.', 'LKR', '$', '€', '£'] as Currency[]).map((curr) => (
                    <button
                      key={curr}
                      onClick={() =>
                        onUpdateConfig({
                          ...config,
                          theme: { ...config.theme, currency: curr },
                        })
                      }
                      className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition-all text-center ${
                        config.theme.currency === curr
                          ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Logo & Separate Links */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Brand Identity (Logo & Independent Links)
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="text-[11px] font-medium text-zinc-600 block mb-1">Brand Logo Image URL:</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={config.header.logoUrl || ''}
                        onChange={(e) =>
                          onUpdateConfig({
                            ...config,
                            header: { ...config.header, logoUrl: e.target.value },
                          })
                        }
                        className="grow px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs"
                        placeholder="Paste Logo URL or select from gallery"
                      />
                      {config.header.logoUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateConfig({
                              ...config,
                              header: { ...config.header, logoUrl: '' },
                            })
                          }
                          className="px-2.5 py-1 text-xs text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Quick gallery select for logo */}
                    <div className="flex items-center gap-2 pt-1.5">
                      <span className="text-[10px] text-zinc-500">Gallery Presets:</span>
                      <div className="flex items-center gap-1">
                        {PRESET_IMAGE_SUGGESTIONS.slice(0, 5).map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              onUpdateConfig({
                                ...config,
                                header: { ...config.header, logoUrl: preset.url },
                              })
                            }
                            className="w-6 h-6 rounded border border-zinc-300 overflow-hidden hover:ring-2 hover:ring-blue-600 transition-all"
                            title={`Select ${preset.name}`}
                          >
                            <img src={preset.url} alt={preset.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-zinc-600 block mb-1">Logo Destination Link:</label>
                      <input
                        type="text"
                        value={config.header.logoLink || '/'}
                        onChange={(e) =>
                          onUpdateConfig({
                            ...config,
                            header: { ...config.header, logoLink: e.target.value },
                          })
                        }
                        className="w-full px-2 py-1 bg-white border border-zinc-300 rounded font-mono text-xs"
                        placeholder="/"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-zinc-600 block mb-1">Brand Name Destination Link:</label>
                      <input
                        type="text"
                        value={config.header.brandNameLink || '/'}
                        onChange={(e) =>
                          onUpdateConfig({
                            ...config,
                            header: { ...config.header, brandNameLink: e.target.value },
                          })
                        }
                        className="w-full px-2 py-1 bg-white border border-zinc-300 rounded font-mono text-xs"
                        placeholder="/"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Themes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">
                  Theme Presets
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'aurora-luxe', name: 'Aurora Luxe (Official)', desc: 'Champagne silk, gold bronze & deep charcoal', bg: '#faf8f5', accent: '#b58d4a' },
                    { id: 'minimal', name: 'Minimal Obsidian', desc: 'Monochrome, architectural black & white', bg: '#ffffff', accent: '#09090b' },
                    { id: 'terracotta', name: 'Ceylon Craft Terracotta', desc: 'Warm spice, earthy brick & natural weave', bg: '#fffdfc', accent: '#9a3412' },
                    { id: 'nordic', name: 'Nordic Pine', desc: 'Subdued forest sage & Scandinavian mist', bg: '#f7f9f8', accent: '#234836' },
                    { id: 'warm-paper', name: 'Linen & Warm Paper', desc: 'Tactile Japanese washi & oatmeal paper', bg: '#fcfbf9', accent: '#292524' },
                    { id: 'midnight', name: 'Midnight Charcoal', desc: 'Dark luxury atmosphere with crisp white text', bg: '#09090b', accent: '#ffffff' },
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      onClick={() =>
                        onUpdateConfig({
                          ...config,
                          theme: { ...config.theme, palette: thm.id as ColorTheme },
                        })
                      }
                      className={`p-3 rounded-xl border text-left transition-all ${
                        config.theme.palette === thm.id
                          ? 'border-blue-600 ring-2 ring-blue-500/30 bg-blue-50/20'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-zinc-900">{thm.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="w-3.5 h-3.5 rounded-full border border-zinc-300" style={{ backgroundColor: thm.bg }} />
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: thm.accent }} />
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-500">{thm.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dedicated Front Color (Font Color) & Accent Color Customizer (User requirement: "Front color wenas karanna puluwan wennath one") */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-[#b58d4a]" />
                    <span>Front Color & Custom Palette Overrides</span>
                  </h4>
                  {(config.theme.fontColor || config.theme.accentColor || config.theme.bgColor) && (
                    <button
                      onClick={() =>
                        onUpdateConfig({
                          ...config,
                          theme: {
                            ...config.theme,
                            fontColor: undefined,
                            accentColor: undefined,
                            bgColor: undefined,
                            cardBgColor: undefined,
                          },
                        })
                      }
                      className="text-[10px] text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Colors</span>
                    </button>
                  )}
                </div>

                {/* 1. Front Color / Font Color */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-800">
                      Front Color (Text & Headings Font Color):
                    </label>
                    <span className="font-mono text-[11px] text-zinc-500">
                      {config.theme.fontColor || (config.theme.palette === 'midnight' ? '#fafafa' : '#121212')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.theme.fontColor || (config.theme.palette === 'midnight' ? '#fafafa' : '#121212')}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          theme: { ...config.theme, fontColor: e.target.value },
                        })
                      }
                      className="w-9 h-8 p-0.5 rounded border border-zinc-300 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={config.theme.fontColor || ''}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          theme: { ...config.theme, fontColor: e.target.value },
                        })
                      }
                      placeholder={config.theme.palette === 'midnight' ? '#fafafa' : '#121212'}
                      className="grow px-2 py-1 bg-white border border-zinc-300 rounded text-xs font-mono"
                    />
                  </div>

                  {/* Quick Front Color swatches */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-zinc-400">Quick Swatches:</span>
                    {[
                      { name: 'Deep Espresso', hex: '#121212' },
                      { name: 'Charcoal Noir', hex: '#1f1f1f' },
                      { name: 'Antique Bronze', hex: '#38332f' },
                      { name: 'Pure White', hex: '#ffffff' },
                      { name: 'Midnight Navy', hex: '#0f172a' },
                    ].map((sw) => (
                      <button
                        key={sw.hex}
                        type="button"
                        onClick={() =>
                          onUpdateConfig({
                            ...config,
                            theme: { ...config.theme, fontColor: sw.hex },
                          })
                        }
                        className="w-5 h-5 rounded-full border border-zinc-300 hover:scale-110 transition-transform shadow-2xs"
                        style={{ backgroundColor: sw.hex }}
                        title={sw.name}
                      />
                    ))}
                  </div>
                </div>

                {/* 2. Primary Accent / Button Gold Color */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-800">
                      Primary Accent & Button Color:
                    </label>
                    <span className="font-mono text-[11px] text-zinc-500">
                      {config.theme.accentColor || '#b58d4a'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.theme.accentColor || '#b58d4a'}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          theme: { ...config.theme, accentColor: e.target.value },
                        })
                      }
                      className="w-9 h-8 p-0.5 rounded border border-zinc-300 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={config.theme.accentColor || ''}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          theme: { ...config.theme, accentColor: e.target.value },
                        })
                      }
                      placeholder="#b58d4a"
                      className="grow px-2 py-1 bg-white border border-zinc-300 rounded text-xs font-mono"
                    />
                  </div>

                  {/* Quick Accent swatches */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-zinc-400">Quick Accents:</span>
                    {[
                      { name: 'Aurora Gold', hex: '#b58d4a' },
                      { name: 'Champagne Bronze', hex: '#967137' },
                      { name: 'Rose Gold', hex: '#c08081' },
                      { name: 'Emerald Jewel', hex: '#1e3a2b' },
                      { name: 'Crimson Silk', hex: '#881337' },
                      { name: 'Monochrome Noir', hex: '#09090b' },
                    ].map((sw) => (
                      <button
                        key={sw.hex}
                        type="button"
                        onClick={() =>
                          onUpdateConfig({
                            ...config,
                            theme: { ...config.theme, accentColor: sw.hex },
                          })
                        }
                        className="w-5 h-5 rounded-full border border-zinc-300 hover:scale-110 transition-transform shadow-2xs"
                        style={{ backgroundColor: sw.hex }}
                        title={sw.name}
                      />
                    ))}
                  </div>
                </div>

                {/* 3. Background Color */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-800">
                      Storefront Background Color:
                    </label>
                    <span className="font-mono text-[11px] text-zinc-500">
                      {config.theme.bgColor || '#faf8f5'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.theme.bgColor || '#faf8f5'}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          theme: { ...config.theme, bgColor: e.target.value },
                        })
                      }
                      className="w-9 h-8 p-0.5 rounded border border-zinc-300 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={config.theme.bgColor || ''}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          theme: { ...config.theme, bgColor: e.target.value },
                        })
                      }
                      placeholder="#faf8f5"
                      className="grow px-2 py-1 bg-white border border-zinc-300 rounded text-xs font-mono"
                    />
                  </div>
                </div>

                {/* 4. Typography Font Style */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-200">
                  <label className="text-xs font-semibold text-zinc-800 block">
                    Typography Style:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'serif', label: 'Playfair Serif', sample: 'Luxury & Editorial' },
                      { id: 'sans', label: 'Modern Sans', sample: 'Minimal & Clean' },
                      { id: 'display', label: 'Display Classical', sample: 'Heritage Silhouettes' },
                    ].map((font) => (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() =>
                          onUpdateConfig({
                            ...config,
                            theme: { ...config.theme, fontStyle: font.id as FontStyle },
                          })
                        }
                        className={`p-2 rounded-lg border text-left text-xs transition-all ${
                          config.theme.fontStyle === font.id
                            ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                        }`}
                      >
                        <span className="block font-semibold">{font.label}</span>
                        <span className="text-[10px] text-zinc-500">{font.sample}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENT METHODS MANAGER (USER REQUIREMENT) */}
          {/* "Thawa payement method add karanna wenas karanna puluwan wenna one." */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Payment Gateway & Methods</h3>
                  <p className="text-xs text-zinc-500">
                    Enable, disable, or add custom payment options for your customers.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingPayment(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Payment Method</span>
                </button>
              </div>

              {/* Add Payment Method Form */}
              {isAddingPayment && (
                <form onSubmit={handleAddPaymentMethodSubmit} className="p-4 bg-zinc-50 border-2 border-blue-400 rounded-xl space-y-3 text-xs animate-slide-down">
                  <div className="flex items-center justify-between font-bold text-zinc-900">
                    <span>New Payment Method</span>
                    <button type="button" onClick={() => setIsAddingPayment(false)} className="text-zinc-400 hover:text-zinc-700">✕</button>
                  </div>
                  <div>
                    <label className="text-zinc-700 font-semibold block mb-1">Method Name:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sampath Vishwa / Commercial Bank Transfer, Genie, FriMi"
                      value={newPayName}
                      onChange={(e) => setNewPayName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-700 font-semibold block mb-1">Short Description:</label>
                    <input
                      type="text"
                      placeholder="e.g. Transfer directly from your bank app or branch"
                      value={newPayDesc}
                      onChange={(e) => setNewPayDesc(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-700 font-semibold block mb-1">Payment Instructions (Shown when selected at checkout):</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Bank: Commercial Bank | Account: 123456789 | Name: Aura Studio | Branch: Colombo"
                      value={newPayInstructions}
                      onChange={(e) => setNewPayInstructions(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingPayment(false)}
                      className="px-3 py-1.5 border border-zinc-300 rounded-lg text-zinc-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs"
                    >
                      Save Method
                    </button>
                  </div>
                </form>
              )}

              {/* Methods List */}
              <div className="space-y-3">
                {(config.paymentMethods || []).map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 rounded-xl border transition-all ${
                      method.enabled ? 'bg-white border-zinc-200 shadow-xs' : 'bg-zinc-100 border-zinc-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-zinc-900">{method.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            method.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'
                          }`}>
                            {method.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600">{method.description}</p>
                        {method.instructions && (
                          <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 mt-1">
                            <strong>Instructions:</strong> {method.instructions}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleTogglePaymentMethod(method.id)}
                          className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                            method.enabled
                              ? 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {method.enabled ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => handleDeletePaymentMethod(method.id)}
                          className="p-1 text-zinc-400 hover:text-rose-600 rounded"
                          title="Delete payment method"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: LEGAL DOCUMENTS & POLICIES (USER REQUIREMENT) */}
          {activeTab === 'legal' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Legal Policies & Store Information
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Add, edit full policy information, delete documents, and toggle customer visibility.
                  </p>
                </div>
                {!isAddingLegalDoc && !editingLegalDocId && (
                  <button
                    onClick={handleStartCreateLegalDoc}
                    className="self-start sm:self-auto px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add New Legal Policy</span>
                  </button>
                )}
              </div>

              {/* Legal Doc Add / Edit Form */}
              {(isAddingLegalDoc || editingLegalDocId) && (
                <form
                  onSubmit={handleSaveLegalDocSubmit}
                  className="p-4 bg-zinc-50 border border-blue-200 rounded-xl space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                    <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                      {editingLegalDocId ? 'Edit Legal Document Information' : 'Create New Legal Policy'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingLegalDoc(false);
                        setEditingLegalDocId(null);
                      }}
                      className="text-xs text-zinc-400 hover:text-zinc-600"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                        Document Title *
                      </label>
                      <input
                        type="text"
                        value={legalTitle}
                        onChange={(e) => setLegalTitle(e.target.value)}
                        placeholder="e.g. Island-wide Courier Rates & Delivery"
                        className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                        Policy Category
                      </label>
                      <select
                        value={legalCategory}
                        onChange={(e) => setLegalCategory(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs"
                      >
                        <option value="shipping">Delivery & Courier Shipping</option>
                        <option value="returns">Returns & Doorstep Exchanges</option>
                        <option value="terms">Cash on Delivery & Terms</option>
                        <option value="guarantee">Quality & Artisan Guarantee</option>
                        <option value="privacy">Customer Privacy & Data Protection</option>
                        <option value="custom">Other Legal Notice</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                      Short Summary (Visible in Footer & Tooltips)
                    </label>
                    <input
                      type="text"
                      value={legalSummary}
                      onChange={(e) => setLegalSummary(e.target.value)}
                      placeholder="e.g. Delivered across all 25 districts in 2-4 business days via Pronto & Koombiyo."
                      className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="text-xs">
                    <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                      Full Policy Details & Information *
                    </label>
                    <p className="text-[10px] text-zinc-500 mb-1.5">
                      Separate paragraphs by pressing Enter twice. You can include district schedules, courier contact numbers, COD verification rules, or bank details.
                    </p>
                    <textarea
                      value={legalContent}
                      onChange={(e) => setLegalContent(e.target.value)}
                      rows={6}
                      placeholder="Write the full, official policy document content here..."
                      className="w-full px-2.5 py-2 bg-white border border-zinc-300 rounded-lg text-xs font-sans leading-relaxed focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1 border-t border-zinc-200">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingLegalDoc(false);
                        setEditingLegalDocId(null);
                      }}
                      className="px-3 py-1.5 border border-zinc-300 rounded-lg text-xs text-zinc-700 font-semibold hover:bg-zinc-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-xs"
                    >
                      {editingLegalDocId ? 'Update Policy Document' : 'Save & Publish Policy'}
                    </button>
                  </div>
                </form>
              )}

              {/* Policies List */}
              <div className="space-y-3">
                {currentLegalDocs.length === 0 ? (
                  <div className="p-8 text-center bg-zinc-50 border border-dashed border-zinc-300 rounded-xl">
                    <FileText className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                    <p className="text-xs text-zinc-600 font-medium">No legal documents configured yet.</p>
                    <button
                      onClick={handleStartCreateLegalDoc}
                      className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg"
                    >
                      Create First Policy
                    </button>
                  </div>
                ) : (
                  currentLegalDocs.map((doc: LegalDocument) => (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-xl border transition-all ${
                        doc.enabled ? 'bg-white border-zinc-200 shadow-xs' : 'bg-zinc-50 border-zinc-200 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-xs text-zinc-900">{doc.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200">
                              {doc.category}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              doc.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'
                            }`}>
                              {doc.enabled ? 'Active on Store' : 'Hidden'}
                            </span>
                            {doc.lastUpdated && (
                              <span className="text-[10px] text-zinc-400">
                                Updated {doc.lastUpdated}
                              </span>
                            )}
                          </div>

                          {doc.summary && (
                            <p className="text-xs text-zinc-600 font-medium line-clamp-2">
                              {doc.summary}
                            </p>
                          )}

                          <p className="text-[11px] text-zinc-400 line-clamp-2 italic bg-zinc-50 p-2 rounded border border-zinc-100">
                            {doc.content}
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                          <button
                            onClick={() => handleToggleLegalDoc(doc.id)}
                            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                              doc.enabled
                                ? 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            {doc.enabled ? 'Hide' : 'Show'}
                          </button>
                          <button
                            onClick={() => handleStartEditLegalDoc(doc)}
                            className="p-1.5 text-zinc-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit policy information"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLegalDoc(doc.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete policy document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCTS MANAGER (WITH ORIGINAL/SLASHED PRICE & MULTI-IMAGES) */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Product Catalog Management</h3>
                  <p className="text-xs text-zinc-500">
                    Edit selling prices, slashed/strikethrough prices (discounts), inventory, unit costs, and multi-image galleries.
                  </p>
                </div>
                <button
                  onClick={onAddNewProduct}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Product</span>
                </button>
              </div>

              {/* PRODUCT EDIT FORM (MODAL/DRAWER IN TAB) */}
              {editingProduct && (
                <form
                  onSubmit={handleSaveProductEdit}
                  className="p-4 bg-zinc-50 border-2 border-blue-400 rounded-xl space-y-4 shadow-sm animate-slide-down text-xs"
                >
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-zinc-900 text-sm">
                        Edit Product: <span className="text-blue-600 font-normal">{editingProduct.title}</span>
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="text-zinc-400 hover:text-zinc-700 text-xs font-bold"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Title */}
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={prodFormTitle}
                        onChange={(e) => setProdFormTitle(e.target.value)}
                        placeholder="e.g. Full-Grain Artisan Leather Wallet"
                        className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={prodFormCategory}
                        onChange={(e) => setProdFormCategory(e.target.value)}
                        placeholder="e.g. Bags & Carry, Living & Tableware"
                        className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs"
                      />
                    </div>

                    {/* Badge */}
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                        Badge Tag (Optional)
                      </label>
                      <input
                        type="text"
                        value={prodFormBadge}
                        onChange={(e) => setProdFormBadge(e.target.value)}
                        placeholder="e.g. Best Seller, 20% OFF, New"
                        className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs"
                      />
                    </div>

                    {/* Selling Price */}
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-900 block mb-1">
                        Selling Price ({config.theme.currency}) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        required
                        value={prodFormPrice || ''}
                        onChange={(e) => setProdFormPrice(parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 14500"
                        className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-bold text-zinc-900 focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-[10px] text-zinc-500">The actual price charged to customer.</span>
                    </div>

                    {/* Slashed / Compare-at Price (USER REQUESTED) */}
                    <div>
                      <label className="text-[11px] font-semibold text-amber-900 block mb-1 flex items-center gap-1">
                        <span>Slashed / Struck-through Price ({config.theme.currency})</span>
                        <span className="text-rose-600 font-normal text-[10px]">(For Discounts)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={prodFormOriginalPrice}
                        onChange={(e) => setProdFormOriginalPrice(e.target.value)}
                        placeholder="e.g. 18500 (Leave empty if no discount)"
                        className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-zinc-700 focus:ring-1 focus:ring-amber-500"
                      />
                      <span className="text-[10px] text-amber-700">
                        Higher original price that appears slashed out with a "Save X%" discount tag.
                      </span>
                    </div>

                    {/* Cost Price */}
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                        Cost Price / COGS ({config.theme.currency})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={prodFormCostPrice || ''}
                        onChange={(e) => setProdFormCostPrice(parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 6500"
                        className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs"
                      />
                      <span className="text-[10px] text-zinc-500">Used for P&L Profit margin calculations.</span>
                    </div>

                    {/* In Stock toggle */}
                    <div className="flex flex-col justify-end">
                      <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                        Inventory Stock Status
                      </label>
                      <button
                        type="button"
                        onClick={() => setProdFormInStock(!prodFormInStock)}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                          prodFormInStock
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {prodFormInStock ? '✓ Available In Stock' : '✗ Marked Out of Stock'}
                      </button>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                        Product Story & Description
                      </label>
                      <textarea
                        rows={3}
                        value={prodFormDescription}
                        onChange={(e) => setProdFormDescription(e.target.value)}
                        placeholder="Describe materials, dimensions, and craftsmanship..."
                        className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs leading-relaxed focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-3.5 py-1.5 border border-zinc-300 rounded-lg text-zinc-700 font-semibold hover:bg-zinc-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs"
                    >
                      Save Product Changes
                    </button>
                  </div>
                </form>
              )}

              {/* PRODUCTS LIST */}
              <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                {products.map((p) => {
                  const imgCount = p.images?.length || 1;
                  const hasDiscount = !!p.originalPrice && p.originalPrice > p.price;
                  const discountPercent = hasDiscount
                    ? Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100)
                    : 0;

                  return (
                    <div key={p.id} className="p-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs hover:bg-zinc-50/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.image}
                          alt={p.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-cover rounded-lg bg-zinc-100 shrink-0 border border-zinc-200"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-zinc-900 truncate max-w-[220px]">{p.title}</h4>
                            {p.badge && (
                              <span className="bg-zinc-100 text-zinc-700 text-[9px] px-1.5 py-0.2 rounded font-medium shrink-0">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                            <span className="text-zinc-600 font-medium">{p.category}</span>
                            <span>·</span>
                            <span className="font-bold text-zinc-900">
                              {formatPrice(p.price, config.theme.currency)}
                            </span>
                            
                            {/* Struck-through price display */}
                            {hasDiscount && (
                              <div className="flex items-center gap-1">
                                <span className="line-through text-zinc-400 text-[10px]">
                                  {formatPrice(p.originalPrice!, config.theme.currency)}
                                </span>
                                <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[9px] px-1 font-bold rounded">
                                  Save {discountPercent}%
                                </span>
                              </div>
                            )}

                            <span>·</span>
                            <span className="text-blue-600 font-medium">
                              {imgCount} {imgCount === 1 ? 'photo' : 'photos'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-auto">
                        {/* Quick edit button */}
                        <button
                          type="button"
                          onClick={() => handleStartEditProduct(p)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs flex items-center gap-1 border border-blue-200 transition-colors"
                          title="Edit full product details & prices"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        {/* Stock toggle */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = products.map((item) =>
                              item.id === p.id ? { ...item, inStock: !item.inStock } : item
                            );
                            onUpdateProducts(updated);
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                            p.inStock
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </button>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = products.filter((item) => item.id !== p.id);
                            onUpdateProducts(updated);
                          }}
                          className="text-zinc-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: ORDERS (COMPLETE ORDER MANAGEMENT SYSTEM) */}
          {activeTab === 'orders' && (
            <OrderManagementView
              orders={orders}
              products={products}
              currency={config.theme.currency}
              onUpdateOrderStatus={onUpdateOrderStatus}
              onDeleteOrder={onDeleteOrder}
              onAddManualOrder={onAddManualOrder}
            />
          )}

          {/* TAB 6: PNL REPORT & MANUAL COST ENTRY */}
          {activeTab === 'pnl' && (
            <PnLReportView
              orders={orders}
              products={products}
              expenses={expenses}
              currency={config.theme.currency}
              onAddExpense={onAddExpense}
              onDeleteExpense={onDeleteExpense}
            />
          )}

          {/* TAB 7: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Pre-Built Store Themes</h3>
                <p className="text-xs text-zinc-500">
                  Switch the entire site with one click to test customizability.
                </p>
              </div>

              <div className="space-y-3">
                {STORE_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold text-zinc-900">{preset.name}</h4>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {preset.config.theme.currency} currency
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 mb-3">{preset.description}</p>
                    </div>

                    <button
                      onClick={() => onLoadPreset(preset.id)}
                      className="self-end px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Apply Preset</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions (Export & Reset) */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs">
          <button
            onClick={onResetToDefaults}
            className="flex items-center gap-1.5 text-zinc-600 hover:text-rose-600 transition-colors"
            title="Reset store to default configuration"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors font-medium shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Store Backup (JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
