import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Cards are reserved for interactive containers (clickable tutorial/path/project
   * tiles, etc). Set `interactive={false}` for the rare non-clickable case, e.g. a
   * static panel that still benefits from the card surface treatment.
   */
  interactive?: boolean;
}

/**
 * Shared surface for interactive containers. Do not use Card for plain layout
 * boxes — prefer a plain <div> with utility classes for non-interactive content.
 */
export const Card: React.FC<CardProps> = ({ interactive = true, className = '', children, ...rest }) => (
  <div
    className={[
      'bg-slate-900 border border-slate-800 rounded-2xl transition-all duration-200',
      interactive ? 'cursor-pointer hover:border-brand/60 hover:shadow-xl hover:shadow-black/20' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {children}
  </div>
);
