import React from 'react';

export const AnimeCardSkeleton: React.FC = () => {
  return (
    <div className="flex h-60 w-full justify-between overflow-hidden animate-pulse">
      {/* 封面骨架 */}
      <div className="h-full w-36 shrink-0 bg-stone-200/60 border border-editorial-divider/70" />

      {/* 主体文字区骨架 */}
      <div className="mx-6 lg:mx-8 flex max-w-xl flex-1 flex-col justify-between py-1">
        <div>
          <div className="h-6 w-2/5 bg-stone-200/80 rounded-xs" />
          <div className="mt-2 h-3 w-1/4 bg-stone-200/50 rounded-xs" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-stone-200/40 rounded-xs" />
          <div className="h-3 w-5/6 bg-stone-200/40 rounded-xs" />
          <div className="h-3 w-3/5 bg-stone-200/40 rounded-xs" />
        </div>
        <div className="flex gap-2">
          <div className="h-3 w-10 bg-editorial-accent/20 rounded-xs" />
          <div className="h-3 w-12 bg-editorial-accent/20 rounded-xs" />
          <div className="h-3 w-8 bg-editorial-accent/20 rounded-xs" />
        </div>
      </div>

      {/* 侧边信息面板骨架 */}
      <div className="flex w-64 flex-col justify-between border-l border-editorial-divider bg-editorial-panel p-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 bg-stone-200/50 rounded-xs" />
          <div className="h-6 w-8 bg-editorial-accent/20 rounded-xs" />
        </div>

        <div>
          <div className="h-2.5 w-16 bg-stone-200/40 mb-2 rounded-xs" />
          <div className="flex h-7 w-28 border border-editorial-mark-border rounded-xs overflow-hidden">
            <div className="w-7 bg-editorial-accent/20" />
            <div className="w-7 border-r border-editorial-mark-border bg-stone-200/40" />
            <div className="w-7 border-r border-editorial-mark-border bg-stone-200/40" />
            <div className="w-7 bg-stone-200/40" />
          </div>
        </div>

        <div className="flex justify-between border-t border-editorial-divider/60 pt-2.5">
          <div className="h-3 w-14 bg-stone-200/50 rounded-xs" />
          <div className="h-3 w-16 bg-stone-200/60 rounded-xs" />
        </div>
      </div>
    </div>
  );
};
