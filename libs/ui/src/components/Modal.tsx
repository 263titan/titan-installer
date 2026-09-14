import React, { useEffect, useRef } from 'react';

export interface ModalProps {
  open:       boolean;
  onClose:    () => void;
  title?:     string;
  children:   React.ReactNode;
  footer?:    React.ReactNode;
  width?:     string;
  className?: string;
}

export function Modal({ open, onClose, title, children, footer, width = '480px', className = '' }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div
        style={{ width, maxWidth: '90vw' }}
        className={`bg-[var(--titan-bg)] rounded-xl border border-[var(--titan-border)] shadow-xl flex flex-col max-h-[85vh] ${className}`}
        role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--titan-border)]">
            <h2 id="modal-title" className="text-[15px] font-semibold text-[var(--titan-text)]">{title}</h2>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--titan-text-muted)] hover:bg-[var(--titan-bg-raised)] hover:text-[var(--titan-text)]">✕</button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="px-5 py-3.5 border-t border-[var(--titan-border)] flex justify-end gap-2 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
