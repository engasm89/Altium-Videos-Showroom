import React from 'react';
import { Search } from 'lucide-react';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  size?: 'md' | 'lg';
  autoFocus?: boolean;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  submitLabel?: string;
  className?: string;
  inputClassName?: string;
}

/**
 * Large, homepage-ready search primitive. Controlled component: the caller owns
 * `value`/`onChange` (and typically routes `onSubmit`/suggestion clicks into the
 * catalog view's own filter state).
 *
 * Usage:
 *   <SearchInput
 *     size="lg"
 *     value={query}
 *     onChange={setQuery}
 *     onSubmit={() => setActiveTab('catalog')}
 *     suggestions={['DRC', 'ESP32', 'ActiveBOM']}
 *     onSuggestionClick={(s) => { setQuery(s); setActiveTab('catalog'); }}
 *   />
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search the library...',
  size = 'lg',
  autoFocus,
  suggestions,
  onSuggestionClick,
  submitLabel = 'Search',
  className = '',
  inputClassName = '',
}) => {
  const isLg = size === 'lg';

  return (
    <div className={className}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(value);
        }}
        className="relative flex items-center"
        role="search"
      >
        <Search
          className={[isLg ? 'w-5 h-5 left-4' : 'w-4 h-4 left-3.5', 'absolute text-slate-400 pointer-events-none']
            .filter(Boolean)
            .join(' ')}
        />
        <input
          type="search"
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className={[
            'w-full bg-slate-900 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500',
            'focus:outline-none focus:border-brand transition-colors shadow-inner',
            isLg ? 'pl-12 pr-32 py-3.5 text-base' : 'pl-9 pr-4 py-2 text-sm',
            inputClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        />
        {onSubmit && (
          <button
            type="submit"
            className={[
              'absolute bg-brand hover:bg-brand-strong text-white rounded-lg font-semibold tracking-wide transition-colors',
              isLg ? 'right-2 px-4 py-2 text-xs' : 'right-1.5 px-2.5 py-1 text-[11px]',
            ].join(' ')}
          >
            {submitLabel}
          </button>
        )}
      </form>

      {suggestions && suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-500">
          <span>Popular:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSuggestionClick?.(s)}
              className="hover:text-brand-bright underline underline-offset-2 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
