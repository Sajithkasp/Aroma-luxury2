import React, { useState } from 'react';
import { HeaderBlockConfig } from '../../types/store';
import { InlineEditable } from './InlineEditable';
import { PRESET_IMAGE_SUGGESTIONS } from '../../data/defaultStore';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  User, 
  Sliders, 
  X, 
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';

interface HeaderProps {
  config: HeaderBlockConfig;
  isAdmin: boolean;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onToggleAdmin: () => void;
  onUpdateHeader: (updated: HeaderBlockConfig) => void;
  onSearchClick: () => void;
  onWishlistClick: () => void;
  onHomeClick?: () => void;
}

const GoldEmblem: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor">
    <path
      d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
      fill="#b58d4a"
      stroke="#b58d4a"
      strokeWidth="0.5"
    />
    <path
      d="M12 5.5L13.2 9.5L17.2 10.7L13.2 11.9L12 15.9L10.8 11.9L6.8 10.7L10.8 9.5L12 5.5Z"
      fill="#ffffff"
      fillOpacity="0.3"
    />
    <circle cx="12" cy="10" r="1.2" fill="#9e7939" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  config,
  isAdmin,
  cartCount,
  wishlistCount,
  onOpenCart,
  onToggleAdmin,
  onUpdateHeader,
  onSearchClick,
  onWishlistClick,
  onHomeClick,
}) => {
  const [showLogoPicker, setShowLogoPicker] = useState(false);
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [showLinkEditor, setShowLinkEditor] = useState(false);

  const handleLogoSelect = (url: string) => {
    onUpdateHeader({ ...config, logoUrl: url });
    setShowLogoPicker(false);
  };

  return (
    <header className="w-full storefront-header bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8e2d5] sticky top-0 z-40 transition-colors">
      {/* Optional Slim Announcement Bar */}
      {config.showAnnouncement && (
        <div className="bg-[#121212] text-[#f4eee3] text-[11px] py-1.5 px-4 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 text-center font-medium tracking-wide">
              <InlineEditable
                value={config.announcementText}
                onSave={(val) => onUpdateHeader({ ...config, announcementText: val })}
                isAdmin={isAdmin}
                labelHint="Top Announcement text"
                className="text-[#f4eee3]"
              />
            </div>
            {isAdmin && (
              <button
                onClick={() => onUpdateHeader({ ...config, showAnnouncement: false })}
                className="text-[10px] text-zinc-400 hover:text-white underline shrink-0"
              >
                Hide
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Header Container (Desktop & Mobile) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Left Zone: Brand Logo & Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={isAdmin ? undefined : (config.brandNameLink || '/')}
            onClick={(e) => {
              if (!isAdmin && onHomeClick) {
                e.preventDefault();
                onHomeClick();
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {config.logoUrl ? (
              <img
                src={config.logoUrl}
                alt={config.storeName}
                referrerPolicy="no-referrer"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            ) : (
              <GoldEmblem className="w-6 h-6 sm:w-7 sm:h-7 text-[#b58d4a]" />
            )}

            <span className="font-serif text-lg sm:text-xl tracking-[0.2em] font-medium text-zinc-900 uppercase group-hover:text-[#b58d4a] transition-colors">
              <InlineEditable
                value={config.storeName || 'AURORA LUXE'}
                onSave={(val) => onUpdateHeader({ ...config, storeName: val.trim() || 'AURORA LUXE' })}
                isAdmin={isAdmin}
                labelHint="Brand Name"
                className="font-serif tracking-[0.2em] uppercase"
              />
            </span>
          </a>

          {/* Admin Logo Controls */}
          {isAdmin && (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => setShowLogoPicker(!showLogoPicker)}
                className="p-1 text-zinc-400 hover:text-blue-600 rounded"
                title="Change Logo"
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowLinkEditor(!showLinkEditor)}
                className="p-1 text-zinc-400 hover:text-blue-600 rounded"
                title="Configure Links"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Center Zone: Search Input (Desktop screenshot) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div
            onClick={onSearchClick}
            className="w-full relative flex items-center bg-white border border-[#dcd6ca] hover:border-[#b58d4a] rounded-sm px-3.5 py-1.5 cursor-pointer transition-colors"
          >
            <input
              type="text"
              readOnly
              placeholder="Search for luxury pieces..."
              className="w-full text-xs text-zinc-800 placeholder-zinc-400 bg-transparent focus:outline-none cursor-pointer"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          </div>
        </div>

        {/* Right Zone: Actions (Login, Wishlist, Cart, Admin toggle) */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          {/* Mobile Search Icon */}
          <button
            onClick={onSearchClick}
            className="md:hidden p-1.5 text-zinc-700 hover:text-zinc-950 transition-colors"
            aria-label="Search"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Desktop Login Button */}
          <button
            onClick={() => onSearchClick()}
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-700 hover:text-zinc-950 transition-colors"
          >
            <User className="w-4 h-4 text-zinc-600" />
            <span>Login</span>
          </button>

          {/* Wishlist Button with Heart Icon */}
          <button
            onClick={onWishlistClick}
            className="relative flex items-center gap-1.5 text-xs text-zinc-700 hover:text-zinc-950 transition-colors p-1"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-4.5 h-4.5 text-zinc-700" />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#b58d4a] text-white text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Button with Gold Pill Badge (As seen in Screenshot 1 & 2) */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 text-xs text-zinc-900 hover:text-[#b58d4a] transition-colors p-1"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4.5 h-4.5 text-zinc-800" />
            <span className="hidden sm:inline">Cart</span>
            <span className="w-4.5 h-4.5 rounded-full bg-[#b58d4a] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
              {cartCount}
            </span>
          </button>

          {/* Admin Studio Mode Button */}
          <button
            onClick={onToggleAdmin}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all shadow-xs ${
              isAdmin
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-[#dcd6ca]'
            }`}
            title="Toggle Admin Studio Mode"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAdmin ? 'Admin' : 'Admin'}</span>
          </button>
        </div>
      </div>

      {/* Logo Picker Popover */}
      {isAdmin && showLogoPicker && (
        <div className="absolute top-16 left-4 p-4 bg-white border border-[#b58d4a] rounded-xl shadow-2xl text-xs space-y-3 z-50 max-w-sm animate-slide-down">
          <div className="flex items-center justify-between font-bold text-zinc-900">
            <span>Select Brand Logo:</span>
            <button onClick={() => setShowLogoPicker(false)} className="text-zinc-400 hover:text-zinc-800">✕</button>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {PRESET_IMAGE_SUGGESTIONS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLogoSelect(preset.url)}
                className="aspect-square rounded border border-zinc-200 overflow-hidden hover:ring-2 hover:ring-[#b58d4a]"
              >
                <img src={preset.url} alt={preset.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            <input
              type="url"
              placeholder="Or paste Logo URL..."
              value={customLogoUrl}
              onChange={(e) => setCustomLogoUrl(e.target.value)}
              className="grow px-2 py-1 text-xs border border-zinc-300 rounded"
            />
            <button
              onClick={() => {
                if (customLogoUrl.trim()) {
                  handleLogoSelect(customLogoUrl.trim());
                  setCustomLogoUrl('');
                }
              }}
              className="px-2 py-1 bg-[#b58d4a] text-white rounded font-bold"
            >
              Set
            </button>
          </div>
        </div>
      )}

      {/* Link Editor Popover */}
      {isAdmin && showLinkEditor && (
        <div className="absolute top-16 left-4 p-4 bg-white border border-blue-300 rounded-xl shadow-2xl text-xs space-y-3 z-50 max-w-xs animate-slide-down">
          <div className="flex items-center justify-between font-bold text-zinc-900">
            <span>Brand Destination Link:</span>
            <button onClick={() => setShowLinkEditor(false)} className="text-zinc-400 hover:text-zinc-800">✕</button>
          </div>
          <input
            type="text"
            value={config.brandNameLink || '/'}
            onChange={(e) => onUpdateHeader({ ...config, brandNameLink: e.target.value })}
            className="w-full px-2 py-1 text-xs border border-zinc-300 rounded font-mono"
            placeholder="/"
          />
        </div>
      )}
    </header>
  );
};
