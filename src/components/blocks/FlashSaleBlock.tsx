import React, { useState, useEffect } from 'react';
import { FlashSaleBlockConfig } from '../../types/store';
import { InlineEditable } from '../common/InlineEditable';
import { Flame, Clock, Sparkles, Copy, Check, ChevronUp, ChevronDown, ArrowRight } from 'lucide-react';

interface FlashSaleBlockProps {
  config: FlashSaleBlockConfig;
  isAdmin: boolean;
  onUpdate: (updated: FlashSaleBlockConfig) => void;
  onApplyPromoCode: (code: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleHide?: () => void;
}

export const FlashSaleBlock: React.FC<FlashSaleBlockProps> = ({
  config,
  isAdmin,
  onUpdate,
  onApplyPromoCode,
  onMoveUp,
  onMoveDown,
  onToggleHide,
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 48,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!config.visible && !isAdmin) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(config.discountCode);
    setCopied(true);
    onApplyPromoCode(config.discountCode);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatDigit = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      className={`relative overflow-hidden my-4 sm:my-8 transition-all ${
        isAdmin ? 'border-2 border-dashed border-blue-400 rounded-2xl p-2 bg-blue-50/20' : ''
      } ${!config.visible ? 'opacity-50' : ''}`}
    >
      {/* Admin Controls */}
      {isAdmin && (
        <div className="flex flex-wrap items-center justify-between bg-blue-900 text-white px-3 py-2 rounded-lg text-xs mb-3 gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>FLASH SALE COUNTDOWN BLOCK</span>
            {!config.visible && <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px]">Hidden</span>}
          </div>
          <div className="flex items-center gap-1.5">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-zinc-800 relative overflow-hidden">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            {/* Left: Headline & Badge */}
            <div className="text-center lg:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <InlineEditable
                  value={config.badgeText}
                  onSave={(val) => onUpdate({ ...config, badgeText: val })}
                  isAdmin={isAdmin}
                  labelHint="Badge text"
                  className="text-rose-300"
                />
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                <InlineEditable
                  value={config.title}
                  onSave={(val) => onUpdate({ ...config, title: val })}
                  isAdmin={isAdmin}
                  labelHint="Flash sale title"
                  className="text-white"
                />
              </h3>

              <p className="text-sm text-zinc-400 leading-relaxed">
                <InlineEditable
                  value={config.subtitle}
                  onSave={(val) => onUpdate({ ...config, subtitle: val })}
                  isAdmin={isAdmin}
                  labelHint="Flash sale subtitle"
                  className="text-zinc-400"
                />
              </p>
            </div>

            {/* Right: Live Countdown Clock & Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              {/* Ticking Digits */}
              <div className="flex items-center gap-2 font-mono">
                <div className="flex flex-col items-center bg-zinc-800/90 border border-zinc-700/80 rounded-xl px-3 py-2 min-w-[56px] shadow-inner">
                  <span className="text-2xl sm:text-3xl font-black text-white">{formatDigit(timeLeft.hours)}</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-sans">Hours</span>
                </div>
                <span className="text-xl font-bold text-zinc-600">:</span>
                <div className="flex flex-col items-center bg-zinc-800/90 border border-zinc-700/80 rounded-xl px-3 py-2 min-w-[56px] shadow-inner">
                  <span className="text-2xl sm:text-3xl font-black text-rose-400">{formatDigit(timeLeft.minutes)}</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-sans">Mins</span>
                </div>
                <span className="text-xl font-bold text-zinc-600">:</span>
                <div className="flex flex-col items-center bg-zinc-800/90 border border-zinc-700/80 rounded-xl px-3 py-2 min-w-[56px] shadow-inner">
                  <span className="text-2xl sm:text-3xl font-black text-white">{formatDigit(timeLeft.seconds)}</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-sans">Secs</span>
                </div>
              </div>

              {/* Coupon Copy Button */}
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-2 bg-white hover:bg-zinc-100 text-zinc-950 font-extrabold px-5 py-3 rounded-xl shadow-lg transition-all active:scale-95 text-xs sm:text-sm whitespace-nowrap cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Applied ({config.discountCode})</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-600" />
                    <span>{config.ctaText} · Use {config.discountCode}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
