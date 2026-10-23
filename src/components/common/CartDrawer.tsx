import React, { useState } from 'react';
import { CartItem, Currency, CustomCartButtonConfig } from '../../types/store';
import { formatPrice } from '../../utils/formatters';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  Check, 
  Truck, 
  ExternalLink,
  MessageCircle,
  Settings
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  promoCode: string;
  appliedDiscountPercent: number;
  onApplyPromoCode: (code: string) => boolean;
  customButton?: CustomCartButtonConfig;
  onUpdateCustomButton?: (config: CustomCartButtonConfig) => void;
  isAdmin?: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  promoCode,
  appliedDiscountPercent,
  onApplyPromoCode,
  customButton,
  onUpdateCustomButton,
  isAdmin = false,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isEditingButton, setIsEditingButton] = useState(false);
  const [btnText, setBtnText] = useState(customButton?.text || 'Order via WhatsApp');
  const [btnUrl, setBtnUrl] = useState(customButton?.url || 'https://wa.me/94771234567');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedDiscountPercent > 0 ? (subtotal * appliedDiscountPercent) / 100 : 0;
  
  // Free shipping threshold: Rs. 15,000 or $150
  const freeShippingThreshold = currency === 'Rs.' || currency === 'LKR' ? 15000 : 150;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shipping = items.length === 0 ? 0 : isFreeShipping ? 0 : (currency === 'Rs.' || currency === 'LKR' ? 650 : 15);
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = onApplyPromoCode(couponInput.trim());
    if (success) {
      setCouponMsg({ text: `Code ${couponInput.toUpperCase()} applied!`, isError: false });
    } else {
      setCouponMsg({ text: 'Invalid promo code. Try AURA20', isError: true });
    }
  };

  const handleSaveCustomButton = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateCustomButton && customButton) {
      onUpdateCustomButton({
        ...customButton,
        text: btnText.trim() || 'Custom Order Button',
        url: btnUrl.trim() || 'https://wa.me/94771234567',
        visible: true,
      });
      setIsEditingButton(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-900" />
              <h2 className="text-base font-bold text-zinc-900">
                Your Shopping Bag ({items.reduce((acc, it) => acc + it.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          {items.length > 0 && (
            <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-3 text-xs">
              <div className="flex items-center justify-between text-zinc-700 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  {isFreeShipping ? (
                    <span className="text-emerald-700 font-semibold">Unlocked Free Express Delivery!</span>
                  ) : (
                    <span>Add {formatPrice(freeShippingThreshold - subtotal, currency)} more for Free Delivery</span>
                  )}
                </span>
                <span className="tabular-nums font-bold">
                  {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
                </span>
              </div>
              <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-zinc-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-1">Your bag is empty</h3>
                <p className="text-xs text-zinc-500 max-w-xs mb-6">
                  Explore our curated collection of timeless essentials and add products to your bag.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-lg bg-zinc-100 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-zinc-900 leading-snug">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-zinc-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        {item.product.category} {item.selectedSize ? `· Size: ${item.selectedSize}` : ''} {item.selectedColor ? `· Color: ${item.selectedColor}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-zinc-200 rounded-md bg-zinc-50">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-zinc-600 hover:text-zinc-950 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-zinc-600 hover:text-zinc-950 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-zinc-900 tabular-nums">
                          {formatPrice(item.product.price * item.quantity, currency)}
                        </span>
                        {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                          <span className="text-[10px] text-zinc-400 line-through tabular-nums">
                            {formatPrice(item.product.originalPrice * item.quantity, currency)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-200 bg-zinc-50/70 space-y-3.5">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Promo code (e.g. AURA20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-zinc-300 rounded-lg uppercase tracking-wider font-mono focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition-colors shrink-0"
                >
                  Apply
                </button>
              </form>

              {couponMsg && (
                <p className={`text-[11px] font-medium ${couponMsg.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {couponMsg.text}
                </p>
              )}

              {/* Order Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-600 pt-2 border-t border-zinc-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900 tabular-nums">{formatPrice(subtotal, currency)}</span>
                </div>
                {appliedDiscountPercent > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedDiscountPercent}%)</span>
                    <span className="tabular-nums">-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Dispatch</span>
                  <span className="tabular-nums">
                    {shipping === 0 ? <strong className="text-emerald-700">Free</strong> : formatPrice(shipping, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>Estimated Total</span>
                  <span className="tabular-nums">{formatPrice(total, currency)}</span>
                </div>
              </div>

              {/* Primary Buy CTA */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-zinc-950 text-white font-semibold text-xs tracking-wider rounded-xl hover:bg-zinc-850 shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* USER REQUIREMENT: Custom Button with custom link! */}
              {/* "Cart ekata thawa button ekak add karanna puluwan wenna one saha button ekata link ekak danna puluwan wenna one." */}
              {customButton && customButton.visible && (
                <div className="relative">
                  <a
                    href={customButton.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>{customButton.text}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setIsEditingButton(!isEditingButton)}
                      className="absolute -top-2 -right-2 p-1 bg-white text-blue-600 rounded-full border border-blue-400 shadow-md hover:bg-blue-50"
                      title="Edit Custom Cart Button"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Admin Button Link Editor */}
              {isAdmin && isEditingButton && (
                <form onSubmit={handleSaveCustomButton} className="p-3 bg-white border-2 border-blue-400 rounded-xl space-y-2 text-xs shadow-lg animate-slide-down">
                  <div className="flex items-center justify-between font-bold text-zinc-900 text-[11px]">
                    <span>Configure Cart Button & Link:</span>
                    <button type="button" onClick={() => setIsEditingButton(false)} className="text-zinc-400 hover:text-zinc-800">✕</button>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-600 font-semibold block mb-0.5">Button Text:</label>
                    <input
                      type="text"
                      required
                      value={btnText}
                      onChange={(e) => setBtnText(e.target.value)}
                      className="w-full px-2 py-1 border border-zinc-300 rounded text-xs"
                      placeholder="e.g. Order via WhatsApp"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-600 font-semibold block mb-0.5">Target Link URL:</label>
                    <input
                      type="url"
                      required
                      value={btnUrl}
                      onChange={(e) => setBtnUrl(e.target.value)}
                      className="w-full px-2 py-1 border border-zinc-300 rounded text-xs font-mono"
                      placeholder="https://wa.me/9477... or https://..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs"
                    >
                      Save Button
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onUpdateCustomButton && customButton) {
                          onUpdateCustomButton({ ...customButton, visible: false });
                          setIsEditingButton(false);
                        }
                      }}
                      className="px-2 py-1 border border-rose-300 text-rose-600 rounded text-xs"
                    >
                      Hide Button
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
