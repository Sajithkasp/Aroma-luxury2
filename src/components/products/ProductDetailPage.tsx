import React, { useState } from 'react';
import { Product, Currency, CustomCartButtonConfig } from '../../types/store';
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
  Share2, 
  ExternalLink,
  MessageCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Zap,
  Tag
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  currency: Currency;
  isAdmin: boolean;
  isWishlisted: boolean;
  allProducts: Product[];
  customCartButton?: CustomCartButtonConfig;
  onBack: () => void;
  onUpdateProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, variant?: { size?: string; color?: string }) => void;
  onBuyNow: (product: Product, quantity: number, variant?: { size?: string; color?: string }) => void;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  currency,
  isAdmin,
  isWishlisted,
  allProducts,
  customCartButton,
  onBack,
  onUpdateProduct,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onSelectProduct,
}) => {
  // Gallery Images List: Ensure at least [product.image]
  const imagesList = (product.images && product.images.length > 0)
    ? product.images
    : [product.image];

  const [activeImage, setActiveImage] = useState<string>(product.image || imagesList[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.variants?.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.variants?.colors?.[0]?.name || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'reviews'>('desc');
  const [showImageManager, setShowImageManager] = useState<boolean>(false);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // Sync activeImage if product changes
  React.useEffect(() => {
    setActiveImage(product.image || imagesList[0]);
    if (product.variants?.sizes?.[0]) setSelectedSize(product.variants.sizes[0]);
    if (product.variants?.colors?.[0]) setSelectedColor(product.variants.colors[0].name);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const discount = calculateDiscount(product.originalPrice, product.price);

  // Multi-Image Gallery Handlers
  const handleAddImage = (url: string) => {
    if (!url.trim()) return;
    const currentImages = product.images && product.images.length > 0 ? product.images : [product.image];
    if (currentImages.includes(url.trim())) return;
    const updatedImages = [...currentImages, url.trim()];
    onUpdateProduct({
      ...product,
      images: updatedImages,
    });
    setActiveImage(url.trim());
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const currentImages = product.images && product.images.length > 0 ? product.images : [product.image];
    if (currentImages.length <= 1) {
      return;
    }
    const updatedImages = currentImages.filter((_, idx) => idx !== indexToRemove);
    const newMain = updatedImages[0];
    onUpdateProduct({
      ...product,
      image: newMain,
      images: updatedImages,
    });
    if (activeImage === currentImages[indexToRemove]) {
      setActiveImage(newMain);
    }
  };

  const handleSetAsMainImage = (url: string) => {
    const currentImages = product.images && product.images.length > 0 ? product.images : [product.image];
    const reordered = [url, ...currentImages.filter((img) => img !== url)];
    onUpdateProduct({
      ...product,
      image: url,
      images: reordered,
    });
    setActiveImage(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleAddImage(String(event.target.result));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity, {
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNowClick = () => {
    onBuyNow(product, quantity, {
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
  };

  // Related products from same category
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="w-full bg-white text-zinc-900 pb-20 animate-fade-in">
      {/* Top Breadcrumbs & Back Navigation Bar */}
      <div className="border-b border-zinc-200/90 bg-zinc-50/70 py-3.5 sticky top-18 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-zinc-700 hover:text-blue-700 bg-white hover:bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-lg shadow-xs transition-all active:scale-95 shrink-0"
            title="Return to catalog"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Catalog</span>
          </button>

          {/* Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500 truncate">
            <span onClick={onBack} className="hover:text-zinc-900 cursor-pointer">Store Home</span>
            <span>/</span>
            <span className="font-medium text-zinc-700">{product.category}</span>
            <span>/</span>
            <span className="text-zinc-900 font-semibold truncate max-w-[280px]">{product.title}</span>
          </div>

          {/* Quick Share / Wishlist */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                isWishlisted
                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100'
              }`}
              title={isWishlisted ? 'Saved in wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
              <span className="hidden md:inline">{isWishlisted ? 'Wishlisted' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* LEFT: Multi-Image Product Gallery Stage (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image Viewer */}
            <div className="relative aspect-4/3 w-full bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200/90 shadow-sm group">
              <img
                src={activeImage}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-102"
              />

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.badge && (
                  <span className="bg-zinc-950 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md">
                    Save {discount}%
                  </span>
                )}
              </div>

              {/* Admin Multi-Image Manager Trigger Button */}
              {isAdmin && (
                <button
                  onClick={() => setShowImageManager(!showImageManager)}
                  className="absolute bottom-4 right-4 bg-blue-900/90 hover:bg-blue-950 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95 z-20"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Manage Gallery ({imagesList.length} Photos)</span>
                </button>
              )}

              {/* Stock Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                {product.inStock ? (
                  <span className="bg-emerald-50/90 backdrop-blur-xs text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>In Stock</span>
                  </span>
                ) : (
                  <span className="bg-rose-50/90 backdrop-blur-xs text-rose-800 border border-rose-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>Out of Stock</span>
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails Row: Seamlessly displays all images added for this product */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                <span className="font-semibold text-zinc-700">Product Photo Gallery:</span>
                <span>{imagesList.length} {imagesList.length === 1 ? 'photo' : 'photos'} available</span>
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {imagesList.map((imgUrl, index) => {
                  const isActive = activeImage === imgUrl;
                  const isCover = (product.image === imgUrl);
                  return (
                    <div
                      key={index}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative aspect-square w-20 sm:w-24 shrink-0 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        isActive
                          ? 'border-blue-600 ring-2 ring-blue-500/30 scale-102 shadow-md'
                          : 'border-zinc-200 hover:border-zinc-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.title} photo ${index + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {isCover && (
                        <span className="absolute bottom-0 inset-x-0 bg-zinc-950/80 text-white text-[9px] font-bold text-center py-0.5">
                          COVER
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* If Admin, quick add photo card right in thumbnail row */}
                {isAdmin && (
                  <button
                    onClick={() => setShowImageManager(true)}
                    className="aspect-square w-20 sm:w-24 shrink-0 rounded-xl border-2 border-dashed border-blue-400 hover:border-blue-600 bg-blue-50/50 hover:bg-blue-50 text-blue-700 flex flex-col items-center justify-center gap-1 text-xs font-bold transition-colors"
                    title="Add more photos to product gallery"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-[11px]">+ Add Photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Admin Multi-Image Management Drawer/Card (PowerPoint / Canva style manager) */}
            {isAdmin && showImageManager && (
              <div className="p-4 bg-zinc-50 border-2 border-blue-400 rounded-2xl space-y-4 text-xs animate-slide-down shadow-md">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <h4 className="font-bold text-sm text-zinc-900">
                      Product Gallery Manager ({imagesList.length} Photos)
                    </h4>
                  </div>
                  <button
                    onClick={() => setShowImageManager(false)}
                    className="text-zinc-400 hover:text-zinc-800 p-1 font-bold text-sm"
                  >
                    ✕ Close
                  </button>
                </div>

                <p className="text-zinc-600 text-xs">
                  Add multiple photos so customers can view this product from every angle. Click "Make Cover" to set the main catalog photo.
                </p>

                {/* Current Image List with Remove / Set Main */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imagesList.map((imgUrl, idx) => (
                    <div key={idx} className="relative rounded-xl border border-zinc-300 bg-white overflow-hidden p-1 shadow-2xs group/img">
                      <img src={imgUrl} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full aspect-square object-cover rounded-lg mb-1.5" />
                      
                      <div className="flex flex-col gap-1">
                        {product.image === imgUrl ? (
                          <span className="w-full text-center text-[10px] font-bold bg-emerald-100 text-emerald-800 py-0.5 rounded">
                            ✓ Primary Cover
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetAsMainImage(imgUrl)}
                            className="w-full text-[10px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 py-0.5 rounded transition-colors"
                          >
                            Set Cover
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="w-full text-[10px] font-semibold text-rose-600 hover:bg-rose-50 py-0.5 rounded transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Photo Options */}
                <div className="pt-2 border-t border-zinc-200 space-y-3">
                  <span className="font-bold text-zinc-800 text-xs block">+ Add Photo To Gallery:</span>

                  {/* 1. Preset Suggestions */}
                  <div>
                    <label className="text-[11px] text-zinc-500 block mb-1">Pick from curated studio collection:</label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                      {PRESET_IMAGE_SUGGESTIONS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddImage(preset.url)}
                          className="aspect-square rounded border border-zinc-200 overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Custom URL Form */}
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      placeholder="Or paste any image URL..."
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="grow px-3 py-1.5 text-xs bg-white border border-zinc-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customImageUrl.trim()) {
                          handleAddImage(customImageUrl.trim());
                          setCustomImageUrl('');
                        }
                      }}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs"
                    >
                      Add URL
                    </button>
                  </div>

                  {/* 3. Upload from Device */}
                  <div className="flex items-center justify-between text-zinc-600 text-xs pt-1">
                    <span>Upload image from your phone or computer:</span>
                    <label className="px-3 py-1 bg-white border border-zinc-300 hover:border-zinc-400 rounded-lg font-bold text-blue-600 cursor-pointer shadow-2xs">
                      Choose File
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Product Details & Purchase Actions (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Category & Rating */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                <span className="font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-zinc-400" />
                  <InlineEditable
                    value={product.category}
                    onSave={(val) => onUpdateProduct({ ...product, category: val.trim() || 'General' })}
                    isAdmin={isAdmin}
                    labelHint="Category"
                  />
                </span>

                <div className="flex items-center gap-1 text-zinc-700 font-semibold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-zinc-400 font-normal">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">
                <InlineEditable
                  value={product.title}
                  onSave={(val) => onUpdateProduct({ ...product, title: val.trim() || 'Untitled' })}
                  isAdmin={isAdmin}
                  labelHint="Product Title"
                  className="font-extrabold"
                />
              </h1>
            </div>

            {/* Price Row */}
            <div className="p-4 bg-zinc-50/80 rounded-2xl border border-zinc-200/80 flex items-center justify-between gap-4">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tabular-nums">
                  {isAdmin ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-zinc-500 font-normal">{currency}</span>
                      <InlineEditable
                        type="number"
                        value={product.price}
                        onSave={(val) => onUpdateProduct({ ...product, price: Math.max(0, parseFloat(val) || 0) })}
                        isAdmin={isAdmin}
                        labelHint="Selling Price"
                      />
                    </div>
                  ) : (
                    formatPrice(product.price, currency)
                  )}
                </div>

                {/* Slashed / Compare-at Price */}
                {isAdmin ? (
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {product.originalPrice && product.originalPrice > 0 ? (
                      <div className="flex items-center gap-1 bg-amber-50/90 border border-amber-200/90 px-2 py-0.5 rounded-lg">
                        <span className="text-xs text-zinc-400 font-normal">{currency}</span>
                        <InlineEditable
                          type="number"
                          value={product.originalPrice}
                          onSave={(val) => {
                            const num = parseFloat(val);
                            onUpdateProduct({
                              ...product,
                              originalPrice: (!isNaN(num) && num > 0) ? num : undefined,
                            });
                          }}
                          isAdmin={isAdmin}
                          labelHint="Slashed Price (Original)"
                          className="text-sm text-zinc-500 line-through font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => onUpdateProduct({ ...product, originalPrice: undefined })}
                          className="text-zinc-400 hover:text-rose-600 font-bold ml-1 text-xs"
                          title="Remove slashed price (End discount)"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const suggested = Math.round((product.price * 1.25) / 100) * 100 || (product.price + 500);
                          onUpdateProduct({ ...product, originalPrice: suggested });
                        }}
                        className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span>+ Add Slashed Price (Discount)</span>
                      </button>
                    )}

                    {discount > 0 && (
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                        Save {discount}% OFF
                      </span>
                    )}
                  </div>
                ) : (
                  product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm text-zinc-400 line-through tabular-nums">
                        {formatPrice(product.originalPrice, currency)}
                      </span>
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        Save {discount}% OFF
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* Admin Stock Toggle & Unit Cost */}
              {isAdmin && (
                <div className="flex flex-col items-end gap-1.5">
                  <button
                    onClick={() => onUpdateProduct({ ...product, inStock: !product.inStock })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      product.inStock
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {product.inStock ? 'Stock: ACTIVE' : 'Stock: OUT'}
                  </button>
                  <span className="text-[10px] text-zinc-500">
                    Cost Price: {formatPrice(product.costPrice || 0, currency)}
                  </span>
                </div>
              )}
            </div>

            {/* Color Variants (if any) */}
            {product.variants?.colors && product.variants.colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                  Select Color: <span className="text-zinc-500 font-normal">{selectedColor}</span>
                </span>
                <div className="flex items-center gap-2.5">
                  {product.variants.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === c.name
                          ? 'border-blue-600 ring-2 ring-blue-500/30 scale-110 shadow-sm'
                          : 'border-zinc-300 hover:border-zinc-500'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor === c.name && (
                        <Check className={`w-3.5 h-3.5 mx-auto ${c.hex === '#ffffff' || c.hex === '#fff' ? 'text-zinc-900' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Variants (if any) */}
            {product.variants?.sizes && product.variants.sizes.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block">
                  Select Size: <span className="text-zinc-500 font-normal">{selectedSize}</span>
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {product.variants.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedSize === s
                          ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-zinc-300 rounded-xl bg-white p-1 shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || !product.inStock}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:bg-zinc-100 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:bg-zinc-100 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Bag Button */}
                <button
                  onClick={handleAddToCartClick}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
                    product.inStock
                      ? 'theme-cta-btn bg-zinc-950 hover:bg-zinc-800 text-white'
                      : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.inStock ? `Add to Bag · ${formatPrice(product.price * quantity, currency)}` : 'Sold Out'}</span>
                </button>
              </div>

              {/* Instant Buy Now Button */}
              {product.inStock && (
                <button
                  onClick={handleBuyNowClick}
                  className="w-full py-3 px-6 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now (Instant Checkout)</span>
                </button>
              )}

              {/* Custom Cart Button / WhatsApp Order Link */}
              {customCartButton?.visible && (
                <a
                  href={`${customCartButton.url}${encodeURIComponent(` - Inquiring about ${product.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{customCartButton.text || 'Order via WhatsApp'}</span>
                </a>
              )}

              {/* Toast Feedback */}
              {addedToast && (
                <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-between shadow-lg animate-slide-down">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Added {quantity} × {product.title} to shopping bag!</span>
                  </span>
                  <button onClick={onBack} className="underline text-[11px] ml-2">Keep Shopping</button>
                </div>
              )}
            </div>

            {/* Assurance Trust Badges (Sri Lanka Focus) */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-200 text-xs">
              <div className="flex items-center gap-2.5 p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                <Truck className="w-4 h-4 text-zinc-700 shrink-0" />
                <div>
                  <p className="font-bold text-zinc-900 text-[11px]">Island-wide Fast Delivery</p>
                  <p className="text-[10px] text-zinc-500">Colombo in 24h, Outstation 48h</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                <ShieldCheck className="w-4 h-4 text-zinc-700 shrink-0" />
                <div>
                  <p className="font-bold text-zinc-900 text-[11px]">Cash on Delivery (COD)</p>
                  <p className="text-[10px] text-zinc-500">Pay safely upon receipt</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                <RefreshCw className="w-4 h-4 text-zinc-700 shrink-0" />
                <div>
                  <p className="font-bold text-zinc-900 text-[11px]">7-Day Exchange</p>
                  <p className="text-[10px] text-zinc-500">Hassle-free size & color swaps</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                <CheckCircle2 className="w-4 h-4 text-zinc-700 shrink-0" />
                <div>
                  <p className="font-bold text-zinc-900 text-[11px]">100% Genuine Quality</p>
                  <p className="text-[10px] text-zinc-500">Directly from artisan studio</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed In-Depth Information: Story, Specs, Delivery & Reviews */}
        <div className="mt-16 pt-8 border-t border-zinc-200">
          <div className="flex border-b border-zinc-200 gap-6 sm:gap-8 overflow-x-auto text-sm font-semibold">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'desc'
                  ? 'border-zinc-950 text-zinc-950 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Description & Craft
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'specs'
                  ? 'border-zinc-950 text-zinc-950 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Specifications & Details
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'shipping'
                  ? 'border-zinc-950 text-zinc-950 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Shipping & Island-wide Delivery
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'reviews'
                  ? 'border-zinc-950 text-zinc-950 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Patron Reviews ({product.reviewsCount})
            </button>
          </div>

          <div className="py-6 max-w-4xl text-sm leading-relaxed text-zinc-600">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <InlineEditable
                  type="textarea"
                  value={product.description}
                  onSave={(val) => onUpdateProduct({ ...product, description: val })}
                  isAdmin={isAdmin}
                  labelHint="Detailed Product Description"
                  className="text-zinc-700 leading-relaxed text-base"
                />
                <p>
                  Every piece undergoes a multi-point quality audit prior to final packing. We believe in heirloom objects that endure daily wear while developing a distinguished personal character over time.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1">
                  <span className="text-xs font-bold text-zinc-900 uppercase">Materials</span>
                  <p className="text-xs text-zinc-600">Premium structural grade, tactile matte finishing, custom hardware.</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1">
                  <span className="text-xs font-bold text-zinc-900 uppercase">Origin</span>
                  <p className="text-xs text-zinc-600">Ethically crafted with sustainable workshop guidelines.</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1">
                  <span className="text-xs font-bold text-zinc-900 uppercase">Care Instructions</span>
                  <p className="text-xs text-zinc-600">Wipe clean with a damp microfiber cloth. Avoid abrasive detergents.</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1">
                  <span className="text-xs font-bold text-zinc-900 uppercase">Warranty</span>
                  <p className="text-xs text-zinc-600">12-Month Structural Integrity Guarantee with dedicated concierge support.</p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 text-xs leading-relaxed">
                <p>
                  <strong>Colombo District:</strong> Delivered within 24 hours via express dispatch. Orders confirmed before 1:00 PM are frequently delivered on the same business day.
                </p>
                <p>
                  <strong>All Other Provinces (Outstation):</strong> Delivered in 48 to 72 hours via tracked courier partners (PromptX, Domex, Certis Lanka).
                </p>
                <p>
                  <strong>Payment Options:</strong> Cash on Delivery (COD), Online Card Payment (Visa, MasterCard), Direct Bank Transfer, or Koko / Mintpay installments.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-3xl font-extrabold text-zinc-900">{product.rating.toFixed(1)}</div>
                  <div>
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-zinc-500">Based on {product.reviewsCount} verified customer ratings</span>
                  </div>
                </div>

                <div className="divide-y divide-zinc-200 border-t border-zinc-200 pt-2 space-y-4">
                  <div className="pt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-zinc-900">Sahan Mendis · Verified Purchaser</span>
                      <span className="text-zinc-400">2 weeks ago</span>
                    </div>
                    <p className="text-xs text-zinc-600">
                      Exceeded my expectations. The finish is immaculate and packaging felt like opening a luxury timepiece box. Delivery was swift to Kandy.
                    </p>
                  </div>
                  <div className="pt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-zinc-900">Nipuni Wijesekera · Verified Purchaser</span>
                      <span className="text-zinc-400">1 month ago</span>
                    </div>
                    <p className="text-xs text-zinc-600">
                      Super high quality and very comfortable to use every day. Customer service was super responsive on WhatsApp too.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-zinc-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-extrabold text-zinc-900">Related Collections</h3>
                <p className="text-xs text-zinc-500">More timeless pieces from {product.category}</p>
              </div>
              <button onClick={onBack} className="text-xs font-bold text-blue-700 hover:underline">
                View All →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="group cursor-pointer border border-zinc-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all"
                >
                  <div className="aspect-4/3 w-full bg-zinc-100 overflow-hidden">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3.5 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      {rel.category}
                    </span>
                    <h4 className="text-xs font-bold text-zinc-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
                      {rel.title}
                    </h4>
                    <div className="text-xs font-bold text-zinc-950 tabular-nums">
                      {formatPrice(rel.price, currency)}
                    </div>
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
