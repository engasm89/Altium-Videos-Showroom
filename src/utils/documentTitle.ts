import { useEffect } from 'react';

const BASE = 'EET Electronics Product Development Library';

/** Update document.title for the active route. */
export function useDocumentTitle(title?: string | null): void {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} · ${BASE}` : BASE;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
