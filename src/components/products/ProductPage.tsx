import React, { useState } from 'react';
import { Product, Currency } from '../../types/store';
import { formatPrice, calculateDiscount } from '../../utils/formatters';
import { InlineEditable } from '../common/InlineEditable';
import { PRESET_IMAGE_SUGGESTIONS } from '../../data/defaultStore';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Heart, 
  Star, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ImageIcon, 
  Share2, 
  Check, 
  Zap,
  CreditCard,
  Banknote,
  Tag
} from 'lucide-react';

interface ProductPageProps {
  product: Product;
  isAdmin: boolean;
  currency: Currency;
  isWishlisted: boolean;
  allProducts: Product[];
  onBackToCatalog: () => void;
  onAddToCart: (product: Product, quantity: number, variant?: { size?: string; color?: string }) => void;
  onBuyNow: (product: Product, quantity: number, variant?: { size?: string; color?: string }) => void;
  onToggleWishlist: (id: string) => void;
  onUpdateProduct: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  isAdmin,
  currency,
  isWishlisted,
  allProducts,
  onBackToCatalog,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onUpdateProduct,
  onSelectProduct,
}) => {
  // Combine primary image and additional gallery images into a single gallery list
  const galleryImages: string[] = Array.from(
    new Set([product.image, ...(product.images || [])].filter(Boolean))
  );

  const [activeImage, setActiveImage] = useState<string>(product.image || galleryImages[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.variants?.sizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.variants?.colors?.[0]?.name
  );
  const [showAddImagePicker, setShowAddImagePicker] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Sync activeImage if product changes
  React.useEffect(() => {
    setActiveImage(product.image || galleryImages[0] || '');
    setSelectedSize(product.variants?.sizes?.[0]);
    setSelectedColor(product.variants?.colors?.[0]?.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const discount = calculateDiscount(product.originalPrice, product.price);

  const handleAddGalleryImage = (url: string) => {
    if (!url.trim()) return;
    const currentList = product.images || [product.image];
    const updated = Array.from(new Set([...currentList, url.trim()]));
    onUpdateProduct({ ...product, images: updated });
    setActiveImage(url.trim());
    setCustomImageUrl('');
    setShowAddImagePicker(false);
  };

  const handleRemoveGalleryImage = (urlToRemove: string) => {
    const currentList = product.images || [product.image];
    const updated = currentList.filter((img) => img !== urlToRemove);
    const newPrimary = product.image === urlToRemove ? (updated[0] || '') : product.image;
    onUpdateProduct({
      ...product,
      image: newPrimary,
      images: updated,
    });
    if (activeImage === urlToRemove) {
      setActiveImage(newPrimary);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleAddGalleryImage(String(event.target.result));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity, { size: selectedSize, color: selectedColor });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNowClick = () => {
    onBuyNow(product, quantity, { size: selectedSize, color: selectedColor });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Related products from the same category
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="border-b border-zinc-200 bg-zinc-50/80 sticky top-0 z-30 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={onBackToCatalog}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Products</span>
          </button>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline text-zinc-400">
              Home / {product.category} / <strong className="text-zinc-800">{product.title}</strong>
            </span>
            <button
              onClick={handleShare}
              className="p-1.5 text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Copy product link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-medium">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT: Multi-Image Interactive Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-4/3 sm:aspect-16/10 w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm group">
              <img
                src={activeImage || product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Badge on main photo */}
              {product.badge && (
                <span className="absolute top-4 left-4 bg-zinc-950 text-white text-xs font-semibold tracking-wide px-3 py-1 rounded-sm shadow-md">
                  {product.badge}
                </span>
              )}

              {/* Wishlist button */}
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-xs transition-colors shadow-md ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-white/90 text-zinc-700 hover:text-rose-600 hover:bg-white'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              {/* Out of stock overlay */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded shadow-lg">
                    Currently Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Row of Multiple Images */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-medium">
                  Product Gallery ({galleryImages.length} {galleryImages.length === 1 ? 'Photo' : 'Photos'})
                </span>
                {isAdmin && (
                  <button
                    onClick={() => setShowAddImagePicker(!showAddImagePicker)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Another Image</span>
                  </button>
                )}
              </div>

              {/* Thumbnail carousel/grid */}
              <div className="flex flex-wrap gap-2.5">
                {galleryImages.map((imgUrl, idx) => (
                  <div key={idx} className="relative group">
                    <button
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === imgUrl
                          ? 'border-zinc-950 ring-2 ring-zinc-950/20 scale-102'
                          : 'border-zinc-200 hover:border-zinc-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.title} preview ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>

                    {/* Admin delete thumbnail button */}
                    {isAdmin && galleryImages.length > 1 && (
                      <button
                        onClick={() => handleRemoveGalleryImage(imgUrl)}
                        className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        title="Delete this image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Add Image Dropdown Picker */}
            {isAdmin && showAddImagePicker && (
              <div className="p-4 bg-zinc-50 border-2 border-blue-400 rounded-xl shadow-md text-xs space-y-3 animate-slide-down">
                <div className="flex items-center justify-between font-bold text-zinc-900">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    Add Additional Image to this Product
                  </span>
                  <button
                    onClick={() => setShowAddImagePicker(false)}
                    className="text-zinc-400 hover:text-zinc-700 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {PRESET_IMAGE_SUGGESTIONS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddGalleryImage(preset.url)}
                      className="aspect-square rounded-lg border border-zinc-200 overflow-hidden hover:ring-2 hover:ring-blue-600 relative group"
                    >
                      <img src={preset.url} alt={preset.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-white p-0.5 truncate">
                        {preset.name}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-1.5">
                  <input
                    type="url"
                    placeholder="Or paste external image URL..."
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs"
                  />
                  <button
                    onClick={() => handleAddGalleryImage(customImageUrl)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                  >
                    Add
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500 border-t border-zinc-200">
                  <span>Upload image from your device:</span>
                  <label className="cursor-pointer text-blue-600 font-bold hover:underline">
                    Browse File
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Contiguous Purchase Module */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider font-semibold text-zinc-500">
                <InlineEditable
                  value={product.category}
                  onSave={(val) => onUpdateProduct({ ...product, category: val })}
                  isAdmin={isAdmin}
                  labelHint="Category"
                />
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-zinc-900">{product.rating.toFixed(1)}</span>
                <span className="text-zinc-400">({product.reviewsCount} customer reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-snug">
              <InlineEditable
                value={product.title}
                onSave={(val) => onUpdateProduct({ ...product, title: val })}
                isAdmin={isAdmin}
                labelHint="Product Title"
                className="text-zinc-900"
              />
            </h1>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-zinc-900 font-mono tabular-nums">
                  {isAdmin ? (
                    <div className="flex items-center gap-1">
                      <span className="text-base text-zinc-500 font-normal">{currency}</span>
                      <InlineEditable
                        type="number"
                        value={product.price}
                        onSave={(val) => onUpdateProduct({ ...product, price: Math.max(0, parseFloat(val) || 0) })}
                        isAdmin={isAdmin}
                        labelHint="Price"
                      />
                    </div>
                  ) : (
                    formatPrice(product.price, currency)
                  )}
                </span>

                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-zinc-400 line-through font-mono tabular-nums">
                    {formatPrice(product.originalPrice, currency)}
                  </span>
                )}
              </div>

              {discount > 0 && (
                <span className="px-2.5 py-1 bg-rose-600 text-white font-bold text-xs rounded-md shadow-xs">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <div className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <InlineEditable
                type="textarea"
                value={product.description}
                onSave={(val) => onUpdateProduct({ ...product, description: val })}
                isAdmin={isAdmin}
                labelHint="Product Description"
                className="text-zinc-600 leading-relaxed"
              />
            </div>

            {/* Variants Selector */}
            {product.variants?.sizes && product.variants.sizes.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-900 block">Select Size:</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
                        selectedSize === sz
                          ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                          : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 bg-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.variants?.colors && product.variants.colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-900 block">Select Color:</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        selectedColor === c.name
                          ? 'border-zinc-950 ring-2 ring-zinc-950/20 bg-zinc-50'
                          : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 bg-white'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Buy CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-zinc-300 rounded-xl bg-zinc-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-zinc-700 hover:text-zinc-950 font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-zinc-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-zinc-700 hover:text-zinc-950 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={handleAddToCartClick}
                  disabled={!product.inStock}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                    product.inStock
                      ? addedToast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-950 text-white hover:bg-zinc-800'
                      : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  }`}
                >
                  {addedToast ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Added to Your Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{product.inStock ? 'Add to Bag' : 'Sold Out'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instant Buy Now Button */}
              {product.inStock && (
                <button
                  onClick={handleBuyNowClick}
                  className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now with Cash on Delivery / Card</span>
                </button>
              )}
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 border-t border-zinc-200 grid grid-cols-2 gap-3 text-xs text-zinc-600">
              <div className="flex items-center gap-2 p-2.5 bg-zinc-50 rounded-xl">
                <Truck className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>Fast Express Courier Island-wide</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-zinc-50 rounded-xl">
                <Banknote className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>Cash on Delivery Available</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-zinc-50 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>100% Guaranteed Authentic</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-zinc-50 rounded-xl">
                <RefreshCw className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>7-Day Return / Exchange Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-zinc-200">
            <h3 className="text-xl font-bold text-zinc-900 mb-6">
              You May Also Like from {product.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="group cursor-pointer rounded-xl border border-zinc-200 hover:border-zinc-400 p-3 bg-white transition-all hover:shadow-md"
                >
                  <div className="aspect-4/3 rounded-lg overflow-hidden bg-zinc-100 mb-3">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-semibold text-zinc-900 text-sm line-clamp-1 mb-1">{rel.title}</h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-900 tabular-nums">{formatPrice(rel.price, currency)}</span>
                    <span className="text-zinc-500 font-medium group-hover:text-zinc-900">View Piece →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
