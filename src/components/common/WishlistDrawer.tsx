import React from 'react';
import { Product, Currency } from '../../types/store';
import { formatPrice } from '../../utils/formatters';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  currency: Currency;
  onAddToCart: (product: Product) => void;
  onRemoveWishlist: (productId: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  currency,
  onAddToCart,
  onRemoveWishlist,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-current" />
              <h2 className="text-base font-bold text-zinc-900">
                Saved Wishlist ({wishlistProducts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-zinc-100">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <Heart className="w-12 h-12 text-zinc-300 mb-3" />
                <h3 className="text-sm font-bold text-zinc-900 mb-1">Your wishlist is empty</h3>
                <p className="text-xs text-zinc-500 max-w-xs mb-4">
                  Tap the heart icon on any product to save pieces you love.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-semibold"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              wishlistProducts.map((prod) => (
                <div key={prod.id} className="py-4 flex gap-4 items-center">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(prod);
                        onClose();
                      }
                    }}
                    className="w-16 h-16 object-cover rounded-lg bg-zinc-100 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 
                      onClick={() => {
                        if (onSelectProduct) {
                          onSelectProduct(prod);
                          onClose();
                        }
                      }}
                      className="text-xs font-semibold text-zinc-900 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      {prod.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 mb-2">{prod.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 tabular-nums">
                        {formatPrice(prod.price, currency)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onAddToCart(prod);
                            onRemoveWishlist(prod.id);
                          }}
                          className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Move to Bag</span>
                        </button>
                        <button
                          onClick={() => onRemoveWishlist(prod.id)}
                          className="p-1 text-zinc-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
