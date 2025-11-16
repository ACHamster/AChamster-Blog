import React from 'react';

export const AnimeCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface h-52 w-2/3 grid grid-cols-4 rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="col-span-1 w-11/12 rounded-lg bg-gray-300 m-2" />
      <div className="col-span-3 px-4 pt-4 pb-2 flex flex-col gap-2">
        <div className="h-6 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded" />
          <div className="h-6 w-16 bg-gray-200 rounded" />
          <div className="h-6 w-16 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
        </div>
      </div>
    </div>
  );
};

