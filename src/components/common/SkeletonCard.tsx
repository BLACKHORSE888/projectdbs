import React from 'react';

export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-3xl p-4 shadow-soft border border-millet-200/70 animate-pulse">
    <div className="w-full aspect-[4/3] bg-millet-200 rounded-2xl mb-4" />
    <div className="h-3.5 w-32 bg-millet-200 rounded mb-2.5" />
    <div className="h-6 w-3/4 bg-millet-200 rounded-lg mb-2" />
    <div className="h-4 w-full bg-millet-100 rounded-lg mb-4" />
    <div className="flex items-center justify-between pt-3 border-t border-millet-100">
      <div className="h-7 w-20 bg-millet-200 rounded-lg" />
      <div className="h-10 w-28 bg-millet-200 rounded-xl" />
    </div>
  </div>
);
