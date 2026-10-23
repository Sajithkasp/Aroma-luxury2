import { StoreConfig, Product } from '../types/store';
import { DEFAULT_STORE_CONFIG, DEFAULT_PRODUCTS } from './defaultStore';

export interface StorePreset {
  id: string;
  name: string;
  description: string;
  config: StoreConfig;
  products: Product[];
}

export const STORE_PRESETS: StorePreset[] = [
  {
    id: 'minimal-luxury',
    name: 'Aura Studio (Minimalist Luxury)',
    description: 'Clean monochrome aesthetic with architectural typography and premium lifestyle goods.',
    config: DEFAULT_STORE_CONFIG,
    products: DEFAULT_PRODUCTS,
  },
  {
    id: 'lankan-artisan',
    name: 'Lanka Crafts & Ceylon Living',
    description: 'Bespoke handloomed textiles, Ceylon cinnamon & spice blends, brassware, and gemstone jewelry.',
    config: {
      ...DEFAULT_STORE_CONFIG,
      theme: {
        palette: 'terracotta',
        fontStyle: 'display',
        currency: 'Rs.',
        borderRadius: 'sm',
      },
      header: {
        ...DEFAULT_STORE_CONFIG.header,
        storeName: 'CEYLON CRAFT & CO.',
        tagline: 'Authentic Island Heritage & Handcrafted Treasures',
        announcementText: 'Island-wide fast delivery & Cash on Delivery (COD) available across Sri Lanka',
      },
      hero: {
        ...DEFAULT_STORE_CONFIG.hero,
        badgeText: 'Handmade in Sri Lanka',
        title: 'Timeless Island Heritage Crafted for Today',
        subtitle: 'Support local artisan guilds preserving centuries of woodcarving, handloom weaving, and organic tea harvesting.',
        ctaText: 'Shop Island Collection',
        ctaSecondaryText: 'Artisan Stories',
      },
      categories: ['All', 'Handloom & Textiles', 'Ceylon Spices & Tea', 'Brass & Wooden Art', 'Bags & Leather'],
      productGrid: {
        ...DEFAULT_STORE_CONFIG.productGrid,
        title: 'Artisan Creations',
        subtitle: 'Ethically made by master craftswomen and men in rural workshops.',
      },
    },
    products: [
      {
        id: 'lk-1',
        title: 'Handloom Pure Cotton Barefoot-Style Throw',
        price: 8500,
        originalPrice: 9800,
        category: 'Handloom & Textiles',
        image: '/src/assets/images/product_leather_backpack_1792583490827.jpg',
        description: 'Vibrant organic handloomed cotton weave, made on traditional wooden village looms with vegetable-based natural dyes.',
        badge: 'Island Best Seller',
        inStock: true,
        rating: 4.95,
        reviewsCount: 88,
        featured: true,
      },
      {
        id: 'lk-2',
        title: 'Single-Estate Ceylon Silver Tips White Tea',
        price: 4200,
        category: 'Ceylon Spices & Tea',
        image: '/src/assets/images/product_ceramic_kettle_1792583491095.jpg',
        description: 'Ultra-rare hand-picked unopened bud tea from high-elevation Nuwara Eliya misty hills, subtle honey floral aroma.',
        badge: 'Master Blend',
        inStock: true,
        rating: 5.0,
        reviewsCount: 62,
        featured: true,
      },
      {
        id: 'lk-3',
        title: 'Hand-Carved Oiled Teak Serving Board',
        price: 6400,
        originalPrice: 7200,
        category: 'Brass & Wooden Art',
        image: '/src/assets/images/product_minimalist_timepiece_1792583491655.jpg',
        description: 'Salvaged mature Ceylon teak with organic grain and food-safe cold-pressed coconut oil finish.',
        badge: 'Craft Guild',
        inStock: true,
        rating: 4.88,
        reviewsCount: 45,
        featured: true,
      },
    ],
  },
  {
    id: 'nordic-living',
    name: 'Nordic Forest & Slow Home',
    description: 'Earthy pine accents, Scandinavian minimalism, and organic ceramic tableware.',
    config: {
      ...DEFAULT_STORE_CONFIG,
      theme: {
        palette: 'nordic',
        fontStyle: 'serif',
        currency: '€',
        borderRadius: 'lg',
      },
      header: {
        ...DEFAULT_STORE_CONFIG.header,
        storeName: 'FJELL & FORUM',
        tagline: 'Quiet Goods for Nordic Solitude',
      },
      hero: {
        ...DEFAULT_STORE_CONFIG.hero,
        title: 'Form, Function, and the Nordic Horizon',
        subtitle: 'Honoring natural timber, recycled wool, and stoneware ceramics created for the slow living sanctuary.',
        badgeText: 'Hygge Living 2026',
      },
    },
    products: DEFAULT_PRODUCTS,
  },
];
