import React, { useState } from 'react';
import { HeroBlockConfig } from '../../types/store';
import { InlineEditable } from '../common/InlineEditable';
import { PRESET_IMAGE_SUGGESTIONS } from '../../data/defaultStore';
import { ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';

interface HeroBlockProps {
  config: HeroBlockConfig;
  isAdmin: boolean;
  onUpdate: (updated: HeroBlockConfig) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleHide?: () => void;
  onExploreClick: () => void;
}

export const HeroBlock: React.FC<HeroBlockProps> = ({
  config,
  isAdmin,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onToggleHide,
  onExploreClick,
}) => {
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  if (!config.visible && !isAdmin) return null;

  return (
    <section
      className={`relative overflow-hidden bg-[#faf8f5] transition-all ${
        isAdmin ? 'border-2 border-dashed border-blue-400 my-4 rounded-xl p-2 bg-blue-50/20' : ''
      } ${!config.visible ? 'opacity-50' : ''}`}
    >
      {/* Admin Block Header Controls */}
      {isAdmin && (
        <div className="flex items-center justify-between bg-blue-900 text-white px-4 py-2 rounded-lg text-xs mb-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>HERO BANNER BLOCK</span>
            {!config.visible && (
              <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px]">
                Hidden from Customers
              </span>
            )}
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
                {config.visible ? 'Hide Block' : 'Show Block'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Top decorative accent & kicker (Screenshot 1 & 2) */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-[#b58d4a] text-xs font-semibold tracking-widest uppercase mb-1">
                <div className="w-1.5 h-1.5 rotate-45 bg-[#b58d4a]"></div>
                <InlineEditable
                  value={config.badgeText || 'NEW COLLECTION'}
                  onSave={(val) => onUpdate({ ...config, badgeText: val })}
                  isAdmin={isAdmin}
                  labelHint="Hero Kicker"
                  className="text-[#b58d4a] tracking-widest"
                />
              </div>
              <div className="h-[1px] w-14 bg-[#b58d4a]/50"></div>
            </div>

            {/* Display Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-zinc-900 tracking-tight leading-[1.1] mb-4">
              <InlineEditable
                value={config.title}
                onSave={(val) => onUpdate({ ...config, title: val })}
                isAdmin={isAdmin}
                labelHint="Hero Main Headline"
                className="font-serif text-zinc-900"
              />
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-zinc-600 font-light leading-relaxed mb-6 max-w-lg">
              <InlineEditable
                type="textarea"
                value={config.subtitle}
                onSave={(val) => onUpdate({ ...config, subtitle: val })}
                isAdmin={isAdmin}
                labelHint="Hero Subtitle"
                className="text-zinc-600"
              />
            </p>

            {/* Gold CTA Button */}
            <div>
              <button
                onClick={onExploreClick}
                className="px-8 py-3.5 bg-[#b58d4a] hover:bg-[#9e7939] text-white text-xs font-semibold tracking-widest uppercase rounded-sm transition-all shadow-xs"
              >
                <InlineEditable
                  value={config.ctaText || 'SHOP NOW'}
                  onSave={(val) => onUpdate({ ...config, ctaText: val })}
                  isAdmin={isAdmin}
                  labelHint="Primary CTA text"
                />
              </button>
            </div>
          </div>

          {/* Right Column: Muse Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/3 sm:aspect-5/4 lg:aspect-4/5 w-full rounded-lg overflow-hidden bg-[#faf8f5] shadow-xs">
              <img
                src={config.heroImage}
                alt={config.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {/* Admin Change Hero Image Button */}
              {isAdmin && (
                <div className="absolute bottom-3 right-3 z-20">
                  <button
                    onClick={() => setShowImagePicker(!showImagePicker)}
                    className="bg-zinc-900/90 text-white text-xs px-3 py-1.5 rounded shadow-lg flex items-center gap-1.5 backdrop-blur-xs hover:bg-black transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Change Image</span>
                  </button>
                </div>
              )}
            </div>

            {/* Image Picker Dropdown for Hero */}
            {isAdmin && showImagePicker && (
              <div className="absolute top-4 right-4 left-4 p-4 bg-white border border-[#b58d4a] rounded-xl shadow-2xl text-xs space-y-3 z-30 animate-slide-down">
                <div className="flex items-center justify-between font-bold text-zinc-900">
                  <span>Choose Hero Banner Image:</span>
                  <button onClick={() => setShowImagePicker(false)} className="text-zinc-400 hover:text-zinc-800">
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {PRESET_IMAGE_SUGGESTIONS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onUpdate({ ...config, heroImage: preset.url });
                        setShowImagePicker(false);
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

                <div className="flex gap-1">
                  <input
                    type="url"
                    placeholder="Paste image URL..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="grow px-2 py-1 text-xs border border-zinc-300 rounded"
                  />
                  <button
                    onClick={() => {
                      if (customUrl.trim()) {
                        onUpdate({ ...config, heroImage: customUrl.trim() });
                        setCustomUrl('');
                        setShowImagePicker(false);
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
        </div>
      </div>
    </section>
  );
};
