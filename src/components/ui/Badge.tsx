import React from 'react';

export type BadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-800 text-slate-300 border border-slate-700',
  brand: 'bg-blue-950 text-blue-300 border border-blue-800',
  success: 'bg-emerald-950 text-emerald-300 border border-emerald-800',
  warning: 'bg-amber-950 text-amber-300 border border-amber-800',
  danger: 'bg-rose-950 text-rose-300 border border-rose-800',
  outline: 'bg-transparent text-slate-300 border border-slate-600',
};

/**
 * Small uppercase mono pill used for tags, status, and product/category labels.
 */
export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', className = '', children, ...rest }) => (
  <span
    className={[
      'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider',
      VARIANT_CLASSES[variant],
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {children}
  </span>
);
