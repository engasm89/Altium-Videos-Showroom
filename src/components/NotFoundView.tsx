import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../utils/documentTitle';

/** Explicit 404 — unknown paths must not silently redirect home. */
export const NotFoundView: React.FC = () => {
  useDocumentTitle('Page not found');

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4 text-slate-100">
      <p className="text-xs font-mono uppercase tracking-wider text-amber-400">404</p>
      <h1 className="text-2xl font-extrabold text-white">Page not found</h1>
      <p className="text-sm text-slate-400">
        That URL is not part of the EET Electronics Product Development Library. Check the link, or
        browse the catalog from home.
      </p>
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <Link
          to="/"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500"
        >
          Home
        </Link>
        <Link
          to="/tutorials"
          className="px-4 py-2 rounded-lg border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-900"
        >
          All tutorials
        </Link>
      </div>
    </div>
  );
};
