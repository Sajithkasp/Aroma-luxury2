import React, { useState } from 'react';
import { Product, Currency } from '../../types/store';
import { formatPrice } from '../../utils/formatters';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onApplySearchQuery: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
  onApplySearchQuery,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matches = query.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onApplySearchQuery(query.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200">
        <form onSubmit={handleSearchSubmit} className="p-4 border-b border-zinc-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search products by title, category, or material..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        <div className="p-4 max-h-96 overflow-y-auto">
          {query.trim() === '' ? (
            <div className="text-center py-6 text-xs text-zinc-400">
              Type keywords above to discover matching collection pieces.
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-6 text-xs text-zinc-500">
              No matching products found for "{query}".
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 space-y-2">
              {matches.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    onSelectProduct(prod);
                    onClose();
                  }}
                  className="pt-2 flex items-center justify-between gap-3 cursor-pointer hover:bg-zinc-50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded object-cover bg-zinc-100"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-900">{prod.title}</h4>
                      <p className="text-[11px] text-zinc-500">{prod.category}</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-zinc-900 tabular-nums">
                    {formatPrice(prod.price, currency)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
