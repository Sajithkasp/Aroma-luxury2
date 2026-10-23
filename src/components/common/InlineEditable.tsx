import React, { useState, useEffect, useRef } from 'react';
import { Check, Edit3 } from 'lucide-react';

interface InlineEditableProps {
  value: string | number;
  onSave: (newValue: string) => void;
  isAdmin: boolean;
  type?: 'text' | 'number' | 'textarea';
  className?: string;
  placeholder?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  labelHint?: string;
}

export const InlineEditable: React.FC<InlineEditableProps> = ({
  value,
  onSave,
  isAdmin,
  type = 'text',
  className = '',
  placeholder = 'Click to edit...',
  as = 'span',
  labelHint,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(String(value ?? ''));
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentValue(String(value ?? ''));
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleCommit = () => {
    setIsEditing(false);
    if (currentValue !== String(value)) {
      onSave(currentValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault();
      handleCommit();
    } else if (e.key === 'Escape') {
      setCurrentValue(String(value ?? ''));
      setIsEditing(false);
    }
  };

  if (!isAdmin) {
    const Component = as;
    return <Component className={className}>{value || placeholder}</Component>;
  }

  if (isEditing) {
    return (
      <div className="relative inline-flex items-center w-full min-w-0 max-w-full z-20">
        {type === 'textarea' ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
            rows={3}
            className={`w-full min-w-0 max-w-full bg-white text-zinc-900 border-2 border-blue-500 rounded p-1.5 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm ${className}`}
            placeholder={placeholder}
          />
        ) : (
          <div className="flex items-center gap-1 w-full min-w-0 max-w-full">
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type}
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onBlur={handleCommit}
              onKeyDown={handleKeyDown}
              className={`w-full min-w-0 max-w-full bg-white text-zinc-900 border-2 border-blue-500 rounded px-2 py-0.5 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm ${className}`}
              placeholder={placeholder}
            />
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleCommit();
              }}
              className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 shrink-0"
              title="Save"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <div className="absolute -top-6 left-0 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-30 font-medium max-w-[calc(100vw-32px)] truncate">
          {labelHint || 'Editing line (Press Enter to apply)'}
        </div>
      </div>
    );
  }

  const Component = as;
  return (
    <Component
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      title="Click to edit like PowerPoint"
      className={`group relative cursor-pointer transition-all ppt-editable-hover rounded px-1 -mx-1 ${className}`}
    >
      {value ? (
        <span>{value}</span>
      ) : (
        <span className="italic text-zinc-400">{placeholder}</span>
      )}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 inline-flex items-center text-blue-500 text-xs align-middle">
        <Edit3 className="w-3 h-3" />
      </span>
    </Component>
  );
};
