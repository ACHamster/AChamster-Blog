import React from 'react';

interface ArticleSkeletonProps {
  isFirst?: boolean;
}

const ArticleSkeleton: React.FC<ArticleSkeletonProps> = ({ isFirst = false }) => {
  return (
    <div className="w-full select-none animate-pulse">
      <div
        className={`flex flex-col-reverse md:flex-row md:items-stretch justify-between gap-6 pb-6 ${
          isFirst ? 'pt-0' : 'pt-6'
        }`}
      >
        {/* 左侧文字占位 */}
        <div className="flex-1 flex flex-col justify-between min-w-0 pr-0 md:pr-4">
          <div>
            <div className="h-3 w-20 bg-stone-200/70 rounded-xs mb-2" />
            <div className="h-7 w-3/4 bg-stone-200/90 rounded-xs mb-2.5" />
            <div className="space-y-1.5 mt-2">
              <div className="h-3.5 w-full bg-stone-200/50 rounded-xs" />
              <div className="h-3.5 w-4/5 bg-stone-200/50 rounded-xs" />
            </div>
          </div>

          <div className="mt-4 pt-2 flex items-center justify-between gap-4">
            <div className="h-3.5 w-32 bg-stone-200/60 rounded-xs" />
            <div className="h-3.5 w-16 bg-stone-200/60 rounded-xs" />
          </div>
        </div>

        {/* 右侧封面占位 */}
        <div className="w-full md:w-60 lg:w-72 h-34 md:h-36 lg:h-40 shrink-0 bg-stone-200/70 border border-editorial-divider/70" />
      </div>

      <div className="w-full h-px bg-editorial-divider" />
    </div>
  );
};

export default ArticleSkeleton;
