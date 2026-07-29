import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  /** Omit onClick (or pass none) for the current/last page. */
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Usage: <Breadcrumbs items={[{ label: 'Home', onClick: () => setActiveTab('home') }, { label: 'All Tutorials' }]} />
 * The last item is always rendered as the current page (non-interactive).
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={['flex items-center flex-wrap gap-1.5 text-xs font-mono text-slate-500', className].join(' ')}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />}
            {isLast || !item.onClick ? (
              <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-slate-300' : ''}>
                {item.label}
              </span>
            ) : (
              <button onClick={item.onClick} className="hover:text-brand-bright transition-colors">
                {item.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
};
