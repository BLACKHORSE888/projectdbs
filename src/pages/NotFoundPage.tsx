import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

export const NotFoundPage: React.FC = () => {
  usePageMeta({ title: '404 — Page Not Found' });

  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-extrabold text-saffron-500 mb-3 tabular-nums">404</p>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mb-2">
        Oops, this crunch doesn’t exist
      </h1>
      <p className="text-sm text-charcoal-600 max-w-md mb-6">
        The page you’re looking for may have moved. Head back to our freshly baked millet snacks.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-sm transition"
      >
        Back to Milletly Home
      </Link>
    </div>
  );
};
