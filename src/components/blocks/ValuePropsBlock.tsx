import React from 'react';
import { ValuePropsBlockConfig } from '../../types/store';
import { InlineEditable } from '../common/InlineEditable';
import { Truck, ShieldCheck, RefreshCw, Clock, Sparkles, Leaf, ChevronUp, ChevronDown } from 'lucide-react';

interface ValuePropsBlockProps {
  config: ValuePropsBlockConfig;
  isAdmin: boolean;
  onUpdate: (updated: ValuePropsBlockConfig) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleHide?: () => void;
}

export const ValuePropsBlock: React.FC<ValuePropsBlockProps> = ({
  config,
  isAdmin,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onToggleHide,
}) => {
  if (!config.visible && !isAdmin) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'truck': return <Truck className="w-6 h-6 text-zinc-800" />;
      case 'shield': return <ShieldCheck className="w-6 h-6 text-zinc-800" />;
      case 'leaf': return <Leaf className="w-6 h-6 text-zinc-800" />;
      case 'refresh': return <RefreshCw className="w-6 h-6 text-zinc-800" />;
      default: return <Sparkles className="w-6 h-6 text-zinc-800" />;
    }
  };

  const handleItemUpdate = (index: number, field: 'title' | 'description', value: string) => {
    const newItems = [...config.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate({ ...config, items: newItems });
  };

  return (
    <section className={`py-12 border-y border-zinc-200/80 bg-zinc-50/60 transition-all ${
      isAdmin ? 'border-2 border-dashed border-blue-400 my-4 rounded-xl p-3 bg-blue-50/15' : ''
    } ${!config.visible ? 'opacity-50' : ''}`}>
      {/* Admin Block Controls */}
      {isAdmin && (
        <div className="flex items-center justify-between bg-blue-900 text-white px-4 py-2 rounded-lg text-xs mb-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>VALUE PROPOSITIONS & GUARANTEE BLOCK</span>
            {!config.visible && <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px]">Hidden</span>}
          </div>
          <div className="flex items-center gap-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {config.items.map((item, idx) => (
            <div key={item.id} className="flex items-start gap-4 p-2">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-zinc-200/60 shrink-0">
                {renderIcon(item.icon)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-zinc-900 text-sm mb-1">
                  <InlineEditable
                    value={item.title}
                    onSave={(val) => handleItemUpdate(idx, 'title', val)}
                    isAdmin={isAdmin}
                    labelHint="Value prop title"
                    className="text-zinc-900 font-semibold"
                  />
                </h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  <InlineEditable
                    type="textarea"
                    value={item.description}
                    onSave={(val) => handleItemUpdate(idx, 'description', val)}
                    isAdmin={isAdmin}
                    labelHint="Value prop description"
                    className="text-zinc-500"
                  />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
