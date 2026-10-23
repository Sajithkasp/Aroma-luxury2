import React, { useState, useEffect } from 'react';
import { LegalDocument } from '../../types/store';
import { X, ShieldCheck, Truck, RefreshCw, Lock, Award, FileText, Check, Copy, Printer, Edit3 } from 'lucide-react';

interface LegalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: LegalDocument[];
  activeDocumentId?: string;
  isAdmin?: boolean;
  onEditDocument?: (doc: LegalDocument) => void;
}

export const LegalDocumentModal: React.FC<LegalDocumentModalProps> = ({
  isOpen,
  onClose,
  documents,
  activeDocumentId,
  isAdmin = false,
  onEditDocument,
}) => {
  const [selectedId, setSelectedId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const enabledDocs = documents.filter((d) => d.enabled);

  useEffect(() => {
    if (activeDocumentId && documents.some((d) => d.id === activeDocumentId)) {
      setSelectedId(activeDocumentId);
    } else if (enabledDocs.length > 0) {
      setSelectedId(enabledDocs[0].id);
    }
  }, [activeDocumentId, documents]);

  if (!isOpen) return null;

  const currentDoc = documents.find((d) => d.id === selectedId) || enabledDocs[0];

  const handleCopy = () => {
    if (!currentDoc) return;
    navigator.clipboard.writeText(`${currentDoc.title}\n\n${currentDoc.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'shipping':
        return <Truck className="w-4 h-4 text-emerald-600" />;
      case 'returns':
        return <RefreshCw className="w-4 h-4 text-blue-600" />;
      case 'privacy':
        return <Lock className="w-4 h-4 text-purple-600" />;
      case 'guarantee':
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return <FileText className="w-4 h-4 text-zinc-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 leading-tight">
                Store Policies & Legal Terms
              </h2>
              <p className="text-xs text-zinc-500">
                Transparent buyer protections and official delivery documentation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && currentDoc && onEditDocument && (
              <button
                onClick={() => {
                  onClose();
                  onEditDocument(currentDoc);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold border border-blue-200"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Policy</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content - Two Column layout (Tabs on left, Reader on right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Document Navigation Tabs */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-200 bg-zinc-50/50 p-2 sm:p-3 overflow-x-auto md:overflow-y-auto shrink-0 flex md:flex-col gap-1.5">
            {documents.map((doc) => {
              const isSelected = doc.id === currentDoc?.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedId(doc.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all shrink-0 md:shrink md:w-full ${
                    isSelected
                      ? 'bg-white shadow-xs text-zinc-950 font-bold border border-zinc-200/80 ring-1 ring-blue-500/20'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 font-medium'
                  }`}
                >
                  <span className="shrink-0">{getCategoryIcon(doc.category)}</span>
                  <div className="truncate min-w-0">
                    <div className="text-xs truncate">{doc.title}</div>
                    {!doc.enabled && (
                      <span className="text-[10px] text-rose-500 font-semibold block">Hidden</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Document Content View */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-white">
            {currentDoc ? (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Doc Header */}
                <div className="border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                    {getCategoryIcon(currentDoc.category)}
                    <span>{currentDoc.category} Policy</span>
                    <span>·</span>
                    <span className="text-zinc-400 font-normal">Last Updated: {currentDoc.lastUpdated}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
                    {currentDoc.title}
                  </h1>
                  {currentDoc.summary && (
                    <p className="mt-2 text-sm text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-lg border border-zinc-100 italic">
                      "{currentDoc.summary}"
                    </p>
                  )}
                </div>

                {/* Formatted Text Content */}
                <div className="text-sm text-zinc-700 leading-relaxed space-y-4">
                  {currentDoc.content.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={idx} className="text-base font-bold text-zinc-900 pt-3 border-t border-zinc-100">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                      const items = paragraph.split('\n');
                      return (
                        <ul key={idx} className="list-disc pl-5 space-y-1.5 text-zinc-600">
                          {items.map((item, i) => (
                            <li key={i}>
                              <span dangerouslySetInnerHTML={{
                                __html: item
                                  .replace(/^[*|-]\s+/, '')
                                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              }} />
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    if (/^\d+\.\s/.test(paragraph)) {
                      const items = paragraph.split('\n');
                      return (
                        <ol key={idx} className="list-decimal pl-5 space-y-1.5 text-zinc-600">
                          {items.map((item, i) => (
                            <li key={i}>
                              <span dangerouslySetInnerHTML={{
                                __html: item
                                  .replace(/^\d+\.\s+/, '')
                                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              }} />
                            </li>
                          ))}
                        </ol>
                      );
                    }
                    return (
                      <p
                        key={idx}
                        dangerouslySetInnerHTML={{
                          __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }}
                      />
                    );
                  })}
                </div>

                {/* Actions Bar */}
                <div className="pt-6 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied to Clipboard' : 'Copy Policy Text'}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Document</span>
                    </button>
                  </div>

                  {isAdmin && onEditDocument && (
                    <button
                      onClick={() => {
                        onClose();
                        onEditDocument(currentDoc);
                      }}
                      className="sm:hidden flex items-center gap-1 text-blue-600 font-bold"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit In Admin</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500">No legal document selected.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
