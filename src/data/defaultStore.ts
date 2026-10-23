import { Product, StoreConfig } from '../types/store';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: "AURORA HERITAGE WOMEN'S WATCH",
    price: 2450.0,
    costPrice: 950.0,
    originalPrice: 2890.0,
    category: 'Watches',
    image: '/src/assets/images/product_eclat_classic_watch_1792753757050.jpg',
    images: [
      '/src/assets/images/product_eclat_classic_watch_1792753757050.jpg',
      '/src/assets/images/hero_aurora_luxe_muse_1792753756115.jpg',
    ],
    description: 'Meticulously crafted with 18k yellow gold-plated casing, anti-reflective scratch-resistant sapphire crystal glass, and Swiss quartz movement.',
    badge: 'Limited Run',
    inStock: true,
    rating: 5.0,
    reviewsCount: 128,
    featured: true,
    variants: {
      sizes: ['36mm', '40mm'],
    },
  },
  {
    id: 'prod-2',
    title: 'LUMIÈRE DIAMOND NECKLACE',
    price: 1850.0,
    costPrice: 720.0,
    originalPrice: 2150.0,
    category: 'Jewelry',
    image: '/src/assets/images/product_diamond_necklace_1792753787713.jpg',
    images: [
      '/src/assets/images/product_diamond_necklace_1792753787713.jpg',
      '/src/assets/images/hero_aurora_luxe_muse_1792753756115.jpg',
    ],
    description: 'Hand-set brilliant cut ethically sourced diamonds set in 18k solid gold with delicate matching cable chain and adjustable clasp.',
    badge: 'Best Seller',
    inStock: true,
    rating: 4.95,
    reviewsCount: 94,
    featured: true,
  },
  {
    id: 'prod-3',
    title: 'ÉCLAT LEATHER FLAP BAG',
    price: 2950.0,
    costPrice: 1100.0,
    originalPrice: 3400.0,
    category: 'Bags',
    image: '/src/assets/images/product_lumiere_quilted_bag_1792753755543.jpg',
    images: [
      '/src/assets/images/product_lumiere_quilted_bag_1792753755543.jpg',
      '/src/assets/images/hero_aurora_luxe_muse_1792753756115.jpg',
    ],
    description: 'Signature chevron quilted calfskin leather with gold-tone hardware, burnished curb-chain strap, and dual lambskin interior compartments.',
    badge: 'Iconic',
    inStock: true,
    rating: 4.98,
    reviewsCount: 165,
    featured: true,
    variants: {
      colors: [
        { name: 'Onyx Noir', hex: '#111111' },
        { name: 'Champagne Cream', hex: '#ede6da' },
      ],
    },
  },
  {
    id: 'prod-4',
    title: 'SILK CHARMEUSE BLOUSE',
    price: 690.0,
    costPrice: 240.0,
    originalPrice: 820.0,
    category: 'Apparel',
    image: '/src/assets/images/product_silk_blouse_1792753788257.jpg',
    images: [
      '/src/assets/images/product_silk_blouse_1792753788257.jpg',
      '/src/assets/images/hero_aurora_luxe_muse_1792753756115.jpg',
    ],
    description: 'Tailored from 100% pure mulberry 22-momme silk charmeuse with hand-finished mother-of-pearl buttons and relaxed fluid drape.',
    badge: 'New Arrival',
    inStock: true,
    rating: 4.9,
    reviewsCount: 78,
    featured: true,
    variants: {
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [
        { name: 'Ivory Cream', hex: '#f6f3eb' },
        { name: 'Champagne Gold', hex: '#e6dac3' },
      ],
    },
  },
  {
    id: 'prod-5',
    title: 'LUMIÈRE QUILTED BAG',
    price: 1250.0,
    costPrice: 480.0,
    originalPrice: 1500.0,
    category: 'Bags',
    image: '/src/assets/images/product_lumiere_quilted_bag_1792753755543.jpg',
    images: [
      '/src/assets/images/product_lumiere_quilted_bag_1792753755543.jpg',
      '/src/assets/images/hero_aurora_luxe_muse_1792753756115.jpg',
    ],
    description: 'Cream diamond-quilted calf leather flap bag with antique polished turnlock and woven leather-chain shoulder strap.',
    badge: 'Popular',
    inStock: true,
    rating: 4.88,
    reviewsCount: 62,
    featured: false,
  },
  {
    id: 'prod-6',
    title: 'ÉCLAT CLASSIQUE WATCH',
    price: 890.0,
    costPrice: 320.0,
    originalPrice: 1100.0,
    category: 'Watches',
    image: '/src/assets/images/product_eclat_classic_watch_1792753757050.jpg',
    images: [
      '/src/assets/images/product_eclat_classic_watch_1792753757050.jpg',
      '/src/assets/images/hero_aurora_luxe_muse_1792753756115.jpg',
    ],
    description: 'Minimalist sunburst champagne dial watch with yellow gold-plated links and precision quartz movement.',
    badge: 'Essential',
    inStock: true,
    rating: 4.92,
    reviewsCount: 51,
    featured: false,
  },
];

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  theme: {
    palette: 'aurora-luxe',
    fontStyle: 'serif',
    currency: '$',
    borderRadius: 'md',
    fontColor: '#121212',
    accentColor: '#b58d4a',
    bgColor: '#faf8f5',
    cardBgColor: '#ffffff',
  },
  header: {
    storeName: 'AURORA LUXE',
    brandNameLink: '/',
    logoUrl: '',
    logoLink: '/',
    tagline: 'Timeless luxury. Modern elegance. Exceptional quality.',
    showAnnouncement: false,
    announcementText: 'Complimentary Worldwide White-Glove Shipping on Orders Over $500',
    announcementLinkText: 'Explore Privileges',
    navLinks: [
      { id: 'nav-1', label: 'All Catalog', href: '#catalog' },
      { id: 'nav-2', label: 'Watches', href: '#category-Watches' },
      { id: 'nav-3', label: 'Jewelry', href: '#category-Jewelry' },
      { id: 'nav-4', label: 'Bags', href: '#category-Bags' },
      { id: 'nav-5', label: 'Apparel', href: '#category-Apparel' },
    ],
  },
  hero: {
    visible: true,
    badgeText: 'NEW COLLECTION',
    title: 'Timeless Elegance',
    subtitle: 'Discover refined pieces for a life of quiet luxury.',
    ctaText: 'SHOP NOW',
    ctaSecondaryText: 'Explore Ateliers',
    heroImage: '/src/assets/images/hero_aurora_luxe_muse_1792753756115.jpg',
    alignment: 'split',
  },
  categoryShowcase: {
    visible: true,
    title: 'Curated Categories',
    items: [
      {
        id: 'cat-1',
        title: 'WATCHES',
        subtitle: 'Timeless Craftsmanship',
        image: '/src/assets/images/product_eclat_classic_watch_1792753757050.jpg',
        icon: 'watch',
        linkCategory: 'Watches',
      },
      {
        id: 'cat-2',
        title: 'JEWELRY',
        subtitle: 'Exquisite & Enduring',
        image: '/src/assets/images/product_diamond_necklace_1792753787713.jpg',
        icon: 'sparkles',
        linkCategory: 'Jewelry',
      },
      {
        id: 'cat-3',
        title: 'BAGS',
        subtitle: 'Elegant Essentials',
        image: '/src/assets/images/product_lumiere_quilted_bag_1792753755543.jpg',
        icon: 'bag',
        linkCategory: 'Bags',
      },
      {
        id: 'cat-4',
        title: 'APPAREL',
        subtitle: 'Refined Wardrobe',
        image: '/src/assets/images/product_silk_blouse_1792753788257.jpg',
        icon: 'dress',
        linkCategory: 'Apparel',
      },
    ],
  },
  productGrid: {
    visible: true,
    title: 'FEATURED COLLECTIONS',
    subtitle: 'Hand-selected icons crafted for a life of enduring beauty and quiet luxury.',
    columns: 4,
    showCategories: true,
  },
  valueProps: {
    visible: true,
    title: 'The Aurora Luxe Standards',
    items: [
      {
        id: 'vp-1',
        icon: 'truck',
        title: 'Global Express Dispatch',
        description: 'Complimentary tracked courier delivery to over 140 countries.',
      },
      {
        id: 'vp-2',
        icon: 'shield',
        title: 'Authenticity Certificate',
        description: 'Individually verified authenticity and certified precious stones.',
      },
      {
        id: 'vp-3',
        icon: 'sparkles',
        title: 'Artisan Heritage',
        description: 'Handcrafted by master jewelers with sustainable conflict-free gold.',
      },
      {
        id: 'vp-4',
        icon: 'refresh',
        title: '30-Day Concierge Returns',
        description: 'Hassle-free complimentary doorstep return collections.',
      },
    ],
  },
  promoBanner: {
    visible: true,
    tag: 'Privilege Invitation',
    title: 'Enjoy 15% on Your First Selection',
    description: 'Join our inner circle of collectors and receive private exhibition invitations and preview access.',
    ctaText: 'Apply Code AURORA15',
    discountCode: 'AURORA15',
    discountPercent: 15,
    bgStyle: 'dark',
  },
  trustBadges: {
    visible: false,
    items: [
      {
        id: 'tb-1',
        icon: 'truck',
        title: 'Global Express Delivery',
        subtitle: 'Fast, insured doorstep transit worldwide.',
        enabled: true,
      },
      {
        id: 'tb-2',
        icon: 'shield',
        title: 'Secure Concierge Checkout',
        subtitle: 'Bank-grade encryption & encrypted transactions.',
        enabled: true,
      },
      {
        id: 'tb-3',
        icon: 'refresh',
        title: '30-Day Effortless Returns',
        subtitle: 'Complimentary insured reverse courier pickup.',
        enabled: true,
      },
      {
        id: 'tb-4',
        icon: 'award',
        title: 'Certificate of Authenticity',
        subtitle: 'Every piece is certified and numbered.',
        enabled: true,
      },
    ],
  },
  flashSale: {
    visible: false,
    title: 'Private Ateliers Access · Up to 25% Off',
    subtitle: 'Strictly limited batch allocation for VIP members.',
    endsAt: '2026-10-30T23:59:59',
    badgeText: 'PRIVATE ACCESS',
    discountCode: 'AURORA25',
    discountPercent: 25,
    ctaText: 'Claim 25% Privilege',
  },
  faq: {
    visible: true,
    title: 'FREQUENTLY ASKED QUESTIONS',
    subtitle: 'Everything you need to know about our luxury pieces, shipping, authenticity, and concierge service.',
    items: [
      {
        id: 'faq-1',
        question: 'What is your return policy?',
        answer: 'We offer a complimentary 30-day return policy for all unworn items in their original luxury packaging with security tags intact. Our concierge will arrange an insured courier pickup directly from your doorstep.',
        category: 'Returns',
        enabled: true,
      },
      {
        id: 'faq-2',
        question: 'Do you offer international shipping?',
        answer: 'Yes, we provide expedited international courier shipping with DHL Express and FedEx to over 140 countries with full transit insurance included on every order.',
        category: 'Shipping',
        enabled: true,
      },
      {
        id: 'faq-3',
        question: 'How long does shipping take?',
        answer: 'Domestic orders are delivered within 2-3 business days. International express shipments arrive within 3-5 business days from our central ateliers.',
        category: 'Shipping',
        enabled: true,
      },
      {
        id: 'faq-4',
        question: 'How can I track my order?',
        answer: 'Once your order is dispatched, you will receive an email and SMS with your live tracking number and direct courier tracking link for end-to-end milestone visibility.',
        category: 'Tracking',
        enabled: true,
      },
    ],
  },
  testimonials: {
    visible: true,
    title: 'WHAT OUR CLIENTS SAY',
    subtitle: 'Reflections from verified patrons worldwide',
    items: [
      {
        id: 't-1',
        author: 'SOPHIA L.',
        role: 'New York, USA',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        quote: 'Aurora Luxe is the epitome of sophistication. Every piece I own tells a story of timeless beauty.',
        rating: 5,
      },
      {
        id: 't-2',
        author: 'ISABELLA R.',
        role: 'London, UK',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        quote: 'Exceptional quality and unparalleled elegance. Aurora Luxe has become my go-to for luxury.',
        rating: 5,
      },
      {
        id: 't-3',
        author: 'CHARLOTTE M.',
        role: 'Dubai, UAE',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        quote: 'From packaging to product, every detail is absolutely perfect. I couldn\'t be happier.',
        rating: 5,
      },
    ],
  },
  contact: {
    visible: true,
    title: 'CONTACT US',
    subtitle: "We'd love to hear from you. Reach out to us for any inquiries or personalized assistance.",
    phone: '+1 (888) 888-8888',
    email: 'hello@auroraluxe.com',
    address: '123 Aurora Lane, New York, NY 10001',
    newsletterTitle: "LET'S STAY IN TOUCH",
    newsletterSubtitle: 'Be the first to know about new arrivals and exclusive offers.',
    showNewsletter: true,
    showContactForm: true,
  },
  footer: {
    visible: true,
    aboutText: 'Timeless luxury. Modern elegance. Exceptional quality.',
    copyrightText: '© 2024 Aurora Luxe. All rights reserved.',
    showSocials: true,
    phone: '+1 (888) 888-8888',
    email: 'hello@auroraluxe.com',
    address: '123 Aurora Lane, New York, NY 10001',
    socialLinks: [
      { id: 'soc-1', platform: 'instagram', url: 'https://instagram.com', enabled: true },
      { id: 'soc-2', platform: 'facebook', url: 'https://facebook.com', enabled: true },
      { id: 'soc-3', platform: 'pinterest', url: 'https://pinterest.com', enabled: true },
      { id: 'soc-4', platform: 'tiktok', url: 'https://tiktok.com', enabled: true },
    ],
  },
  legalDocuments: [
    {
      id: 'doc-shipping',
      title: 'Island-wide Courier Rates & Delivery Schedules',
      slug: 'courier-rates',
      category: 'shipping',
      summary: 'Delivery timelines, flat courier fees across Sri Lanka, and tracking procedures.',
      lastUpdated: 'October 2026',
      enabled: true,
      content: `### 1. Delivery Coverage & Courier Network
We offer guaranteed doorstep delivery to all 25 administrative districts across Sri Lanka. Our official courier logistics partners include **Koombiyo Express**, **Pronto Lanka**, and **Certis Lanka Courier Service**.

### 2. Delivery Rates & Free Shipping
* **Orders over Rs. 10,000**: **FREE Express Shipping** island-wide.
* **Western Province (Colombo 1-15 & Suburbs)**: Flat rate of **Rs. 350**. Estimated delivery: 1 - 2 business days.
* **Outstation Districts (Kandy, Galle, Kurunegala, Matara, Jaffna, etc.)**: Flat rate of **Rs. 650**. Estimated delivery: 2 - 4 business days.

### 3. Order Processing & Live Tracking
All orders placed before 3:00 PM are packaged and dispatched from our Colombo fulfillment hub on the same day. As soon as your parcel is scanned into the courier hub, an automated SMS and WhatsApp notification containing your official Waybill / Tracking Number will be sent to your phone.`,
    },
    {
      id: 'doc-cod',
      title: 'Cash on Delivery (COD) Terms & Verification',
      slug: 'cash-on-delivery',
      category: 'terms',
      summary: 'Official terms for Cash on Delivery, phone verification, and doorstep payment options.',
      lastUpdated: 'October 2026',
      enabled: true,
      content: `### 1. Zero Upfront Payment Guarantee
We understand the peace of mind that comes with paying only when the package reaches your hands. Cash on Delivery is available for all addresses across Sri Lanka up to a maximum order value of **Rs. 75,000**.

### 2. Phone Verification Process
To protect our customers and courier personnel from fraudulent or duplicate dispatch:
1. Upon placing your COD order, our concierge will send a WhatsApp verification message or make a brief 30-second telephone call.
2. Orders that cannot be confirmed via phone within 48 hours will be automatically placed on hold.

### 3. Doorstep Settlement
Please prepare exact cash when possible. Many courier riders in Colombo and key urban hubs now also accept **LankaQR (CEFT / JustPay)** mobile bank transfers at your doorstep.`,
    },
    {
      id: 'doc-returns',
      title: '7-Day Hassle-Free Returns & Doorstep Exchange Policy',
      slug: 'return-policy',
      category: 'returns',
      summary: 'Guidelines for doorstep pickup exchanges, refunds, and return eligibility.',
      lastUpdated: 'October 2026',
      enabled: true,
      content: `### 1. 7-Day Window
We want you to be thrilled with every Aura piece. You may request an exchange or return within **7 days** of receiving your package.

### 2. Doorstep Pickup Exchange
You do not have to visit a post office or courier branch. Our team will book a reverse pickup courier directly to your home address:
* **Defective or Incorrect Item**: Aura Studio covers 100% of return shipping costs.
* **Change of Mind / Size Exchange**: We handle the courier coordination for a nominal Rs. 400 reverse pickup handling fee.

### 3. Refund Execution
Upon receipt and brief inspection of the returned item at our studio (in original packaging and unblemished condition), refunds are processed via **direct bank transfer (CEFT / SLIPS)** to your nominated bank account within 24 to 48 hours.`,
    },
    {
      id: 'doc-guarantee',
      title: 'Artisan Guild Guarantee & Lifetime Integrity',
      slug: 'artisan-guarantee',
      category: 'guarantee',
      summary: 'Our promise on materials, handcrafted quality, and 1-year complimentary warranty.',
      lastUpdated: 'October 2026',
      enabled: true,
      content: `### 1. Genuine Material Purity
Every product sold through Aura Studio undergoes strict multi-point quality inspection. We never use synthetic PU leather, hollow castings, or brittle plastics where structural resilience is required.

### 2. 1-Year Complimentary Warranty
All timepieces, leather carry goods, and precision homeware come with an official 1-Year Craftsmanship Warranty covering:
* Seam stitching and leather delamination.
* Watch movement timekeeping accuracy (mechanical/quartz).
* Solid brass and stainless steel hardware failures.

For warranty assistance, reach out directly to **concierge@aurastudio.design** or message our WhatsApp line with your order number.`,
    },
    {
      id: 'doc-privacy',
      title: 'Privacy Policy & Customer Data Protection',
      slug: 'privacy-policy',
      category: 'privacy',
      summary: 'How customer telephone numbers, delivery addresses, and payment details are safeguarded.',
      lastUpdated: 'October 2026',
      enabled: true,
      content: `### 1. Strict Non-Disclosure
Aura Studio strictly respects your privacy. We never sell, rent, or trade your personal telephone numbers, home delivery addresses, or purchase histories with third-party advertising brokers.

### 2. Courier Data Handling
Your shipping details (name, phone, address) are shared exclusively with our licensed courier partners (Koombiyo, Pronto, Certis) solely for parcel routing and delivery coordination.

### 3. Card & Banking Security
All card transactions are processed through bank-grade 256-bit SSL encrypted payment gateways. Aura Studio never stores your raw credit card numbers or CVV codes on our servers.`,
    },
  ],
  freeShippingThreshold: 500,
  paymentMethods: [
    {
      id: 'pay-card',
      name: 'Credit / Debit Card (Visa, MasterCard, Amex)',
      description: 'Instant secure 256-bit encrypted checkout.',
      enabled: true,
      type: 'card',
    },
    {
      id: 'pay-bank',
      name: 'Wire Transfer / Direct Atelier Deposit',
      description: 'Direct VIP wire transfer for private collections.',
      enabled: true,
      type: 'bank_transfer',
      instructions: 'JPMorgan Chase Bank | Acc: 9821-3490-11 | Aurora Luxe Luxury Group LLC',
    },
    {
      id: 'pay-cod',
      name: 'White-Glove Courier Delivery Payment',
      description: 'Concierge doorstep payment upon delivery.',
      enabled: true,
      type: 'cod',
    },
  ],
  customCartButton: {
    visible: true,
    text: 'Concierge VIP Inquiry',
    url: 'https://wa.me/18888888888?text=Hello%20Aurora%20Luxe%2C%20I%20would%20like%20assistance%20with%20my%20curation',
    style: 'whatsapp',
  },
  blockOrder: ['hero', 'categoryShowcase', 'products', 'testimonials', 'faq', 'contact', 'footer'],
  categories: ['All', 'Watches', 'Jewelry', 'Bags', 'Apparel'],
};

export const PRESET_IMAGE_SUGGESTIONS = [
  {
    name: 'Leather Commuter Pack',
    url: '/src/assets/images/product_leather_backpack_1792583490827.jpg',
  },
  {
    name: 'Heritage Chronograph Timepiece',
    url: '/src/assets/images/product_minimalist_timepiece_1792583491655.jpg',
  },
  {
    name: 'Ceramic Pour-Over Kettle',
    url: '/src/assets/images/product_ceramic_kettle_1792583491095.jpg',
  },
  {
    name: 'Flagship Showroom Studio',
    url: '/src/assets/images/hero_storefront_flagship_1792583490522.jpg',
  },
];

export const DEFAULT_SAMPLE_ORDERS: import('../types/store').CustomerOrder[] = [
  {
    id: 'ORD-984210',
    date: '2026-10-20 14:32',
    items: [
      {
        product: DEFAULT_PRODUCTS[0],
        quantity: 1,
        selectedColor: 'Onyx Black',
      },
      {
        product: DEFAULT_PRODUCTS[2],
        quantity: 1,
      },
    ],
    subtotal: 26300,
    discount: 5260,
    shipping: 0,
    total: 21040,
    cogs: 11700,
    trackingNumber: 'TRK-LK-884920',
    adminNotes: 'Customer requested eco-friendly packaging.',
    customer: {
      name: 'Kasun Jayawardena',
      email: 'kasun.j@example.com',
      phone: '+94 77 982 1104',
      address: '28 Havelock Road',
      city: 'Colombo 05',
      notes: 'Call before dispatching courier',
    },
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'delivered',
  },
  {
    id: 'ORD-984209',
    date: '2026-10-20 18:15',
    items: [
      {
        product: DEFAULT_PRODUCTS[1],
        quantity: 1,
        selectedSize: '40mm',
      },
    ],
    subtotal: 34000,
    discount: 0,
    shipping: 0,
    total: 34000,
    cogs: 15500,
    trackingNumber: 'TRK-LK-884918',
    customer: {
      name: 'Nipuni Wickramasinghe',
      email: 'nipuni.w@example.com',
      phone: '+94 71 445 8820',
      address: '15 Peradeniya Road',
      city: 'Kandy',
      notes: 'Please leave at reception',
    },
    paymentMethod: 'Credit / Debit Card',
    status: 'shipped',
  },
  {
    id: 'ORD-984208',
    date: '2026-10-21 02:40',
    items: [
      {
        product: DEFAULT_PRODUCTS[4],
        quantity: 2,
      },
    ],
    subtotal: 32000,
    discount: 3200,
    shipping: 0,
    total: 28800,
    cogs: 14400,
    customer: {
      name: 'Dinuka Fernando',
      email: 'dinuka.f@example.com',
      phone: '+94 76 332 9910',
      address: '77 Galle Road',
      city: 'Mount Lavinia',
    },
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'processing',
  },
  {
    id: 'ORD-984207',
    date: '2026-10-21 04:10',
    items: [
      {
        product: DEFAULT_PRODUCTS[2],
        quantity: 1,
      },
    ],
    subtotal: 7800,
    discount: 0,
    shipping: 650,
    total: 8450,
    cogs: 3200,
    customer: {
      name: 'Chaminda Silva',
      email: 'chaminda.s@example.com',
      phone: '+94 77 555 1234',
      address: '12 Beach Road',
      city: 'Negombo',
    },
    paymentMethod: 'Direct Bank Deposit',
    status: 'pending',
  },
];

export const DEFAULT_SAMPLE_EXPENSES: import('../types/store').ManualExpense[] = [
  {
    id: 'exp-1',
    title: 'Meta / Instagram Ad Campaign - Autumn Collection',
    amount: 14500,
    category: 'marketing',
    date: '2026-10-18',
    notes: 'Conversion campaign targeting design & lifestyle professionals in Colombo',
  },
  {
    id: 'exp-2',
    title: 'Custom Biodegradable Shipping Boxes & Kraft Tape',
    amount: 6800,
    category: 'packaging',
    date: '2026-10-19',
    notes: '200 custom embossed mailer boxes',
  },
  {
    id: 'exp-3',
    title: 'Local Courier Fleet Retainer & Fuel Surcharge',
    amount: 5000,
    category: 'shipping',
    date: '2026-10-20',
    notes: 'Island-wide express pickup and COD handling fee',
  },
  {
    id: 'exp-4',
    title: 'Studio Lighting & Showroom Utility Overhead',
    amount: 8500,
    category: 'operations',
    date: '2026-10-15',
    notes: 'Showroom electricity & high-speed fiber internet',
  },
];
