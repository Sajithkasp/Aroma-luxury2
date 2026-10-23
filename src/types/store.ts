export type ColorTheme = 'aurora-luxe' | 'minimal' | 'warm-paper' | 'nordic' | 'midnight' | 'terracotta';
export type FontStyle = 'sans' | 'serif' | 'display';
export type Currency = '$' | 'Rs.' | 'LKR' | '€' | '£';
export type CornerRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface Product {
  id: string;
  title: string;
  price: number;
  costPrice?: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[]; // Multiple product gallery images
  description: string;
  badge?: string;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  variants?: {
    sizes?: string[];
    colors?: { name: string; hex: string }[];
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface HeaderBlockConfig {
  storeName: string;
  brandNameLink?: string;
  logoUrl?: string;
  logoLink?: string;
  tagline: string;
  showAnnouncement: boolean;
  announcementText: string;
  announcementLinkText?: string;
  navLinks: { id: string; label: string; href: string }[];
}

export interface HeroBlockConfig {
  visible: boolean;
  title: string;
  subtitle: string;
  badgeText: string;
  ctaText: string;
  ctaSecondaryText: string;
  heroImage: string;
  alignment: 'left' | 'center' | 'split';
}

export interface CategoryShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  icon?: 'dress' | 'bag' | 'sparkles' | 'footwear' | 'accessories' | 'watch';
  linkCategory: string;
}

export interface CategoryShowcaseBlockConfig {
  visible: boolean;
  title: string;
  items: CategoryShowcaseItem[];
}

export interface ProductGridBlockConfig {
  visible: boolean;
  title: string;
  subtitle: string;
  columns: 2 | 3 | 4;
  showCategories: boolean;
}

export interface ValuePropsBlockConfig {
  visible: boolean;
  title: string;
  items: {
    id: string;
    icon: 'truck' | 'shield' | 'refresh' | 'clock' | 'sparkles' | 'leaf';
    title: string;
    description: string;
  }[];
}

export interface PromoBannerBlockConfig {
  visible: boolean;
  tag: string;
  title: string;
  description: string;
  ctaText: string;
  discountCode: string;
  discountPercent: number;
  bgStyle: 'dark' | 'accent' | 'subtle';
}

export interface TestimonialsBlockConfig {
  visible: boolean;
  title: string;
  subtitle: string;
  items: {
    id: string;
    author: string;
    role: string;
    avatar?: string;
    quote: string;
    rating: number;
  }[];
}

export type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'whatsapp'
  | 'tiktok'
  | 'youtube'
  | 'twitter'
  | 'linkedin'
  | 'pinterest';

export interface SocialLinkItem {
  id: string;
  platform: SocialPlatform;
  url: string;
  enabled: boolean;
}

export interface FooterBlockConfig {
  visible: boolean;
  aboutText: string;
  copyrightText: string;
  showSocials: boolean;
  phone: string;
  email: string;
  address: string;
  socialLinks?: SocialLinkItem[];
}

export interface LegalDocument {
  id: string;
  title: string;
  slug: string;
  category: 'shipping' | 'returns' | 'privacy' | 'terms' | 'guarantee' | 'custom';
  summary: string;
  content: string;
  lastUpdated: string;
  enabled: boolean;
}

export interface FlashSaleBlockConfig {
  visible: boolean;
  title: string;
  subtitle: string;
  endsAt: string;
  badgeText: string;
  discountCode: string;
  discountPercent: number;
  ctaText: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  enabled: boolean;
}

export interface FaqBlockConfig {
  visible: boolean;
  title: string;
  subtitle: string;
  items: FaqItem[];
}

export interface ContactBlockConfig {
  visible: boolean;
  title: string;
  subtitle: string;
  phone: string;
  email: string;
  address: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  showNewsletter: boolean;
  showContactForm: boolean;
}

export interface TrustBadgeItem {
  id: string;
  icon: 'truck' | 'shield' | 'refresh' | 'sparkles' | 'headset' | 'award';
  title: string;
  subtitle: string;
  enabled: boolean;
}

export interface TrustBadgesConfig {
  visible: boolean;
  items: TrustBadgeItem[];
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  location?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  instructions?: string;
  type: 'cod' | 'card' | 'bank_transfer' | 'bnpl' | 'custom';
}

export interface CustomCartButtonConfig {
  visible: boolean;
  text: string;
  url: string;
  style: 'primary' | 'whatsapp' | 'outline';
}

export type BlockId =
  | 'hero'
  | 'categoryShowcase'
  | 'trustBadges'
  | 'flashSale'
  | 'valueProps'
  | 'products'
  | 'promoBanner'
  | 'testimonials'
  | 'faq'
  | 'contact'
  | 'footer';

export interface StoreConfig {
  theme: {
    palette: ColorTheme;
    fontStyle: FontStyle;
    currency: Currency;
    borderRadius: CornerRadius;
    fontColor?: string;
    accentColor?: string;
    bgColor?: string;
    cardBgColor?: string;
  };
  header: HeaderBlockConfig;
  hero: HeroBlockConfig;
  categoryShowcase?: CategoryShowcaseBlockConfig;
  trustBadges: TrustBadgesConfig;
  flashSale: FlashSaleBlockConfig;
  productGrid: ProductGridBlockConfig;
  valueProps: ValuePropsBlockConfig;
  promoBanner: PromoBannerBlockConfig;
  faq: FaqBlockConfig;
  testimonials: TestimonialsBlockConfig;
  contact?: ContactBlockConfig;
  footer: FooterBlockConfig;
  legalDocuments: LegalDocument[];
  freeShippingThreshold: number;
  paymentMethods: PaymentMethodConfig[];
  customCartButton: CustomCartButtonConfig;
  blockOrder: BlockId[];
  categories: string[];
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface CustomerOrder {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  cogs?: number;
  trackingNumber?: string;
  adminNotes?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  paymentMethod: string;
  status: OrderStatus;
}

export type ExpenseCategory =
  | 'marketing'
  | 'packaging'
  | 'shipping'
  | 'operations'
  | 'salaries'
  | 'inventory'
  | 'software'
  | 'other';

export interface ManualExpense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes?: string;
}

export interface PnLSummary {
  grossRevenue: number;
  discountsGiven: number;
  netRevenue: number;
  cogs: number;
  shippingIncome: number;
  shippingActualCost: number;
  grossProfit: number;
  grossMarginPercent: number;
  totalExpenses: number;
  expensesByCategory: Record<ExpenseCategory, number>;
  netProfit: number;
  netMarginPercent: number;
}
