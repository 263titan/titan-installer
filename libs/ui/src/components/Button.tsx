import React, { forwardRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  loading?:  boolean;
  icon?:     React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   'bg-[var(--titan-brand)] text-white hover:opacity-90 active:opacity-80 border-transparent',
  secondary: 'bg-[var(--titan-bg-raised)] text-[var(--titan-text)] border-[var(--titan-border)] hover:bg-[var(--titan-bg-overlay)]',
  ghost:     'bg-transparent text-[var(--titan-text)] border-transparent hover:bg-[var(--titan-bg-raised)]',
  danger:    'bg-[var(--titan-error)] text-white hover:opacity-90 active:opacity-80 border-transparent',
  success:   'bg-[var(--titan-success)] text-white hover:opacity-90 active:opacity-80 border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs:  'h-6  px-2   text-[11px] gap-1   rounded',
  sm:  'h-7  px-2.5 text-[12px] gap-1.5 rounded',
  md:  'h-8  px-3   text-[13px] gap-2   rounded-md',
  lg:  'h-10 px-4   text-[14px] gap-2   rounded-md',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant   = 'secondary',
  size      = 'md',
  loading   = false,
  icon,
  iconRight,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...rest
}, ref) => {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-medium border',
        'transition-all duration-150 select-none cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-[var(--titan-brand)] focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {loading ? (
        <Spinner size={size === 'lg' ? 16 : 12} />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children && <span>{children}</span>}
      {!loading && iconRight && <span className="shrink-0 ml-auto">{iconRight}</span>}
    </button>
  );
});
Button.displayName = 'Button';

// ── IconButton (square button for toolbar actions) ────────────────────────────
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?:    ButtonSize;
  variant?: ButtonVariant;
  label:    string;   // aria-label
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  size = 'md', variant = 'ghost', label, children, className = '', ...rest
}, ref) => (
  <button
    ref={ref}
    aria-label={label}
    title={label}
    className={[
      'inline-flex items-center justify-center border rounded',
      'transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--titan-brand)]',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantStyles[variant],
      size === 'xs' ? 'w-6 h-6'
        : size === 'sm' ? 'w-7 h-7'
        : size === 'lg' ? 'w-10 h-10'
        : 'w-8 h-8',
      className,
    ].join(' ')}
    {...rest}
  >
    {children}
  </button>
));
IconButton.displayName = 'IconButton';

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      className="animate-spin"
      fill="none" stroke="currentColor" strokeWidth={2.5}
    >
      <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}
