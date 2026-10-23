import React from 'react';
import { TrustBadgesConfig, TrustBadgeItem } from '../../types/store';
import { InlineEditable } from '../common/InlineEditable';
import { Truck, ShieldCheck, RefreshCw, Sparkles, Headphones, Award, ChevronUp, ChevronDown, Plus, Trash2 } from 'lucide-react';

interface TrustBadgesBlockProps {
  config: TrustBadgesConfig;
  isAdmin: boolean;
  onUpdate: (updated: TrustBadgesConfig) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleHide?: () => void;
  onOpenLegalModal?: (docId?: string) => void;
}

export const TrustBadgesBlock: React.FC<TrustBadgesBlockProps> = ({
  config,
  isAdmin,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onToggleHide,
  onOpenLegalModal,
}) => {
  if (!config.visible && !isAdmin) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'truck':
        return <Truck className="w-5 h-5 text-emerald-600" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'refresh':
        return <RefreshCw className="w-5 h-5 text-amber-600" />;
      case 'award':
        return <Award className="w-5 h-5 text-purple-600" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-rose-600" />;
      default:
        return <Headphones className="w-5 h-5 text-zinc-600" />;
    }
  };

  const handleUpdateItem = (id: string, updated: Partial<TrustBadgeItem>) => {
    onUpdate({
      ...config,
      items: config.items.map((it) => (it.id === id ? { ...it, ...updated } : it)),
    });
  };

  const handleAddItem = () => {
    const newItem: TrustBadgeItem = {
      id: `tb-${Date.now()}`,
      icon: 'sparkles',
      title: 'Certified Authentic',
      subtitle: 'Original verified merchandise with official serials.',
      enabled: true,
    };
    onUpdate({
      ...config,
      items: [...config.items, newItem],
    });
  };

  const handleDeleteItem = (id: string) => {
    onUpdate({
      ...config,
      items: config.items.filter((it) => it.id !== id),
    });
  };

  return (
    <section
      className={`border-y border-zinc-200/80 bg-zinc-50/70 transition-all ${
        isAdmin ? 'border-2 border-dashed border-blue-400 my-4 rounded-xl p-2 bg-blue-50/20' : ''
      } ${!config.visible ? 'opacity-50' : ''}`}
    >
      {/* Admin Controls */}
      {isAdmin && (
        <div className="flex flex-wrap items-center justify-between bg-blue-900 text-white px-3 py-2 rounded-lg text-xs mb-3 gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>TRUST BADGES STRIP</span>
            {!config.visible && <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px]">Hidden</span>}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddItem}
              className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-[11px] flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>+ Badge</span>
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
              <button onClick={onToggleHide} className="px-2 py-1 bg-blue-800 hover:bg-blue-700 rounded text-[11px]">
                {config.visible ? 'Hide Block' : 'Show Block'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.items.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenLegalModal && onOpenLegalModal()}
              className="relative group/tb flex items-start gap-3.5 p-3 rounded-xl transition-all hover:bg-white hover:shadow-sm cursor-pointer border border-transparent hover:border-zinc-200/60"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/80 shadow-2xs flex items-center justify-center shrink-0 group-hover/tb:scale-105 transition-transform">
                {renderIcon(item.icon)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                  <InlineEditable
                    value={item.title}
                    onSave={(val) => handleUpdateItem(item.id, { title: val })}
                    isAdmin={isAdmin}
                    labelHint="Badge Title"
                    className="font-bold text-zinc-900"
                  />
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  <InlineEditable
                    value={item.subtitle}
                    onSave={(val) => handleUpdateItem(item.id, { subtitle: val })}
                    isAdmin={isAdmin}
                    labelHint="Badge Subtitle"
                    className="text-zinc-500"
                  />
                </p>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover/tb:opacity-100 p-1 text-rose-500 hover:bg-rose-50 rounded transition-opacity"
                  title="Delete badge"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
