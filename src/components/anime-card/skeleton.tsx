import React from 'react';

export const AnimeCardSkeleton: React.FC = () => {
  return (
    <div className="flex h-60 w-full justify-between overflow-hidden animate-pulse">
      <div className="h-full w-36 shrink-0 bg-editorial-rail/20" />
      <div className="mx-8 flex max-w-xl flex-1 flex-col justify-between py-1">
        <div>
          <div className="h-7 w-2/5 bg-editorial-rail/20" />
          <div className="mt-2 h-3 w-1/4 bg-editorial-rail/15" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-editorial-rail/15" />
          <div className="h-3 w-5/6 bg-editorial-rail/15" />
          <div className="h-3 w-3/5 bg-editorial-rail/15" />
        </div>
        <div className="flex gap-2">
          <div className="h-3 w-10 bg-editorial-accent/20" />
          <div className="h-3 w-12 bg-editorial-accent/20" />
          <div className="h-3 w-8 bg-editorial-accent/20" />
        </div>
      </div>
      <div className="flex w-72 flex-col gap-4 border-l border-editorial-rail/30 bg-editorial-panel p-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-20 bg-editorial-rail/20" />
          <div className="h-5 w-5 bg-editorial-accent/30" />
        </div>
        <div className="flex h-8 w-30">
          <div className="w-8 bg-editorial-accent/30" />
          <div className="w-8 border-r border-editorial-rail/20 bg-editorial-mark-background/70" />
          <div className="w-8 border-r border-editorial-rail/20 bg-editorial-mark-background/70" />
          <div className="w-8 border-r border-editorial-rail/20 bg-editorial-mark-background/70" />
        </div>
        <div className="h-4 w-28 bg-editorial-rail/20" />
      </div>
    </div>
  );
};
