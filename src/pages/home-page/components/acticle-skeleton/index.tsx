import React from 'react';

interface ArticleSkeletonProps {
  isFirst?: boolean;
}

const ArticleSkeleton: React.FC<ArticleSkeletonProps> = ({ isFirst = false }) => {
  return (
    <div className="w-full select-none animate-pulse">
      <div
        className={`flex flex-col-reverse md:flex-row md:items-stretch justify-between gap-6 lg:gap-8 pb-5 2xl:pb-6 ${
          isFirst ? 'pt-0' : 'pt-5 2xl:pt-6'
        }`}
      >
        {/* 左侧文字占位 */}
        <div className="flex-1 max-w-[clamp(300px,38vw,560px)] flex flex-col justify-between min-w-0 pr-0 md:pr-4">
          <div>
            <div className="h-3 w-20 bg-stone-200/70 rounded-xs mb-1.5" />
            <div className="h-6 2xl:h-7 w-3/4 bg-stone-200/90 rounded-xs mb-2" />
            <div className="space-y-1.5 mt-2">
              <div className="h-3 w-full bg-stone-200/50 rounded-xs" />
              <div className="h-3 w-4/5 bg-stone-200/50 rounded-xs" />
            </div>
            <div className="h-3 w-16 bg-stone-200/60 rounded-xs mt-2.5" />
          </div>

          <div className="mt-3 pt-1 flex items-center gap-4">
            <div className="h-3 w-32 bg-stone-200/60 rounded-xs" />
          </div>
        </div>

        {/* 右侧封面占位 */}
        <div className="w-full md:w-[48%] lg:w-[50%] 2xl:w-[52%] max-w-[850px] min-w-[260px] aspect-[21/9] md:aspect-[2.35/1] max-h-[220px] 2xl:max-h-[240px] shrink-0 bg-stone-200/70 border border-editorial-divider/70" />
      </div>

      <div className="w-full h-px bg-editorial-divider" />
    </div>
  );
};

export default ArticleSkeleton;
