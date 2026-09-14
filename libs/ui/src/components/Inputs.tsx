import React, { forwardRef, useId } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TextInput
// ─────────────────────────────────────────────────────────────────────────────

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:       string;
  error?:       string;
  hint?:        string;
  icon?:        React.ReactNode;
  iconRight?:   React.ReactNode;
  inputSize?:   'sm' | 'md' | 'lg';
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({
  label, error, hint, icon, iconRight, inputSize = 'md', className = '', id: idProp, ...rest
}, ref) => {
  const autoId = useId();
  const id     = idProp ?? autoId;

  const sizeClass = inputSize === 'sm' ? 'h-7 text-[12px] px-2.5'
    : inputSize === 'lg' ? 'h-10 text-[14px] px-4'
    : 'h-8 text-[13px] px-3';

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-[12px] font-medium text-[var(--titan-text)]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-2.5 flex items-center text-[var(--titan-text-muted)] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={[
            'w-full rounded-md border bg-[var(--titan-bg)] text-[var(--titan-text)]',
            'placeholder:text-[var(--titan-text-subtle)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--titan-brand)] focus:border-transparent',
            'transition-colors duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-[var(--titan-error)]' : 'border-[var(--titan-border)]',
            sizeClass,
            icon      ? 'pl-8'  : '',
            iconRight ? 'pr-8'  : '',
            className,
          ].join(' ')}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...rest}
        />
        {iconRight && (
          <span className="absolute right-2.5 flex items-center text-[var(--titan-text-muted)] pointer-events-none">
            {iconRight}
          </span>
        )}
      </div>
      {error && <p id={`${id}-error`} className="text-[11px] text-[var(--titan-error)]">{error}</p>}
      {!error && hint && <p id={`${id}-hint`} className="text-[11px] text-[var(--titan-text-muted)]">{hint}</p>}
    </div>
  );
});
TextInput.displayName = 'TextInput';

// ─────────────────────────────────────────────────────────────────────────────
// Select
// ─────────────────────────────────────────────────────────────────────────────

export interface SelectOption { value: string; label: string; disabled?: boolean; }

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options:    SelectOption[];
  label?:     string;
  error?:     string;
  hint?:      string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options, label, error, hint, placeholder, className = '', id: idProp, ...rest
}, ref) => {
  const autoId = useId();
  const id     = idProp ?? autoId;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-[12px] font-medium text-[var(--titan-text)]">{label}</label>
      )}
      <select
        ref={ref}
        id={id}
        className={[
          'h-8 px-3 rounded-md border bg-[var(--titan-bg)] text-[13px] text-[var(--titan-text)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--titan-brand)] focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer',
          error ? 'border-[var(--titan-error)]' : 'border-[var(--titan-border)]',
          className,
        ].join(' ')}
        {...rest}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[11px] text-[var(--titan-error)]">{error}</p>}
      {!error && hint && <p className="text-[11px] text-[var(--titan-text-muted)]">{hint}</p>}
    </div>
  );
});
Select.displayName = 'Select';

// ─────────────────────────────────────────────────────────────────────────────
// Checkbox
// ─────────────────────────────────────────────────────────────────────────────

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label:       string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label, description, className = '', id: idProp, ...rest
}, ref) => {
  const autoId = useId();
  const id     = idProp ?? autoId;

  return (
    <label htmlFor={id} className={`flex items-start gap-2.5 cursor-pointer group ${className}`}>
      <input
        ref={ref} id={id} type="checkbox"
        className={[
          'mt-0.5 w-4 h-4 rounded border border-[var(--titan-border)] bg-[var(--titan-bg)]',
          'checked:bg-[var(--titan-brand)] checked:border-[var(--titan-brand)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--titan-brand)] focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
          'transition-colors duration-150',
        ].join(' ')}
        {...rest}
      />
      <div className="flex flex-col">
        <span className="text-[13px] text-[var(--titan-text)] leading-tight">{label}</span>
        {description && <span className="text-[11px] text-[var(--titan-text-muted)] mt-0.5">{description}</span>}
      </div>
    </label>
  );
});
Checkbox.displayName = 'Checkbox';

// ─────────────────────────────────────────────────────────────────────────────
// Toggle (switch)
// ─────────────────────────────────────────────────────────────────────────────

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label:        string;
  description?: string;
  size?:        'sm' | 'md';
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(({
  label, description, size = 'md', className = '', id: idProp, ...rest
}, ref) => {
  const autoId = useId();
  const id     = idProp ?? autoId;
  const trackClass = size === 'sm' ? 'w-7 h-4' : 'w-9 h-5';
  const thumbClass = size === 'sm' ? 'w-3 h-3 top-0.5 left-0.5 peer-checked:translate-x-3' : 'w-4 h-4 top-0.5 left-0.5 peer-checked:translate-x-4';

  return (
    <label htmlFor={id} className={`flex items-center gap-2.5 cursor-pointer ${className}`}>
      <div className="relative flex-shrink-0">
        <input
          ref={ref} id={id} type="checkbox" className="sr-only peer"
          {...rest}
        />
        <div className={[
          trackClass,
          'rounded-full bg-[var(--titan-border-strong)]',
          'peer-checked:bg-[var(--titan-brand)]',
          'peer-disabled:opacity-50',
          'transition-colors duration-200',
        ].join(' ')} />
        <div className={[
          thumbClass,
          'absolute rounded-full bg-white shadow',
          'transition-transform duration-200',
        ].join(' ')} />
      </div>
      <div className="flex flex-col">
        <span className="text-[13px] text-[var(--titan-text)] leading-tight">{label}</span>
        {description && <span className="text-[11px] text-[var(--titan-text-muted)] mt-0.5">{description}</span>}
      </div>
    </label>
  );
});
Toggle.displayName = 'Toggle';

// ─────────────────────────────────────────────────────────────────────────────
// Slider
// ─────────────────────────────────────────────────────────────────────────────

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?:      string;
  showValue?:  boolean;
  valueFormatter?: (v: number) => string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(({
  label, showValue = true, valueFormatter, value, className = '', ...rest
}, ref) => {
  const display = value !== undefined
    ? (valueFormatter ? valueFormatter(Number(value)) : String(value))
    : '';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-[12px] font-medium text-[var(--titan-text)]">{label}</span>}
          {showValue && <span className="text-[12px] tabular-nums text-[var(--titan-text-muted)]">{display}</span>}
        </div>
      )}
      <input
        ref={ref} type="range" value={value}
        className={[
          'w-full h-1.5 rounded-full appearance-none cursor-pointer',
          'bg-[var(--titan-border)] accent-[var(--titan-brand)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        ].join(' ')}
        {...rest}
      />
    </div>
  );
});
Slider.displayName = 'Slider';
