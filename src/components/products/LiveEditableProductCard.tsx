import React, { useState } from 'react';
import { Product, Currency } from '../../types/store';
import { InlineEditable } from '../common/InlineEditable';
import { formatPrice, calculateDiscount } from '../../utils/formatters';
import { PRESET_IMAGE_SUGGESTIONS } from '../../data/defaultStore';
import { 
  ShoppingBag, 
  Eye, 
  Heart, 
  Trash2, 
  Copy, 
  Image as ImageIcon, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  Tag,
  Plus,
  ExternalLink
} from 'lucide-react';

interface LiveEditableProductCardProps {
  product: Product;
  isAdmin: boolean;
  currency: Currency;
  isWishlisted?: boolean;
  onUpdate: (updatedProduct: Product) => void;
  onDelete: (id: string) => void;
  onDuplicate: (product: Product) => void;
  onOpenProductPage: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist?: (productId: string) => void;
}

export const LiveEditableProductCard: React.FC<LiveEditableProductCardProps> = ({
  product,
  isAdmin,
  currency,
  isWishlisted = false,
  onUpdate,
  onDelete,
  onDuplicate,
  onOpenProductPage,
  onAddToCart,
  onToggleWishlist,
}) => {
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);

  const discount = calculateDiscount(product.originalPrice, product.price);
  const imagesList = (product.images && product.images.length > 0) ? product.images : [product.image];
  const galleryCount = imagesList.length;

  const handleAddImage = (url: string) => {
    if (!url.trim()) return;
    const current = (product.images && product.images.length > 0) ? product.images : [product.image];
    if (current.includes(url.trim())) return;
    const updated = [...current, url.trim()];
    onUpdate({ ...product, images: updated });
    setImageError(false);
  };

  const handleSetMainImage = (url: string) => {
    const current = (product.images && product.images.length > 0) ? product.images : [product.image];
    const reordered = [url, ...current.filter((img) => img !== url)];
    onUpdate({ ...product, image: url, images: reordered });
    setImageError(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (imagesList.length <= 1) {
      return;
    }
    const updated = imagesList.filter((_, idx) => idx !== indexToRemove);
    onUpdate({ ...product, image: updated[0], images: updated });
  };

  const handleCustomImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customImageUrl.trim()) {
      handleAddImage(customImageUrl.trim());
      setCustomImageUrl('');
    }
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

  return (
    <div
      className={`group relative flex flex-col h-full themed-card bg-white transition-all duration-300 rounded-xl overflow-hidden ${
        isAdmin
          ? 'border-2 border-dashed border-blue-400 hover:border-blue-600 shadow-sm p-2.5'
          : 'border border-zinc-200/90 hover:border-zinc-400 hover:shadow-lg'
      }`}
    >
      {/* Admin Clean Header Ribbon Inside Card Boundaries (No overflow) */}
      {isAdmin && (
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-blue-100 text-[10px] text-blue-800 bg-blue-50/80 rounded-lg p-1.5">
          <span className="font-bold flex items-center gap-1 truncate max-w-[110px]">
            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
            <span className="truncate">Live Edit</span>
          </span>

          <div className="flex items-center gap-1 shrink-0">
            {/* Stock status toggle */}
            <button
              onClick={() => onUpdate({ ...product, inStock: !product.inStock })}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                product.inStock
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
              }`}
              title="Toggle stock status"
            >
              {product.inStock ? 'In Stock' : 'Out'}
            </button>

            {/* Duplicate */}
            <button
              onClick={() => onDuplicate(product)}
              className="p-1 text-zinc-600 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
              title="Duplicate Card"
            >
              <Copy className="w-3 h-3" />
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(product.id)}
              className="p-1 text-zinc-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Delete Card"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Product Image Stage */}
      <div 
        onClick={() => !isAdmin && onOpenProductPage(product)}
        className="relative aspect-4/3 w-full bg-zinc-100 overflow-hidden rounded-lg cursor-pointer"
      >
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 p-4 text-center">
            <ImageIcon className="w-8 h-8 text-zinc-400 mb-1" />
            <p className="text-xs text-zinc-600 font-medium line-clamp-1">{product.title}</p>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        )}

        {/* Badge & Discounts */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 max-w-[80%]">
          {isAdmin ? (
            <div className="bg-white/95 backdrop-blur-xs text-zinc-900 border border-zinc-200 px-1.5 py-0.5 rounded text-[11px] shadow-xs">
              <InlineEditable
                value={product.badge || 'Set Badge'}
                onSave={(val) => onUpdate({ ...product, badge: val.trim() || undefined })}
                isAdmin={isAdmin}
                labelHint="Badge tag"
                className="font-medium text-[11px] text-blue-700 truncate"
              />
            </div>
          ) : (
            product.badge && (
              <span className="bg-zinc-950 text-white text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-sm shadow-xs truncate">
                {product.badge}
              </span>
            )
          )}

          {discount > 0 && !isAdmin && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-xs">
              Save {discount}%
            </span>
          )}
        </div>

        {/* Gallery Multi-Photo Counter Pill */}
        {galleryCount > 1 && (
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 z-10 pointer-events-none">
            <ImageIcon className="w-3 h-3" />
            <span>{galleryCount} photos</span>
          </div>
        )}

        {/* Admin Change / Add Photos Button */}
        {isAdmin && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowImagePicker(!showImagePicker);
            }}
            className="absolute bottom-2 right-2 bg-zinc-950/90 hover:bg-black text-white text-[11px] px-2 py-1 rounded-md shadow-md flex items-center gap-1 backdrop-blur-xs transition-colors z-20"
          >
            <ImageIcon className="w-3 h-3" />
            <span>Images ({galleryCount})</span>
          </button>
        )}

        {/* Customer View Wishlist Icon */}
        {!isAdmin && onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-xs shadow-sm transition-colors z-10 ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/90 text-zinc-700 hover:text-rose-600 hover:bg-white'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Out of Stock Ribbon */}
        {!isAdmin && !product.inStock && (
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-white text-zinc-950 text-[11px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Image Picker Dropdown (contained within card, neat layout) */}
      {isAdmin && showImagePicker && (
        <div className="my-2 p-2.5 bg-zinc-50 border border-blue-200 rounded-lg text-xs space-y-2.5 z-30 animate-slide-down">
          <div className="flex items-center justify-between font-bold text-zinc-800 text-[11px]">
            <span>Manage Product Photos ({galleryCount}):</span>
            <button
              onClick={() => setShowImagePicker(false)}
              className="text-zinc-400 hover:text-zinc-700"
            >
              ✕
            </button>
          </div>

          {/* Existing photos preview list */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {imagesList.map((imgUrl, idx) => (
              <div key={idx} className="relative aspect-square w-12 shrink-0 rounded border border-zinc-300 overflow-hidden group/thumb">
                <img src={imgUrl} alt="Thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                {product.image === imgUrl && (
                  <span className="absolute top-0 left-0 bg-blue-600 text-white text-[8px] px-1 font-bold">
                    Cover
                  </span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                  {product.image !== imgUrl && (
                    <button
                      type="button"
                      onClick={() => handleSetMainImage(imgUrl)}
                      className="text-[8px] bg-white text-zinc-900 px-1 rounded font-bold"
                      title="Make Cover"
                    >
                      ★
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="text-[8px] bg-rose-600 text-white px-1 rounded font-bold"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[10px] text-zinc-500 block mb-1">Pick preset photo to add:</span>
            <div className="grid grid-cols-4 gap-1">
              {PRESET_IMAGE_SUGGESTIONS.slice(0, 4).map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddImage(preset.url)}
                  className="aspect-square rounded border border-zinc-200 overflow-hidden hover:ring-2 hover:ring-blue-500"
                  title={preset.name}
                >
                  <img src={preset.url} alt={preset.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Add URL */}
          <form onSubmit={handleCustomImageSubmit} className="flex gap-1 pt-1">
            <input
              type="url"
              placeholder="Paste photo URL to add..."
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              className="grow px-2 py-1 text-[11px] border border-zinc-300 rounded bg-white min-w-0"
            />
            <button type="submit" className="px-2.5 py-1 bg-blue-600 text-white rounded text-[11px] font-bold shrink-0">
              Add
            </button>
          </form>

          {/* Upload File */}
          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
            <span>Upload from device:</span>
            <label className="text-blue-600 font-bold hover:underline cursor-pointer">
              Upload Photo
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* Product Content */}
      <div className="flex flex-col grow pt-2.5 pb-1 px-1 min-w-0">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1 gap-2">
          <div className="flex items-center gap-1 font-semibold tracking-wide uppercase text-[10px] text-zinc-600 truncate max-w-[65%]">
            <Tag className="w-3 h-3 text-zinc-400 shrink-0" />
            <InlineEditable
              value={product.category}
              onSave={(val) => onUpdate({ ...product, category: val.trim() || 'General' })}
              isAdmin={isAdmin}
              labelHint="Category"
              className="truncate"
            />
          </div>

          <div className="text-[10px] text-zinc-400 shrink-0">
            ★ {product.rating.toFixed(1)} ({product.reviewsCount})
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-zinc-900 uppercase truncate mb-1">
          <InlineEditable
            value={product.title}
            onSave={(val) => onUpdate({ ...product, title: val.trim() || 'Untitled Product' })}
            isAdmin={isAdmin}
            labelHint="Product Title"
            className="font-serif uppercase tracking-wider text-zinc-900"
          />
        </h3>

        {/* Price Row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="text-xs sm:text-sm font-medium text-zinc-900 tabular-nums">
            {isAdmin ? (
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] text-zinc-400 font-normal shrink-0">{currency}</span>
                <InlineEditable
                  type="number"
                  value={product.price}
                  onSave={(val) => onUpdate({ ...product, price: Math.max(0, parseFloat(val) || 0) })}
                  isAdmin={isAdmin}
                  labelHint="Sell Price"
                  className="font-medium text-xs sm:text-sm text-zinc-900"
                />
              </div>
            ) : (
              formatPrice(product.price, currency)
            )}
          </div>

          {/* Slashed Original Price */}
          {isAdmin ? (
            <div className="flex items-center gap-1">
              {product.originalPrice && product.originalPrice > 0 ? (
                <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded text-[10px]">
                  <span className="text-[9px] text-zinc-400 font-normal shrink-0">{currency}</span>
                  <InlineEditable
                    type="number"
                    value={product.originalPrice}
                    onSave={(val) => {
                      const num = parseFloat(val);
                      onUpdate({ 
                        ...product, 
                        originalPrice: (!isNaN(num) && num > 0) ? num : undefined 
                      });
                    }}
                    isAdmin={isAdmin}
                    labelHint="Slashed Price"
                    className="text-[10px] text-zinc-500 line-through font-medium"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate({ ...product, originalPrice: undefined });
                    }}
                    className="text-zinc-400 hover:text-rose-600 font-bold ml-1 text-[10px]"
                    title="Remove slashed price"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const suggested = Math.round((product.price * 1.2) / 10) * 10 || (product.price + 100);
                    onUpdate({ ...product, originalPrice: suggested });
                  }}
                  className="text-[9px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded transition-colors whitespace-nowrap"
                  title="Add a slashed price to show discount"
                >
                  + Slashed
                </button>
              )}
            </div>
          ) : (
            product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-zinc-400 line-through tabular-nums">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )
          )}
        </div>

        {/* Action Button: Gold ADD TO CART (Matches Screenshot 1 & 2) */}
        <div className="mt-auto pt-1 flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={!product.inStock}
            className={`w-full py-2.5 px-3 rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.99] ${
              product.inStock
                ? 'bg-[#b58d4a] hover:bg-[#9e7939] text-white'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
            title="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>{product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => onOpenProductPage(product)}
              className="p-2 rounded-sm text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
              title="Open full page editor"
            >
              <Eye className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
