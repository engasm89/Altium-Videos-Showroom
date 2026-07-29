import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

/**
 * Shared text input primitive with optional label, leading icon, hint and error text.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, icon, className = '', containerClassName = '', id, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full bg-slate-950 border rounded-lg text-sm text-slate-100 placeholder-slate-500',
              'px-3.5 py-2.5 transition-colors focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20',
              icon ? 'pl-10' : '',
              error ? 'border-rose-600' : 'border-slate-700',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            aria-invalid={Boolean(error) || undefined}
            {...rest}
          />
        </div>
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
