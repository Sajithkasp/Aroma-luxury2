import React, { useState } from 'react';
import { TestimonialsBlockConfig } from '../../types/store';
import { InlineEditable } from '../common/InlineEditable';
import { Star, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface TestimonialsBlockProps {
  config: TestimonialsBlockConfig;
  isAdmin: boolean;
  onUpdate: (updated: TestimonialsBlockConfig) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleHide?: () => void;
}

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({
  config,
  isAdmin,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onToggleHide,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!config.visible && !isAdmin) return null;

  const items = config.items || [];

  const handleItemUpdate = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate({ ...config, items: newItems });
  };

  const handleAddTestimonial = () => {
    const newItem = {
      id: `t-${Date.now()}`,
      author: 'ELENA V.',
      role: 'Geneva, Switzerland',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      quote: 'An extraordinary buying experience from start to finish. The packaging and finishing are unmatched.',
      rating: 5,
    };
    onUpdate({ ...config, items: [...items, newItem] });
  };

  const handleDeleteTestimonial = (id: string) => {
    if (items.length <= 1) return;
    const newItems = items.filter((it) => it.id !== id);
    onUpdate({ ...config, items: newItems });
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <section
      id="story"
      className={`py-12 sm:py-16 transition-all border-t border-[#ece7dd] ${
        isAdmin ? 'border-2 border-dashed border-blue-400 my-4 rounded-xl p-3 bg-blue-50/15' : ''
      } ${!config.visible ? 'opacity-50' : ''}`}
    >
      {/* Admin Block Controls */}
      {isAdmin && (
        <div className="flex items-center justify-between bg-blue-900 text-white px-4 py-2 rounded-lg text-xs mb-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>CUSTOMER TESTIMONIALS BLOCK</span>
            {!config.visible && (
              <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px]">
                Hidden from Customers
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddTestimonial}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Client Voice</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Luxury Header with Diamond Divider (Screenshot 1 & 2) */}
        <div className="relative text-center mb-10">
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 sm:w-24 bg-[#b58d4a]/40 hidden sm:block"></div>
            <div className="w-1.5 h-1.5 rotate-45 bg-[#b58d4a]"></div>
            <h2 className="font-serif text-base sm:text-lg tracking-widest text-zinc-900 uppercase font-medium">
              <InlineEditable
                value={config.title}
                onSave={(val) => onUpdate({ ...config, title: val })}
                isAdmin={isAdmin}
                labelHint="Testimonials title"
              />
            </h2>
            <div className="w-1.5 h-1.5 rotate-45 bg-[#b58d4a]"></div>
            <div className="h-[1px] w-12 sm:w-24 bg-[#b58d4a]/40 hidden sm:block"></div>
          </div>
        </div>

        {/* Desktop View: 3 Columns with Prev/Next Navigation arrows */}
        <div className="relative">
          {/* Arrow Left */}
          <button
            onClick={prevSlide}
            aria-label="Previous client testimonial"
            className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#dcd6ca] bg-white text-zinc-600 hover:text-zinc-950 hover:border-[#b58d4a] items-center justify-center transition-all z-10 shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="relative bg-white/60 border border-[#e8e2d5] hover:border-[#b58d4a] rounded-lg p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-sm"
              >
                <div>
                  {/* 5 Gold Stars */}
                  <div className="flex items-center gap-1 text-[#b58d4a] mb-3">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="font-serif italic text-xs sm:text-sm text-zinc-700 leading-relaxed mb-6">
                    “
                    <InlineEditable
                      type="textarea"
                      value={item.quote}
                      onSave={(val) => handleItemUpdate(idx, 'quote', val)}
                      isAdmin={isAdmin}
                      labelHint="Quote"
                      className="italic"
                    />
                    ”
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="flex items-center justify-between pt-4 border-t border-[#ece7dd]">
                  <div className="flex items-center gap-3">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.author}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-[#e8e2d5]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#f4ece0] text-[#b58d4a] flex items-center justify-center font-bold text-xs">
                        {item.author.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-serif text-xs font-bold tracking-wider text-zinc-900 uppercase">
                        —{' '}
                        <InlineEditable
                          value={item.author}
                          onSave={(val) => handleItemUpdate(idx, 'author', val)}
                          isAdmin={isAdmin}
                          labelHint="Author name"
                        />
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        <InlineEditable
                          value={item.role}
                          onSave={(val) => handleItemUpdate(idx, 'role', val)}
                          isAdmin={isAdmin}
                          labelHint="Location or Role"
                        />
                      </p>
                    </div>
                  </div>

                  {isAdmin && items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTestimonial(item.id)}
                      className="text-zinc-400 hover:text-rose-600 p-1"
                      title="Delete testimonial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Arrow Right */}
          <button
            onClick={nextSlide}
            aria-label="Next client testimonial"
            className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#dcd6ca] bg-white text-zinc-600 hover:text-zinc-950 hover:border-[#b58d4a] items-center justify-center transition-all z-10 shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8 lg:hidden">
          {items.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setActiveSlide(dotIdx)}
              className={`w-2 h-2 rounded-full transition-all ${
                dotIdx === activeSlide ? 'w-4 bg-[#b58d4a]' : 'bg-[#dcd6ca]'
              }`}
              aria-label={`Slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
