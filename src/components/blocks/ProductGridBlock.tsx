import React, { useState } from 'react';
import { ProductGridBlockConfig, Product, Currency } from '../../types/store';
import { LiveEditableProductCard } from '../products/LiveEditableProductCard';
import { InlineEditable } from '../common/InlineEditable';
import { 
  Plus, 
  Grid3X3, 
  Grid2X2, 
  SlidersHorizontal, 
  ChevronUp, 
  ChevronDown, 
  Sparkles,
  Search,
  X
} from 'lucide-react';

interface ProductGridBlockProps {
  config: ProductGridBlockConfig;
  products: Product[];
  categories: string[];
  currency: Currency;
  isAdmin: boolean;
  wishlistIds: string[];
  searchQuery: string;
  onClearSearch: () => void;
  onUpdateConfig: (updated: ProductGridBlockConfig) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onDuplicateProduct: (product: Product) => void;
  onAddNewProduct: () => void;
  onOpenProductPage: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onAddCategory?: (category: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleHide?: () => void;
}

export const ProductGridBlock: React.FC<ProductGridBlockProps> = ({
  config,
  products,
  categories,
  currency,
  isAdmin,
  wishlistIds,
  searchQuery,
  onClearSearch,
  onUpdateConfig,
  onUpdateProduct,
  onDeleteProduct,
  onDuplicateProduct,
  onAddNewProduct,
  onOpenProductPage,
  onAddToCart,
  onToggleWishlist,
  onAddCategory,
  onMoveUp,
  onMoveDown,
  onToggleHide,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  if (config?.visible === false && !isAdmin) return null;

  // Filter products by category and search query with complete null safety
  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = safeProducts.filter((p) => {
    if (!p) return false;
    const pCategory = (p.category || 'All').toLowerCase();
    const pTitle = (p.title || '').toLowerCase();
    const pDesc = (p.description || '').toLowerCase();
    const q = (searchQuery || '').trim().toLowerCase();

    const matchesCategory = selectedCategory === 'All' || pCategory === selectedCategory.toLowerCase();
    const matchesSearch = !q || pTitle.includes(q) || pDesc.includes(q) || pCategory.includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() && onAddCategory) {
      onAddCategory(newCategoryName.trim());
      setSelectedCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const gridColsClass = 
    config.columns === 2 
      ? 'grid-cols-1 sm:grid-cols-2' 
      : config.columns === 4 
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section 
      id="catalog" 
      className={`relative py-12 transition-all ${
        isAdmin ? 'border-2 border-dashed border-blue-400 my-4 rounded-xl p-3 bg-blue-50/15' : ''
      } ${!config.visible ? 'opacity-50' : ''}`}
    >
      {/* Admin Block Control Header */}
      {isAdmin && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-900 text-white px-4 py-2.5 rounded-lg text-xs mb-6">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>PRODUCTS CATALOG BLOCK ({products.length} Items)</span>
            {!config.visible && <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px]">Hidden</span>}
          </div>

          <div className="flex items-center gap-3">
            {/* Grid Column Selector */}
            <div className="flex items-center gap-1 bg-blue-800 px-2 py-1 rounded">
              <span className="text-[10px] text-blue-200">Columns:</span>
              <button
                onClick={() => onUpdateConfig({ ...config, columns: 2 })}
                className={`px-1.5 py-0.5 rounded ${config.columns === 2 ? 'bg-blue-600 font-bold' : 'hover:bg-blue-700'}`}
              >
                2
              </button>
              <button
                onClick={() => onUpdateConfig({ ...config, columns: 3 })}
                className={`px-1.5 py-0.5 rounded ${config.columns === 3 ? 'bg-blue-600 font-bold' : 'hover:bg-blue-700'}`}
              >
                3
              </button>
              <button
                onClick={() => onUpdateConfig({ ...config, columns: 4 })}
                className={`px-1.5 py-0.5 rounded ${config.columns === 4 ? 'bg-blue-600 font-bold' : 'hover:bg-blue-700'}`}
              >
                4
              </button>
            </div>

            {onMoveUp && (
              <button onClick={onMoveUp} className="p-1 hover:bg-blue-800 rounded" title="Move Up">
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
            {onMoveDown && (
              <button onClick={onMoveDown} className="p-1 hover:bg-blue-800 rounded" title="Move Down">
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            {onToggleHide && (
              <button onClick={onToggleHide} className="px-2 py-1 bg-blue-800 hover:bg-blue-700 rounded text-[11px]">
                {config.visible ? 'Hide' : 'Show'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Subtitle */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-base sm:text-xl tracking-widest font-medium text-zinc-900 uppercase">
              <InlineEditable
                value={config.title}
                onSave={(val) => onUpdateConfig({ ...config, title: val })}
                isAdmin={isAdmin}
                labelHint="Catalog Section Title"
                className="font-serif tracking-widest uppercase text-zinc-900"
              />
            </h2>
            <p className="text-xs text-zinc-500 mt-1 max-w-xl hidden sm:block">
              <InlineEditable
                value={config.subtitle}
                onSave={(val) => onUpdateConfig({ ...config, subtitle: val })}
                isAdmin={isAdmin}
                labelHint="Catalog Subtitle"
                className="text-zinc-500 text-xs"
              />
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedCategory('All')}
              className="font-serif text-xs tracking-widest text-zinc-600 hover:text-[#b58d4a] uppercase flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <span>VIEW ALL</span>
              <span className="text-sm">→</span>
            </button>

            {/* Quick Add Product Button in Section Header */}
            {isAdmin && (
              <button
                onClick={onAddNewProduct}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-xs transition-all active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Product</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Search Indicator */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between p-3 bg-zinc-100 rounded-lg text-xs text-zinc-700">
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span>Showing search results for: <strong>"{searchQuery}"</strong> ({filteredProducts.length} items found)</span>
            </div>
            <button
              onClick={onClearSearch}
              className="text-zinc-500 hover:text-zinc-900 flex items-center gap-1 font-medium underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Category Filters (Segmented Filter Bar) */}
        {config.showCategories && (
          <div className="flex flex-wrap items-center gap-1.5 pb-6 border-b border-zinc-200/80 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'category-pill-active theme-cta-btn bg-zinc-900 text-white shadow-xs font-semibold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Admin Add Category Inline */}
            {isAdmin && (
              isAddingCategory ? (
                <form onSubmit={handleCreateCategory} className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="New category..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    autoFocus
                    className="px-2 py-1 text-xs border border-blue-400 rounded bg-white shadow-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="p-1 text-zinc-400 hover:text-zinc-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingCategory(true)}
                  className="px-2.5 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                  title="Add a new category"
                >
                  <Plus className="w-3 h-3" />
                  <span>Category</span>
                </button>
              )
            )}
          </div>
        )}

        {/* Product Grid */}
        <div className={`grid ${gridColsClass} gap-6 lg:gap-8`}>
          {/* Admin "+ Add New Product Card" Box right in the grid */}
          {isAdmin && (
            <button
              onClick={onAddNewProduct}
              className="group flex flex-col items-center justify-center min-h-[380px] p-6 border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-emerald-50/30 hover:bg-emerald-50/70 rounded-xl transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-100 group-hover:bg-emerald-200 text-emerald-700 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm">
                <Plus className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-zinc-900 mb-1">
                + Add New Product
              </h4>
              <p className="text-xs text-zinc-600 max-w-xs mb-3">
                Click to place a live product box right here. You can click any text line to fill it just like PowerPoint!
              </p>
              <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2.5 py-1 rounded shadow-xs border border-emerald-200">
                Live Front-End Card
              </span>
            </button>
          )}

          {/* Render All Filtered Products */}
          {filteredProducts.map((product) => (
            <LiveEditableProductCard
              key={product.id}
              product={product}
              isAdmin={isAdmin}
              currency={currency}
              isWishlisted={wishlistIds.includes(product.id)}
              onUpdate={onUpdateProduct}
              onDelete={onDeleteProduct}
              onDuplicate={onDuplicateProduct}
              onOpenProductPage={onOpenProductPage}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>

        {/* Empty state when filter yields zero results */}
        {filteredProducts.length === 0 && !isAdmin && (
          <div className="py-16 text-center bg-zinc-50 rounded-2xl border border-zinc-200/80 my-4">
            <p className="text-base font-semibold text-zinc-800 mb-1">No products found</p>
            <p className="text-xs text-zinc-500 mb-4">Try selecting another category or resetting your search filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                onClearSearch();
              }}
              className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-medium hover:bg-zinc-800"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
