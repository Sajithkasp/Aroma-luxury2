import React, { useState } from 'react';
import { FaqBlockConfig, FaqItem } from '../../types/store';
import { InlineEditable } from '../common/InlineEditable';
import { ChevronDown, Plus, Trash2, ChevronUp } from 'lucide-react';

interface FaqBlockProps {
  config: FaqBlockConfig;
  isAdmin: boolean;
  onUpdate: (updated: FaqBlockConfig) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleHide?: () => void;
  onOpenLegalModal?: (docId?: string) => void;
}

export const FaqBlock: React.FC<FaqBlockProps> = ({
  config,
  isAdmin,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onToggleHide,
}) => {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  if (!config.visible && !isAdmin) return null;

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleUpdateItem = (id: string, updated: Partial<FaqItem>) => {
    onUpdate({
      ...config,
      items: config.items.map((it) => (it.id === id ? { ...it, ...updated } : it)),
    });
  };

  const handleCreateFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const newItem: FaqItem = {
      id: `faq-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: 'General',
      enabled: true,
    };
    onUpdate({
      ...config,
      items: [...config.items, newItem],
    });
    setNewQuestion('');
    setNewAnswer('');
    setIsAddingFaq(false);
  };

  const handleDeleteItem = (id: string) => {
    if (config.items.length <= 1) return;
    onUpdate({
      ...config,
      items: config.items.filter((it) => it.id !== id),
    });
  };

  return (
    <section
      id="faq"
      className={`py-12 sm:py-16 transition-all border-t border-[#ece7dd] ${
        isAdmin ? 'border-2 border-dashed border-blue-400 my-4 rounded-xl p-3 bg-blue-50/15' : ''
      } ${!config.visible ? 'opacity-50' : ''}`}
    >
      {/* Admin Controls */}
      {isAdmin && (
        <div className="flex flex-wrap items-center justify-between bg-blue-900 text-white px-4 py-2 rounded-lg text-xs mb-6 gap-2 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>FREQUENTLY ASKED QUESTIONS BLOCK</span>
            {!config.visible && (
              <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px]">Hidden</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingFaq(!isAddingFaq)}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-[11px] flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add FAQ</span>
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

      {/* Add FAQ Form */}
      {isAdmin && isAddingFaq && (
        <form
          onSubmit={handleCreateFaq}
          className="max-w-2xl mx-auto p-4 bg-white border border-[#b58d4a] rounded-xl shadow-lg mb-8 space-y-3 text-xs"
        >
          <div className="flex items-center justify-between font-bold text-zinc-900 text-sm">
            <span>Add New FAQ Question:</span>
            <button type="button" onClick={() => setIsAddingFaq(false)} className="text-zinc-400 hover:text-zinc-800">
              ✕
            </button>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Question:</label>
            <input
              type="text"
              required
              placeholder="e.g. Do you offer complimentary resizing?"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full px-3 py-1.5 border border-zinc-300 rounded text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Answer:</label>
            <textarea
              required
              rows={3}
              placeholder="Provide a detailed, elegant answer..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full px-3 py-1.5 border border-zinc-300 rounded text-xs"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#b58d4a] text-white font-bold rounded text-xs hover:bg-[#9e7939]"
          >
            Save FAQ
          </button>
        </form>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="font-serif text-base sm:text-lg tracking-widest text-zinc-900 uppercase font-medium">
            <InlineEditable
              value={config.title}
              onSave={(val) => onUpdate({ ...config, title: val })}
              isAdmin={isAdmin}
              labelHint="FAQ Title"
            />
          </h2>
        </div>

        {/* Desktop View: 2-Column Grid (As seen in Screenshot 1) */}
        <div className="hidden md:grid md:grid-cols-2 gap-3 lg:gap-4">
          {config.items.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="border border-[#e8e2d5] hover:border-[#b58d4a] rounded-sm bg-white transition-all overflow-hidden"
              >
                <div
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center justify-between p-3.5 sm:p-4 cursor-pointer hover:bg-[#faf8f5] transition-colors"
                >
                  <span className="font-serif text-xs sm:text-[13px] font-medium text-zinc-900">
                    <InlineEditable
                      value={item.question}
                      onSave={(val) => handleUpdateItem(item.id, { question: val })}
                      isAdmin={isAdmin}
                      labelHint="FAQ Question"
                    />
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-zinc-500 font-sans flex items-center gap-1 group-hover:text-[#b58d4a]">
                      <span>{isOpen ? 'Show less' : 'Learn more'}</span>
                      <span className="text-sm font-bold">{isOpen ? '−' : '+'}</span>
                    </span>
                    {isAdmin && config.items.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id);
                        }}
                        className="text-zinc-400 hover:text-rose-600 p-0.5 ml-1"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-zinc-600 leading-relaxed border-t border-[#f4ede1] bg-[#faf8f5]/40 animate-slide-down">
                    <InlineEditable
                      type="textarea"
                      value={item.answer}
                      onSave={(val) => handleUpdateItem(item.id, { answer: val })}
                      isAdmin={isAdmin}
                      labelHint="FAQ Answer"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile View: Vertical Accordion List (As seen in Screenshot 2) */}
        <div className="md:hidden divide-y divide-[#ece7dd] border-y border-[#ece7dd] bg-white">
          {config.items.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div key={item.id} className="transition-colors">
                <div
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center justify-between py-3.5 px-3 cursor-pointer hover:bg-[#faf8f5] active:bg-[#f3ede2]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm text-[#b58d4a] font-bold">{isOpen ? '−' : '+'}</span>
                    <span className="font-serif text-xs text-zinc-900 font-medium">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform ${
                      isOpen ? 'rotate-180 text-[#b58d4a]' : ''
                    }`}
                  />
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-zinc-600 leading-relaxed bg-[#faf8f5] animate-slide-down">
                    <InlineEditable
                      type="textarea"
                      value={item.answer}
                      onSave={(val) => handleUpdateItem(item.id, { answer: val })}
                      isAdmin={isAdmin}
                      labelHint="FAQ Answer"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
