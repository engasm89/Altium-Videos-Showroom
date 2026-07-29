import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

type ButtonAsButtonProps = ButtonOwnProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsAnchorProps = ButtonOwnProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3.5 text-base rounded-xl gap-2.5',
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand hover:bg-brand-strong text-white shadow-lg shadow-black/30',
  secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700',
  outline: 'bg-transparent border border-slate-700 text-slate-200 hover:border-brand hover:text-white',
  ghost: 'bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white',
};

/**
 * Shared button primitive. Renders an <a> when `href` is provided, otherwise a <button>.
 *
 * Usage: <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>Start</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, iconPosition = 'left', fullWidth, className = '', children, href, ...rest }, ref) => {
    const classes = [
      'inline-flex items-center justify-center font-medium transition-colors duration-150',
      'disabled:opacity-50 disabled:pointer-events-none',
      SIZE_CLASSES[size],
      VARIANT_CLASSES[variant],
      fullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const content = (
      <>
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
