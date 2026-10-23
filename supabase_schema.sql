-- ==============================================================================
-- AURORA LUXE E-COMMERCE - FULL SUPABASE DATABASE & STORAGE SCHEMA
-- ==============================================================================
-- Run this complete SQL script in your Supabase Dashboard:
-- 1. Open your project on https://supabase.com
-- 2. Go to "SQL Editor" in the left sidebar
-- 3. Click "New query", paste this entire script, and click "Run"
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLE: store_config (Global Store Settings, Modular Blocks, Theme, Layout)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.store_config (
    id TEXT PRIMARY KEY DEFAULT 'default',
    theme JSONB NOT NULL DEFAULT '{
        "palette": "aurora-luxe",
        "fontStyle": "serif",
        "currency": "Rs.",
        "borderRadius": "md",
        "fontColor": "#121212",
        "accentColor": "#b58d4a",
        "bgColor": "#faf8f5",
        "cardBgColor": "#ffffff"
    }'::jsonb,
    header JSONB NOT NULL DEFAULT '{
        "storeName": "AURORA LUXE",
        "tagline": "Curated Luxury & Modern Essentials",
        "logoUrl": "",
        "showAnnouncement": true,
        "announcementText": "⚡ Free Express Shipping on all islandwide orders over Rs. 5,000!",
        "navLinks": [
            {"id": "nav-1", "label": "Home", "href": "#"},
            {"id": "nav-2", "label": "Collection", "href": "#products"},
            {"id": "nav-3", "label": "Categories", "href": "#categories"},
            {"id": "nav-4", "label": "Reviews", "href": "#reviews"},
            {"id": "nav-5", "label": "Contact", "href": "#contact"}
        ]
    }'::jsonb,
    hero JSONB NOT NULL DEFAULT '{
        "visible": true,
        "title": "Redefine Your Lifestyle With Timeless Elegance",
        "subtitle": "Discover hand-crafted masterpieces, luxury accessories, and everyday essentials built to last a lifetime.",
        "badgeText": "NEW 2026 LUXURY DROP",
        "ctaText": "Shop The Collection",
        "ctaSecondaryText": "Explore Deals",
        "alignment": "split",
        "heroImage": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80"
    }'::jsonb,
    category_showcase JSONB NOT NULL DEFAULT '{
        "visible": true,
        "title": "Shop By Curated Category",
        "items": [
            {"id": "cat-1", "title": "WATCHES", "subtitle": "Timeless Craftsmanship", "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80", "icon": "watch", "linkCategory": "Watches"},
            {"id": "cat-2", "title": "JEWELRY", "subtitle": "Exquisite & Enduring", "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80", "icon": "sparkles", "linkCategory": "Jewelry"},
            {"id": "cat-3", "title": "LEATHER", "subtitle": "Artisan Goods", "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80", "icon": "bag", "linkCategory": "Leather"},
            {"id": "cat-4", "title": "AUDIO", "subtitle": "Acoustic Precision", "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", "icon": "accessories", "linkCategory": "Audio"}
        ]
    }'::jsonb,
    product_grid JSONB NOT NULL DEFAULT '{
        "visible": true,
        "title": "Trending Essentials",
        "subtitle": "Most sought-after premium items chosen by our community",
        "columns": 4,
        "showCategories": true
    }'::jsonb,
    value_props JSONB NOT NULL DEFAULT '{
        "visible": true,
        "title": "The Aurora Luxe Guarantee",
        "items": [
            {"id": "vp-1", "icon": "truck", "title": "Island-wide Express Delivery", "description": "Doorstep delivery within 1-3 business days."},
            {"id": "vp-2", "icon": "shield", "title": "Authenticity Guaranteed", "description": "100% genuine certified luxury products."},
            {"id": "vp-3", "icon": "refresh", "title": "7-Day Easy Returns", "description": "Hassle-free doorstep pickup exchanges."},
            {"id": "vp-4", "icon": "sparkles", "title": "Cash on Delivery", "description": "Pay cash or LankaQR upon delivery."}
        ]
    }'::jsonb,
    promo_banner JSONB NOT NULL DEFAULT '{
        "visible": true,
        "tag": "SPECIAL INVITATION",
        "title": "VIP Members Special - Get 15% Off",
        "description": "Subscribe to our priority club for secret coupon drops and VIP releases",
        "ctaText": "Claim VIP Code",
        "discountCode": "AURORA15",
        "discountPercent": 15,
        "bgStyle": "dark"
    }'::jsonb,
    testimonials JSONB NOT NULL DEFAULT '{
        "visible": true,
        "title": "Loved By Discerning Shoppers",
        "subtitle": "Verified reviews from satisfied customers across the island and beyond",
        "items": [
            {"id": "t-1", "author": "Dr. Nishantha Silva", "role": "Colombo 07", "quote": "The automatic timepiece exceeded all expectations. Exceptional build quality and swift delivery.", "rating": 5},
            {"id": "t-2", "author": "Amanda Perera", "role": "Kandy", "quote": "The leather messenger bag is stunning. The aroma of genuine buffalo leather is unmistakable.", "rating": 5}
        ]
    }'::jsonb,
    faq JSONB NOT NULL DEFAULT '{
        "visible": true,
        "title": "Frequently Asked Questions",
        "subtitle": "Everything you need to know about our products, delivery, and guarantees",
        "items": [
            {"id": "faq-1", "question": "Do you deliver islandwide?", "answer": "Yes! We deliver to any address across Sri Lanka via Koombiyo and Pronto Express.", "category": "Delivery", "enabled": true},
            {"id": "faq-2", "question": "Can I pay Cash on Delivery?", "answer": "Yes, Cash on Delivery (COD) is available islandwide.", "category": "Payment", "enabled": true}
        ]
    }'::jsonb,
    contact JSONB NOT NULL DEFAULT '{
        "visible": true,
        "title": "We Are Here To Help",
        "subtitle": "Have a custom order or need product advice? Reach out anytime.",
        "phone": "+94 77 123 4567",
        "email": "concierge@auroraluxe.com",
        "address": "45 Galle Road, Colombo 03, Sri Lanka",
        "newsletterTitle": "LET''S STAY IN TOUCH",
        "newsletterSubtitle": "Be the first to know about new arrivals and exclusive offers.",
        "showNewsletter": true,
        "showContactForm": true
    }'::jsonb,
    footer JSONB NOT NULL DEFAULT '{
        "visible": true,
        "copyrightText": "© 2026 Aurora Luxe Inc. All rights reserved.",
        "aboutText": "Dedicated to offering premier craftsmanship, fair pricing, and remarkable customer experiences.",
        "showSocials": true,
        "phone": "+94 77 123 4567",
        "email": "concierge@auroraluxe.com",
        "address": "45 Galle Road, Colombo 03, Sri Lanka",
        "socialLinks": [
            {"id": "soc-1", "platform": "instagram", "url": "https://instagram.com", "enabled": true},
            {"id": "soc-2", "platform": "facebook", "url": "https://facebook.com", "enabled": true},
            {"id": "soc-3", "platform": "whatsapp", "url": "https://whatsapp.com", "enabled": true}
        ]
    }'::jsonb,
    trust_badges JSONB NOT NULL DEFAULT '{"visible": false, "items": []}'::jsonb,
    flash_sale JSONB NOT NULL DEFAULT '{
        "visible": false,
        "title": "Midnight Flash Sale",
        "subtitle": "Special limited batch allocation",
        "endsAt": "2026-12-31T23:59:59",
        "badgeText": "FLASH SALE",
        "discountCode": "AURORA20",
        "discountPercent": 20,
        "ctaText": "Claim Offer"
    }'::jsonb,
    legal_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    payment_methods JSONB NOT NULL DEFAULT '[
        {"id": "pay-cod", "name": "Cash on Delivery (COD)", "description": "Pay in cash or LankaQR upon doorstep delivery", "enabled": true, "type": "cod"},
        {"id": "pay-card", "name": "Credit / Debit Card", "description": "Visa, MasterCard, American Express", "enabled": true, "type": "card"},
        {"id": "pay-bank", "name": "Direct Bank Transfer", "description": "Commercial Bank / HNB transfer", "enabled": true, "type": "bank_transfer", "instructions": "Commercial Bank | Acc: 1000-849201 | Aurora Luxe"}
    ]'::jsonb,
    custom_cart_button JSONB DEFAULT '{"visible": true, "text": "Order via WhatsApp", "url": "https://wa.me/94771234567", "style": "whatsapp"}'::jsonb,
    block_order JSONB NOT NULL DEFAULT '["hero", "categoryShowcase", "products", "valueProps", "promoBanner", "testimonials", "faq", "contact", "footer"]'::jsonb,
    categories JSONB NOT NULL DEFAULT '["All", "Watches", "Leather", "Audio", "Home Decor", "Accessories"]'::jsonb,
    free_shipping_threshold NUMERIC NOT NULL DEFAULT 5000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 3. TABLE: products (All Products, Variants, Images & Pricing)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    cost_price NUMERIC DEFAULT 0 CHECK (cost_price >= 0),
    original_price NUMERIC CHECK (original_price IS NULL OR original_price >= 0),
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    description TEXT DEFAULT '',
    badge TEXT,
    in_stock BOOLEAN NOT NULL DEFAULT true,
    rating NUMERIC NOT NULL DEFAULT 5.0,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT false,
    variants JSONB DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- ==============================================================================
-- 4. TABLE: customer_orders (Orders, Customer Details, Payment & Tracking)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.customer_orders (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC NOT NULL DEFAULT 0,
    shipping NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    cogs NUMERIC DEFAULT 0,
    customer JSONB NOT NULL DEFAULT '{}'::jsonb,
    payment_method TEXT NOT NULL DEFAULT 'cod',
    status TEXT NOT NULL DEFAULT 'pending',
    tracking_number TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.customer_orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.customer_orders(created_at DESC);

-- ==============================================================================
-- 5. TABLE: manual_expenses (P&L Tracking for Business Admin)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.manual_expenses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.manual_expenses(date DESC);

-- ==============================================================================
-- 6. TABLE: contact_inquiries (Customer Messages From Contact Form)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_created_at ON public.contact_inquiries(created_at DESC);

-- ==============================================================================
-- 7. TABLE: newsletter_subscribers (Email Newsletter Subscribers)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 8. TABLE: product_reviews (Verified Customer Reviews & Ratings)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.product_reviews(product_id);

-- ==============================================================================
-- 9. AUTOMATIC TIMESTAMP UPDATERS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_store_config_updated_at ON public.store_config;
CREATE TRIGGER trg_store_config_updated_at
    BEFORE UPDATE ON public.store_config
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_customer_orders_updated_at ON public.customer_orders;
CREATE TRIGGER trg_customer_orders_updated_at
    BEFORE UPDATE ON public.customer_orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_manual_expenses_updated_at ON public.manual_expenses;
CREATE TRIGGER trg_manual_expenses_updated_at
    BEFORE UPDATE ON public.manual_expenses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enable RLS on all tables
ALTER TABLE public.store_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- 10.1 Store Config Policies (Anyone can read, Anyone can update/upsert via app)
CREATE POLICY "Public read store_config" ON public.store_config FOR SELECT USING (true);
CREATE POLICY "Allow upsert store_config" ON public.store_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update store_config" ON public.store_config FOR UPDATE USING (true);

-- 10.2 Products Policies (Anyone can read, full CRUD allowed for store management)
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow delete products" ON public.products FOR DELETE USING (true);

-- 10.3 Customer Orders Policies (Anyone can place orders, full admin management)
CREATE POLICY "Public read orders" ON public.customer_orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.customer_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update orders" ON public.customer_orders FOR UPDATE USING (true);
CREATE POLICY "Allow delete orders" ON public.customer_orders FOR DELETE USING (true);

-- 10.4 Manual Expenses Policies
CREATE POLICY "Allow all on expenses" ON public.manual_expenses FOR ALL USING (true);

-- 10.5 Contact Inquiries & Newsletter Policies
CREATE POLICY "Public insert contact_inquiries" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read contact_inquiries" ON public.contact_inquiries FOR SELECT USING (true);
CREATE POLICY "Public insert newsletter_subscribers" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read newsletter_subscribers" ON public.newsletter_subscribers FOR SELECT USING (true);

-- 10.6 Product Reviews Policies
CREATE POLICY "Public read reviews" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Public insert reviews" ON public.product_reviews FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- 11. SUPABASE STORAGE BUCKET: store-media (For Product & Store Image Uploads)
-- ==============================================================================
-- Create the public bucket if not already present
INSERT INTO storage.buckets (id, name, public)
VALUES ('store-media', 'store-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS policies for 'store-media' bucket
DROP POLICY IF EXISTS "Public can view store images" ON storage.objects;
CREATE POLICY "Public can view store images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'store-media');

DROP POLICY IF EXISTS "Public can upload store images" ON storage.objects;
CREATE POLICY "Public can upload store images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'store-media');

DROP POLICY IF EXISTS "Public can update store images" ON storage.objects;
CREATE POLICY "Public can update store images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'store-media');

DROP POLICY IF EXISTS "Public can delete store images" ON storage.objects;
CREATE POLICY "Public can delete store images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'store-media');

-- ==============================================================================
-- 12. INITIAL SEED DATA
-- ==============================================================================

-- 12.1 Default Store Configuration
INSERT INTO public.store_config (id, updated_at)
VALUES ('default', now())
ON CONFLICT (id) DO NOTHING;

-- 12.2 Initial Curated Products Seed
INSERT INTO public.products (id, title, price, cost_price, original_price, category, image, images, description, badge, in_stock, rating, reviews_count, featured)
VALUES
('prod-1', 'Chronograph Heritage Automatic Watch', 48500, 24000, 56000, 'Watches', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Precision mechanical timepiece featuring sapphire crystal and Italian full-grain leather strap.', 'BESTSELLER', true, 4.9, 128, true),
('prod-2', 'Artisan Handcrafted Saddle Leather Messenger', 28900, 14000, 34500, 'Leather', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Vegetable-tanned buffalo leather bag with dedicated padded 15-inch laptop sleeve and antique brass hardware.', 'FEATURED', true, 4.8, 86, true),
('prod-3', 'Acoustic Precision Wireless Headphones', 36000, 18500, 42000, 'Audio', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Active hybrid noise cancellation, titanium dynamic drivers, 45-hour battery life, and ultra-plush memory foam.', 'TOP RATED', true, 5.0, 214, true),
('prod-4', 'Minimalist Walnut Wireless Fast Charger', 9800, 4200, 12500, 'Accessories', 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Solid American walnut block seamlessly embedded with 15W Qi-certified fast inductive charging array.', 'TRENDING', true, 4.7, 95, false),
('prod-5', 'Nordic Ceramic Minimalist Vase Set', 14500, 6800, 18000, 'Home Decor', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'Matte textured hand-spun ceramic duo designed for dry botanical and minimalist architectural arrangements.', 'HOT', true, 4.9, 64, true),
('prod-6', 'Japanese Damascus Steel Chef Cleaver 8"', 22500, 10500, 28000, 'Accessories', 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80"]'::jsonb, '67 layers of forged VG-10 high carbon Damascus steel with stabilized pakkawood ergonomic grip.', 'EXCLUSIVE', true, 4.8, 52, false)
ON CONFLICT (id) DO UPDATE SET
    block_order = '["hero", "categoryShowcase", "products", "valueProps", "promoBanner", "testimonials", "faq", "contact", "footer"]'::jsonb,
    updated_at = now();

-- Ensure any existing 'default' configuration has full visible flags
UPDATE public.store_config
SET 
    block_order = '["hero", "categoryShowcase", "products", "valueProps", "promoBanner", "testimonials", "faq", "contact", "footer"]'::jsonb,
    theme = jsonb_set(
        COALESCE(theme, '{}'::jsonb),
        '{palette}',
        '"aurora-luxe"'
    ),
    hero = jsonb_set(COALESCE(hero, '{}'::jsonb), '{visible}', 'true'::jsonb),
    category_showcase = jsonb_set(COALESCE(category_showcase, '{}'::jsonb), '{visible}', 'true'::jsonb),
    product_grid = jsonb_set(COALESCE(product_grid, '{}'::jsonb), '{visible}', 'true'::jsonb),
    value_props = jsonb_set(COALESCE(value_props, '{}'::jsonb), '{visible}', 'true'::jsonb),
    promo_banner = jsonb_set(COALESCE(promo_banner, '{}'::jsonb), '{visible}', 'true'::jsonb),
    testimonials = jsonb_set(COALESCE(testimonials, '{}'::jsonb), '{visible}', 'true'::jsonb),
    faq = jsonb_set(COALESCE(faq, '{}'::jsonb), '{visible}', 'true'::jsonb),
    contact = jsonb_set(COALESCE(contact, '{}'::jsonb), '{visible}', 'true'::jsonb),
    footer = jsonb_set(COALESCE(footer, '{}'::jsonb), '{visible}', 'true'::jsonb)
WHERE id = 'default';

