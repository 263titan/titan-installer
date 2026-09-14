import React, { createContext, useContext, useState, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Badge
// ─────────────────────────────────────────────────────────────────────────────

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';

export interface BadgeProps {
  variant?:   BadgeVariant;
  children:   React.ReactNode;
  className?: string;
  dot?:       boolean;
}

const badgeColors: Record<BadgeVariant, string> = {
  default: 'bg-[var(--titan-bg-overlay)] text-[var(--titan-text-muted)]',
  success: 'bg-green-50  text-green-700  dark:bg-green-950 dark:text-green-300',
  warning: 'bg-amber-50  text-amber-700  dark:bg-amber-950 dark:text-amber-300',
  error:   'bg-red-50    text-red-700    dark:bg-red-950   dark:text-red-300',
  info:    'bg-blue-50   text-blue-700   dark:bg-blue-950  dark:text-blue-300',
  purple:  'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-400',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error:   'bg-red-500',
  info:    'bg-blue-500',
  purple:  'bg-purple-500',
};

export function Badge({ variant = 'default', children, className = '', dot }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium ${badgeColors[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Alert
// ─────────────────────────────────────────────────────────────────────────────

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?:   AlertVariant;
  title?:     string;
  children:   React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const alertStyles: Record<AlertVariant, { bg: string; border: string; icon: React.ReactNode }> = {
  info:    { bg: 'bg-blue-50  border-blue-200  text-blue-800',  border: 'border-l-4 border-l-blue-500',  icon: '🔵' },
  success: { bg: 'bg-green-50 border-green-200 text-green-800', border: 'border-l-4 border-l-green-500', icon: '✅' },
  warning: { bg: 'bg-amber-50 border-amber-200 text-amber-800', border: 'border-l-4 border-l-amber-500', icon: '⚠️' },
  error:   { bg: 'bg-red-50   border-red-200   text-red-800',   border: 'border-l-4 border-l-red-500',   icon: '❌' },
};

export function Alert({ variant = 'info', title, children, onDismiss, className = '' }: AlertProps) {
  const s = alertStyles[variant];
  return (
    <div role="alert" className={`flex gap-3 p-3 rounded-md border ${s.bg} ${s.border} ${className}`}>
      <span className="text-sm flex-shrink-0">{s.icon}</span>
      <div className="flex-1 min-w-0">
        {title && <p className="text-[13px] font-semibold mb-0.5">{title}</p>}
        <div className="text-[12px] leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="flex-shrink-0 opacity-60 hover:opacity-100 text-sm leading-none">✕</button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress
// ─────────────────────────────────────────────────────────────────────────────

export interface ProgressProps {
  value:       number;   // 0-100
  label?:      string;
  showPercent?: boolean;
  variant?:    'default' | 'success' | 'warning' | 'error';
  size?:       'sm' | 'md' | 'lg';
  indeterminate?: boolean;
  className?:  string;
}

const progressColors: Record<string, string> = {
  default: 'bg-[var(--titan-brand)]',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error:   'bg-red-500',
};

export function Progress({
  value, label, showPercent = false, variant = 'default',
  size = 'md', indeterminate = false, className = '',
}: ProgressProps) {
  const h = size === 'sm' ? 'h-1' : size === 'lg' ? 'h-3' : 'h-2';
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center">
          {label    && <span className="text-[12px] text-[var(--titan-text)]">{label}</span>}
          {showPercent && <span className="text-[11px] tabular-nums text-[var(--titan-text-muted)]">{pct}%</span>}
        </div>
      )}
      <div className={`w-full ${h} rounded-full bg-[var(--titan-border)] overflow-hidden`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        {indeterminate ? (
          <div className={`h-full w-1/3 ${progressColors[variant]} rounded-full animate-[slide_1.5s_ease-in-out_infinite]`} />
        ) : (
          <div
            className={`h-full ${progressColors[variant]} rounded-full transition-all duration-300`}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Spinner
// ─────────────────────────────────────────────────────────────────────────────

export interface SpinnerProps {
  size?:    number;
  color?:   string;
  label?:   string;
}

export function Spinner({ size = 20, color = 'var(--titan-brand)', label = 'Loading…' }: SpinnerProps) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth={2.5}
      className="animate-spin" aria-label={label} role="status"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity={0.2} />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────────────────────────

export interface SkeletonProps {
  width?:     string | number;
  height?:    string | number;
  rounded?:   boolean;
  className?: string;
}

export function Skeleton({ width = '100%', height = 16, rounded = false, className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[var(--titan-border)] ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────────────────────

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id:       string;
  type:     ToastType;
  title?:   string;
  message:  string;
  duration?: number;
}

interface ToastContextValue {
  toasts:  Toast[];
  show:    (t: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
  info:    (message: string, title?: string) => string;
  success: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  error:   (message: string, title?: string) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback((t: Omit<Toast, 'id'>): string => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...t, id }]);
    const duration = t.duration ?? 4000;
    if (duration > 0) setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const info    = useCallback((message: string, title?: string) => show({ type: 'info',    message, title }), [show]);
  const success = useCallback((message: string, title?: string) => show({ type: 'success', message, title }), [show]);
  const warning = useCallback((message: string, title?: string) => show({ type: 'warning', message, title }), [show]);
  const error   = useCallback((message: string, title?: string) => show({ type: 'error',   message, title, duration: 0 }), [show]);

  return (
    <ToastContext.Provider value={{ toasts, show, dismiss, info, success, warning, error }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside <ToastProvider>');
  return ctx;
}

const toastStyles: Record<ToastType, { bg: string; icon: string }> = {
  info:    { bg: 'bg-[var(--titan-bg-raised)] border-blue-500',  icon: '🔵' },
  success: { bg: 'bg-[var(--titan-bg-raised)] border-green-500', icon: '✅' },
  warning: { bg: 'bg-[var(--titan-bg-raised)] border-amber-500', icon: '⚠️' },
  error:   { bg: 'bg-[var(--titan-bg-raised)] border-red-500',   icon: '❌' },
};

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[600] flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={[
            'pointer-events-auto flex items-start gap-2.5 p-3 rounded-lg border-l-4 shadow-lg',
            toastStyles[t.type].bg,
            'animate-in slide-in-from-right-4 duration-200',
          ].join(' ')}
          role="alert"
        >
          <span className="text-sm flex-shrink-0 mt-0.5">{toastStyles[t.type].icon}</span>
          <div className="flex-1 min-w-0">
            {t.title && <p className="text-[13px] font-semibold text-[var(--titan-text)]">{t.title}</p>}
            <p className="text-[12px] text-[var(--titan-text-muted)] leading-relaxed">{t.message}</p>
          </div>
          <button onClick={() => onDismiss(t.id)} className="flex-shrink-0 text-[var(--titan-text-muted)] hover:text-[var(--titan-text)] text-sm leading-none mt-0.5">✕</button>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StatusDot — for device/job status indicators
// ─────────────────────────────────────────────────────────────────────────────

export type StatusColor = 'green' | 'amber' | 'red' | 'gray' | 'blue';

export interface StatusDotProps {
  color?:     StatusColor;
  pulse?:     boolean;
  label?:     string;
  size?:      'sm' | 'md';
  className?: string;
}

const dotColorMap: Record<StatusColor, string> = {
  green: 'bg-green-500',
  amber: 'bg-amber-400',
  red:   'bg-red-500',
  gray:  'bg-gray-400',
  blue:  'bg-blue-500',
};

export function StatusDot({ color = 'gray', pulse = false, label, size = 'md', className = '' }: StatusDotProps) {
  const sz = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`${sz} rounded-full flex-shrink-0 ${dotColorMap[color]} ${pulse ? 'animate-pulse' : ''}`} />
      {label && <span className="text-[12px] text-[var(--titan-text-muted)]">{label}</span>}
    </span>
  );
}
