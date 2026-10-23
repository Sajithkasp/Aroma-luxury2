import React, { useState } from 'react';
import { Product, Currency } from '../../types/store';
import { formatPrice, calculateDiscount } from '../../utils/formatters';
import { X, ShoppingBag, Heart, Star, CheckCircle2, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  currency: Currency;
  isWishlisted: boolean;
  onAddToCart: (product: Product, quantity: number, variant?: { size?: string; color?: string }) => void;
  onToggleWishlist: (id: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  currency,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.variants?.sizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.variants?.colors?.[0]?.name
  );
  const [addedToast, setAddedToast] = useState(false);

  const discount = calculateDiscount(product.originalPrice, product.price);

  const handleAdd = () => {
    onAddToCart(product, quantity, { size: selectedSize, color: selectedColor });
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-zinc-900 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image Column */}
          <div className="relative aspect-square md:aspect-auto bg-zinc-100 flex items-center justify-center overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-zinc-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-sm shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Information Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                <span className="uppercase tracking-wider font-semibold">{product.category}</span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-zinc-900">{product.rating.toFixed(1)}</span>
                  <span className="text-zinc-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-snug mb-3">
                {product.title}
              </h2>

              {/* Price & Discounts */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl font-bold text-zinc-900 tabular-nums">
                  {formatPrice(product.price, currency)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-zinc-400 line-through tabular-nums">
                    {formatPrice(product.originalPrice, currency)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    Save {discount}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Variants if any */}
              {product.variants?.sizes && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Select Size:</label>
                  <div className="flex gap-2">
                    {product.variants.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          selectedSize === sz
                            ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                            : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.variants?.colors && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Select Color:</label>
                  <div className="flex gap-2">
                    {product.variants.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
                          selectedColor === c.name
                            ? 'border-zinc-900 ring-2 ring-zinc-900/20'
                            : 'border-zinc-200 text-zinc-700 hover:border-zinc-400'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-zinc-200 space-y-4">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-zinc-950 font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold tabular-nums text-zinc-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-zinc-950 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAdd}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
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
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{product.inStock ? `Add to Bag • ${formatPrice(product.price * quantity, currency)}` : 'Currently Sold Out'}</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isWishlisted
                      ? 'border-rose-200 bg-rose-50 text-rose-600'
                      : 'border-zinc-200 text-zinc-600 hover:text-rose-600 hover:border-rose-200'
                  }`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Mini Trust guarantees */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-500 pt-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Tracked Express Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>30-Day Money-Back Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
