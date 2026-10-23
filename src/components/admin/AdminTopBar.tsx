import React from 'react';
import { 
  PlusCircle, 
  Layers, 
  Palette, 
  Sliders, 
  RotateCcw, 
  Eye, 
  Download, 
  Check, 
  Monitor, 
  Tablet, 
  Smartphone,
  Store,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { StoreConfig } from '../../types/store';

interface AdminTopBarProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onAddProduct: () => void;
  onOpenBlockCustomizer: (initialTab?: 'blocks' | 'theme' | 'legal' | 'payments' | 'products' | 'orders' | 'pnl' | 'presets') => void;
  onResetStore: () => void;
  onExportStore: () => void;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  setViewportMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  totalProductsCount: number;
  totalOrdersCount: number;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  isAdmin,
  onToggleAdmin,
  onAddProduct,
  onOpenBlockCustomizer,
  onResetStore,
  onExportStore,
  viewportMode,
  setViewportMode,
  totalProductsCount,
  totalOrdersCount,
}) => {
  if (!isAdmin) return null;

  return (
    <aside
      aria-label="Admin Studio Toolbar"
      className="bg-blue-900 text-white border-b border-blue-800 text-xs shadow-md sticky top-0 z-50 transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Mode Badge & Description */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-800/80 px-2.5 py-1 rounded-md font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>ADMIN STUDIO</span>
          </div>
          <span className="hidden lg:inline text-blue-200 text-[11px]">
            Click any headline, image, or product line directly to edit (PowerPoint style)
          </span>
        </div>

        {/* Center: Device preview toggle */}
        <div className="hidden md:flex items-center bg-blue-950/60 p-0.5 rounded-lg border border-blue-800">
          <button
            onClick={() => setViewportMode('desktop')}
            className={`p-1.5 rounded transition-colors ${
              viewportMode === 'desktop' ? 'bg-blue-700 text-white shadow-xs' : 'text-blue-300 hover:text-white'
            }`}
            title="Desktop 1440px view"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewportMode('tablet')}
            className={`p-1.5 rounded transition-colors ${
              viewportMode === 'tablet' ? 'bg-blue-700 text-white shadow-xs' : 'text-blue-300 hover:text-white'
            }`}
            title="Tablet 768px view"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewportMode('mobile')}
            className={`p-1.5 rounded transition-colors ${
              viewportMode === 'mobile' ? 'bg-blue-700 text-white shadow-xs' : 'text-blue-300 hover:text-white'
            }`}
            title="Mobile 390px view"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Quick Studio Actions (Neatly wrapped, no grid overflow) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Add Product Button (prominently highlighted) */}
          <button
            onClick={onAddProduct}
            className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-2.5 py-1.5 rounded-md shadow-sm transition-all active:scale-95 text-xs whitespace-nowrap"
            title="Insert a live product card directly in front end"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-950 shrink-0" />
            <span>+ Add Product</span>
          </button>

          {/* Blocks Customizer */}
          <button
            onClick={() => onOpenBlockCustomizer('blocks')}
            className="flex items-center gap-1 bg-blue-800/90 hover:bg-blue-700 text-white px-2 py-1.5 rounded-md transition-colors text-xs whitespace-nowrap"
            title="Manage and reorder site sections"
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>Blocks</span>
          </button>

          {/* Theme & Palette */}
          <button
            onClick={() => onOpenBlockCustomizer('theme')}
            className="flex items-center gap-1 bg-blue-800/90 hover:bg-blue-700 text-white px-2 py-1.5 rounded-md transition-colors text-xs whitespace-nowrap"
            title="Change theme colors, fonts, currency, and brand logo"
          >
            <Palette className="w-3.5 h-3.5 shrink-0" />
            <span>Theme & Logo</span>
          </button>

          {/* Payment Methods */}
          <button
            onClick={() => onOpenBlockCustomizer('payments')}
            className="flex items-center gap-1 bg-blue-800/90 hover:bg-blue-700 text-white px-2 py-1.5 rounded-md transition-colors text-xs whitespace-nowrap"
            title="Configure payment gateways & bank transfer instructions"
          >
            <span>Payments</span>
          </button>

          {/* Legal Documents & Store Policies */}
          <button
            onClick={() => onOpenBlockCustomizer('legal')}
            className="flex items-center gap-1 bg-blue-800/90 hover:bg-blue-700 text-white px-2 py-1.5 rounded-md transition-colors text-xs whitespace-nowrap"
            title="Manage delivery, returns, guarantee, and legal documents"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300 shrink-0" />
            <span>Policies</span>
          </button>

          {/* Orders Counter & View */}
          <button
            onClick={() => onOpenBlockCustomizer('orders')}
            className="relative flex items-center gap-1 bg-blue-800/90 hover:bg-blue-700 text-white px-2 py-1.5 rounded-md transition-colors text-xs whitespace-nowrap"
            title="View customer orders & fulfillment"
          >
            <Store className="w-3.5 h-3.5 shrink-0" />
            <span>Orders</span>
            {totalOrdersCount > 0 && (
              <span className="bg-emerald-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {totalOrdersCount}
              </span>
            )}
          </button>

          {/* P&L Report & Manual Cost Entry */}
          <button
            onClick={() => onOpenBlockCustomizer('pnl')}
            className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-md transition-colors text-xs font-semibold whitespace-nowrap"
            title="View Profit & Loss report and enter manual costs"
          >
            <span>P&L Report</span>
          </button>

          {/* Exit / Preview Mode */}
          <button
            onClick={onToggleAdmin}
            className="flex items-center gap-1 bg-white text-blue-950 hover:bg-blue-50 font-bold px-2.5 py-1.5 rounded-md transition-all shadow-xs text-xs whitespace-nowrap"
            title="Switch to customer storefront view"
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">View As</span> Customer
          </button>
        </div>
      </div>
    </aside>
  );
};
