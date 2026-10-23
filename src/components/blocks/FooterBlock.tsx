import React, { useState } from 'react';
import { FooterBlockConfig, SocialLinkItem, SocialPlatform, LegalDocument } from '../../types/store';
import { InlineEditable } from '../common/InlineEditable';
import { ChevronUp, ChevronDown, Plus, Trash2, Edit3, ShieldCheck } from 'lucide-react';

interface FooterBlockProps {
  config: FooterBlockConfig;
  storeName: string;
  isAdmin: boolean;
  legalDocuments?: LegalDocument[];
  onOpenLegalModal?: (docId?: string) => void;
  onAddNewLegalDoc?: () => void;
  onEditLegalDoc?: (doc: LegalDocument) => void;
  onDeleteLegalDoc?: (docId: string) => void;
  onUpdate: (updated: FooterBlockConfig) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleHide?: () => void;
}

const GoldCompassEmblem: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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

export const FooterBlock: React.FC<FooterBlockProps> = ({
  config,
  storeName,
  isAdmin,
  legalDocuments = [],
  onOpenLegalModal,
  onAddNewLegalDoc,
  onEditLegalDoc,
  onDeleteLegalDoc,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onToggleHide,
}) => {
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('instagram');
  const [newUrl, setNewUrl] = useState('');

  if (!config.visible && !isAdmin) return null;

  const socialLinks = config.socialLinks || [];

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    const newItem: SocialLinkItem = {
      id: `soc-${Date.now()}`,
      platform: newPlatform,
      url: newUrl.trim(),
      enabled: true,
    };
    onUpdate({
      ...config,
      socialLinks: [...socialLinks, newItem],
    });
    setNewUrl('');
    setIsAddingSocial(false);
  };

  const handleRemoveSocial = (id: string) => {
    onUpdate({
      ...config,
      socialLinks: socialLinks.filter((s) => s.id !== id),
    });
  };

  const renderSocialIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'instagram':
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.456 5 15.658 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
          </svg>
        );
      case 'pinterest':
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0a12 12 0 0 0-4.37 23.18c-.06-.97-.12-2.46.03-3.52l1-4.24s-.26-.52-.26-1.28c0-1.2.7-2.1 1.56-2.1.74 0 1.1.55 1.1 1.22 0 .74-.47 1.86-.72 2.89-.2.86.43 1.56 1.28 1.56 1.54 0 2.73-1.62 2.73-3.96 0-2.07-1.49-3.52-3.62-3.52-2.46 0-3.91 1.85-3.91 3.76 0 .75.29 1.55.65 1.99a.3.3 0 0 1 .07.28c-.08.33-.26 1.05-.3 1.2-.05.2-.16.24-.37.15-1.39-.65-2.26-2.67-2.26-4.3 0-3.5 2.54-6.72 7.34-6.72 3.86 0 6.85 2.75 6.85 6.42 0 3.83-2.41 6.92-5.76 6.92-1.12 0-2.18-.58-2.54-1.27l-.69 2.64c-.25.96-.92 2.16-1.38 2.89A12 12 0 1 0 12 0z" />
          </svg>
        );
      case 'tiktok':
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
    }
  };

  return (
    <footer
      className={`bg-[#0d0d0f] text-zinc-400 py-12 transition-all border-t border-zinc-800 ${
        isAdmin ? 'border-2 border-dashed border-blue-400 my-4 rounded-xl p-3 bg-blue-950/40' : ''
      } ${!config.visible ? 'opacity-50' : ''}`}
    >
      {/* Admin Block Controls */}
      {isAdmin && (
        <div className="flex items-center justify-between bg-blue-900 text-white px-4 py-2 rounded-lg text-xs mb-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>FOOTER & LEGAL POLICIES BLOCK</span>
            {!config.visible && (
              <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px]">Hidden</span>
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
                {config.visible ? 'Hide' : 'Show'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* DESKTOP LAYOUT (Screenshot 1) */}
        <div className="hidden md:grid md:grid-cols-12 gap-8 pb-10 border-b border-zinc-800/80 items-start">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center gap-2.5">
              <GoldCompassEmblem className="w-6 h-6 text-[#b58d4a]" />
              <span className="font-serif text-lg tracking-[0.2em] font-medium text-white uppercase">
                {storeName || 'AURORA LUXE'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-sm pt-1">
              <InlineEditable
                type="textarea"
                value={config.aboutText || 'Timeless luxury. Modern elegance. Exceptional quality.'}
                onSave={(val) => onUpdate({ ...config, aboutText: val })}
                isAdmin={isAdmin}
                labelHint="About text"
                className="text-zinc-400 text-xs"
              />
            </p>
          </div>

          {/* Legal Policies */}
          <div className="md:col-span-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xs font-semibold tracking-widest uppercase text-white">
                LEGAL
              </span>
              {isAdmin && onAddNewLegalDoc && (
                <button
                  type="button"
                  onClick={onAddNewLegalDoc}
                  className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Policy</span>
                </button>
              )}
            </div>

            <ul className="space-y-1.5 text-xs text-zinc-400">
              {legalDocuments.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between group/leg">
                  <button
                    type="button"
                    onClick={() => onOpenLegalModal && onOpenLegalModal(doc.id)}
                    className="hover:text-[#b58d4a] transition-colors text-left truncate cursor-pointer text-xs"
                  >
                    {doc.title}
                  </button>

                  {isAdmin && (
                    <div className="flex items-center gap-1 opacity-0 group-hover/leg:opacity-100 transition-opacity">
                      {onEditLegalDoc && (
                        <button
                          type="button"
                          onClick={() => onEditLegalDoc(doc)}
                          className="p-0.5 text-blue-400 hover:text-white"
                          title="Edit policy"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      )}
                      {onDeleteLegalDoc && (
                        <button
                          type="button"
                          onClick={() => onDeleteLegalDoc(doc.id)}
                          className="p-0.5 text-rose-400 hover:text-white"
                          title="Delete policy"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us / Social Links */}
          <div className="md:col-span-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xs font-semibold tracking-widest uppercase text-white">
                FOLLOW US
              </span>
              {isAdmin && (
                <button
                  onClick={() => setIsAddingSocial(!isAddingSocial)}
                  className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Social</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map((item) => (
                <div key={item.id} className="relative group/soc">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 hover:border-[#b58d4a] hover:text-[#b58d4a] text-zinc-300 flex items-center justify-center transition-all"
                    title={item.platform}
                  >
                    {renderSocialIcon(item.platform)}
                  </a>

                  {isAdmin && (
                    <button
                      onClick={() => handleRemoveSocial(item.id)}
                      className="absolute -top-1 -right-1 bg-rose-600 text-white p-0.5 rounded-full opacity-0 group-hover/soc:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Quick add social form */}
            {isAdmin && isAddingSocial && (
              <form onSubmit={handleAddSocial} className="p-2.5 bg-zinc-900 border border-blue-400 rounded-lg space-y-2 text-xs">
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value as SocialPlatform)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded p-1 text-xs"
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="pinterest">Pinterest</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">Twitter / X</option>
                </select>
                <div className="flex gap-1">
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="grow px-2 py-1 bg-zinc-800 border border-zinc-700 text-white rounded text-xs"
                  />
                  <button type="submit" className="px-2 py-1 bg-[#b58d4a] text-white rounded font-bold">
                    Add
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* MOBILE LAYOUT (Screenshot 2) */}
        <div className="md:hidden space-y-6 pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <GoldCompassEmblem className="w-5 h-5 text-[#b58d4a]" />
            <span className="font-serif text-base tracking-[0.2em] font-medium text-white uppercase">
              {storeName || 'AURORA LUXE'}
            </span>
          </div>

          {/* Horizontal Legal links on Mobile */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 uppercase tracking-widest font-serif">
            {legalDocuments.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => onOpenLegalModal && onOpenLegalModal(doc.id)}
                className="hover:text-white transition-colors"
              >
                {doc.title.replace(' Policy', '').replace(' Rates & Schedules', '')}
              </button>
            ))}
          </div>

          {/* Social Icons row */}
          <div className="flex items-center gap-2">
            {socialLinks.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center"
              >
                {renderSocialIcon(item.platform)}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright Bottom */}
        <div className="pt-6 text-center text-xs text-zinc-500">
          <InlineEditable
            value={config.copyrightText || '© 2024 Aurora Luxe. All rights reserved.'}
            onSave={(val) => onUpdate({ ...config, copyrightText: val })}
            isAdmin={isAdmin}
            labelHint="Copyright disclaimer"
            className="text-zinc-500"
          />
        </div>
      </div>
    </footer>
  );
};
