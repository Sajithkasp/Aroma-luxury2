import React, { useState } from 'react';
import { PromoBannerBlockConfig } from '../../types/store';
import { InlineEditable } from '../common/InlineEditable';
import { Tag, Sparkles, Copy, Check, ChevronUp, ChevronDown } from 'lucide-react';

interface PromoBannerBlockProps {
  config: PromoBannerBlockConfig;
  isAdmin: boolean;
  onUpdate: (updated: PromoBannerBlockConfig) => void;
  onApplyPromoCode: (code: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleHide?: () => void;
}

export const PromoBannerBlock: React.FC<PromoBannerBlockProps> = ({
  config,
  isAdmin,
  onUpdate,
  onApplyPromoCode,
  onMoveUp,
  onMoveDown,
  onToggleHide,
}) => {
  const [copied, setCopied] = useState(false);

  if (!config.visible && !isAdmin) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(config.discountCode);
    setCopied(true);
    onApplyPromoCode(config.discountCode);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className={`py-12 px-4 sm:px-6 lg:px-8 transition-all ${
      isAdmin ? 'border-2 border-dashed border-blue-400 my-4 rounded-xl p-3 bg-blue-50/15' : ''
    } ${!config.visible ? 'opacity-50' : ''}`}>
      {/* Admin Block Controls */}
      {isAdmin && (
        <div className="flex items-center justify-between bg-blue-900 text-white px-4 py-2 rounded-lg text-xs mb-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>PROMOTIONAL CALLOUT BANNER</span>
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

      <div className="max-w-7xl mx-auto bg-zinc-900 text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <InlineEditable
              value={config.tag}
              onSave={(val) => onUpdate({ ...config, tag: val })}
              isAdmin={isAdmin}
              labelHint="Promo banner tag"
              className="text-zinc-300 hover:text-white"
            />
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 text-balance">
            <InlineEditable
              value={config.title}
              onSave={(val) => onUpdate({ ...config, title: val })}
              isAdmin={isAdmin}
              labelHint="Promo banner headline"
              className="text-white"
            />
          </h3>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6">
            <InlineEditable
              type="textarea"
              value={config.description}
              onSave={(val) => onUpdate({ ...config, description: val })}
              isAdmin={isAdmin}
              labelHint="Promo banner description"
              className="text-zinc-300"
            />
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-zinc-800/90 border border-zinc-700 px-3.5 py-2 rounded-lg font-mono text-sm">
              <Tag className="w-4 h-4 text-amber-400" />
              <InlineEditable
                value={config.discountCode}
                onSave={(val) => onUpdate({ ...config, discountCode: val.trim().toUpperCase() })}
                isAdmin={isAdmin}
                labelHint="Promo discount code"
                className="text-white font-bold tracking-wider"
              />
            </div>

            <button
              onClick={handleCopyCode}
              className="px-4 py-2.5 bg-white text-zinc-950 font-semibold text-xs rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Code Applied to Bag!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy & Apply Promo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
