import React, { useState } from 'react';
import { CategoryShowcaseBlockConfig, CategoryShowcaseItem } from '../../types/store';
import { InlineEditable } from '../common/InlineEditable';
import { PRESET_IMAGE_SUGGESTIONS } from '../../data/defaultStore';
import { 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Watch, 
  Sparkles, 
  ShoppingBag, 
  Shirt, 
  ChevronRight,
  Gem
} from 'lucide-react';

interface CategoryShowcaseBlockProps {
  config?: CategoryShowcaseBlockConfig;
  isAdmin: boolean;
  onUpdate: (updated: CategoryShowcaseBlockConfig) => void;
  onSelectCategory: (category: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleHide?: () => void;
}

const DEFAULT_CATEGORY_ITEMS: CategoryShowcaseItem[] = [
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
];

export const CategoryShowcaseBlock: React.FC<CategoryShowcaseBlockProps> = ({
  config = { visible: true, title: 'Curated Categories', items: DEFAULT_CATEGORY_ITEMS },
  isAdmin,
  onUpdate,
  onSelectCategory,
  onMoveUp,
  onMoveDown,
  onToggleHide,
}) => {
  const [editingImageItemId, setEditingImageItemId] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');

  if (!config.visible && !isAdmin) return null;

  const items = config.items && config.items.length > 0 ? config.items : DEFAULT_CATEGORY_ITEMS;

  const handleUpdateItem = (id: string, updates: Partial<CategoryShowcaseItem>) => {
    const updated = items.map((it) => (it.id === id ? { ...it, ...updates } : it));
    onUpdate({ ...config, items: updated });
  };

  const handleAddItem = () => {
    const newItem: CategoryShowcaseItem = {
      id: `cat-${Date.now()}`,
      title: 'ACCESSORIES',
      subtitle: 'Finishing Touches',
      image: '/src/assets/images/product_diamond_necklace_1792753787713.jpg',
      icon: 'sparkles',
      linkCategory: 'Accessories',
    };
    onUpdate({ ...config, items: [...items, newItem] });
  };

  const handleDeleteItem = (id: string) => {
    if (items.length <= 1) return;
    const updated = items.filter((it) => it.id !== id);
    onUpdate({ ...config, items: updated });
  };

  const renderIcon = (icon?: string) => {
    switch (icon) {
      case 'watch':
        return <Watch className="w-4 h-4 text-[#b58d4a]" />;
      case 'sparkles':
        return <Gem className="w-4 h-4 text-[#b58d4a]" />;
      case 'bag':
        return <ShoppingBag className="w-4 h-4 text-[#b58d4a]" />;
      case 'dress':
      default:
        return <Shirt className="w-4 h-4 text-[#b58d4a]" />;
    }
  };

  return (
    <section
      className={`py-6 sm:py-10 transition-all ${
        isAdmin ? 'border-2 border-dashed border-blue-400 my-4 rounded-xl p-3 bg-blue-50/15' : ''
      } ${!config.visible ? 'opacity-50' : ''}`}
    >
      {/* Admin Block Header Controls */}
      {isAdmin && (
        <div className="flex items-center justify-between bg-blue-900 text-white px-4 py-2 rounded-lg text-xs mb-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>CATEGORY SHOWCASE BLOCK</span>
            {!config.visible && (
              <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px]">
                Hidden from Customers
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddItem}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Category</span>
            </button>
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
              <button
                onClick={onToggleHide}
                className="px-2 py-1 bg-blue-800 hover:bg-blue-700 rounded text-[11px]"
              >
                {config.visible ? 'Hide Block' : 'Show Block'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* DESKTOP VIEW: 4 Horizontal side-by-side Luxury Cards (As seen in Screenshot 1) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white border border-[#e8e2d5] hover:border-[#b58d4a] rounded-lg p-3.5 flex items-center gap-3.5 transition-all duration-300 hover:shadow-md cursor-pointer"
              onClick={() => onSelectCategory(item.linkCategory || item.title)}
            >
              {/* Thumbnail Left */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-md overflow-hidden bg-[#f7f5f0] border border-[#f0ece3]">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingImageItemId(editingImageItemId === item.id ? null : item.id);
                    }}
                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Change category image"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Text Right */}
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-sm tracking-wider font-semibold text-zinc-900 uppercase group-hover:text-[#b58d4a] transition-colors truncate">
                  <InlineEditable
                    value={item.title}
                    onSave={(val) => handleUpdateItem(item.id, { title: val, linkCategory: val })}
                    isAdmin={isAdmin}
                    labelHint="Category Title"
                    className="font-serif text-sm tracking-wider font-semibold uppercase"
                  />
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5 truncate">
                  <InlineEditable
                    value={item.subtitle}
                    onSave={(val) => handleUpdateItem(item.id, { subtitle: val })}
                    isAdmin={isAdmin}
                    labelHint="Category Subtitle"
                    className="text-xs text-zinc-500"
                  />
                </p>
              </div>

              {/* Admin Delete Action */}
              {isAdmin && items.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                  className="text-zinc-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Image Picker Dropdown */}
              {isAdmin && editingImageItemId === item.id && (
                <div
                  className="absolute top-full left-0 mt-2 w-72 p-3 bg-white border border-[#b58d4a] rounded-xl shadow-2xl z-40 text-xs space-y-2 animate-slide-down"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between font-bold text-zinc-900">
                    <span>Select Category Image:</span>
                    <button
                      onClick={() => setEditingImageItemId(null)}
                      className="text-zinc-400 hover:text-zinc-800"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {PRESET_IMAGE_SUGGESTIONS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          handleUpdateItem(item.id, { image: preset.url });
                          setEditingImageItemId(null);
                        }}
                        className="aspect-square rounded border border-zinc-200 overflow-hidden hover:ring-2 hover:ring-[#b58d4a]"
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1 pt-1">
                    <input
                      type="url"
                      placeholder="Paste image URL..."
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="grow px-2 py-1 border border-zinc-300 rounded text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customImageUrl.trim()) {
                          handleUpdateItem(item.id, { image: customImageUrl.trim() });
                          setCustomImageUrl('');
                          setEditingImageItemId(null);
                        }
                      }}
                      className="px-2 py-1 bg-[#b58d4a] text-white rounded font-bold"
                    >
                      Set
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* MOBILE VIEW: Clean Linear Accordion / List with Icons (As seen in Screenshot 2) */}
        <div className="md:hidden divide-y divide-[#ece7dd] border-y border-[#ece7dd] bg-white">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectCategory(item.linkCategory || item.title)}
              className="flex items-center justify-between py-3.5 px-3 group hover:bg-[#faf8f5] active:bg-[#f3ede2] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {renderIcon(item.icon)}
                </div>
                <span className="font-serif text-xs font-semibold tracking-widest text-zinc-800 uppercase">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && items.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    className="text-zinc-400 hover:text-rose-600 p-1"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-[#b58d4a] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
