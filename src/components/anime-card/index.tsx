import Marker from '@/components/anime-card/marker.tsx';
import React from 'react';
import { AnimeCardProps } from "@/types/anime.ts";

type props = {
  animeInfo: AnimeCardProps;
};

const formatReleaseDate = (releaseDate?: string | null) => {
  if (!releaseDate) return '--';

  const [year, month] = releaseDate.split('T')[0].split('-');
  if (!year || !month) return releaseDate;

  return `${year}.${Number(month)}`;
};

const AnimeCard: React.FC<props> = ({ animeInfo }) => {
  const normalizedSummary = animeInfo.short_summary
    ? animeInfo.short_summary.replace(/\r\n|\r|\n/g, '\n')
    : '';

  return (
    <div className="group bg-transparent flex w-full h-44 md:h-60 justify-between overflow-hidden">
      {/* 封面 */}
      <div className="w-28 sm:w-32 lg:w-36 2xl:w-40 h-full shrink-0 overflow-hidden bg-stone-200/60 border border-editorial-divider/70 relative">
        <img
          src={animeInfo.coverImage}
          alt={animeInfo.name_cn}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* 主体文字区：移动端自包含评分与日期，桌面端紧凑适应双栏 */}
      <div className="flex-1 min-w-0 pb-0.5 md:pb-1 mx-3 md:mx-3.5 lg:mx-4 2xl:mx-5 flex flex-col justify-between">
        <div>
          {/* 标题栏：移动端右上角展示评分 */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm sm:text-base lg:text-lg 2xl:text-xl font-editorial-serif text-editorial-foreground tracking-tight line-clamp-1 flex-1">
              {animeInfo.name_cn}
            </h3>
            {/* 移动端专属评分 */}
            <div className="md:hidden flex items-baseline gap-1 shrink-0">
              <span className="text-base font-clash-display font-medium text-editorial-accent">
                {animeInfo.rate ?? '--'}
              </span>
            </div>
          </div>

          <h4 className="font-light text-[10px] sm:text-[11px] lg:text-xs text-editorial-muted/80 mt-0.5 md:mt-1 line-clamp-1 tracking-wide font-editorial-sans">
            {animeInfo.name_origin}
          </h4>
        </div>

        {/* 简介摘要 */}
        <div className="text-[11px] sm:text-xs lg:text-[13px] leading-relaxed overflow-hidden line-clamp-2 md:line-clamp-3 text-editorial-body font-editorial-sans font-light">
          {normalizedSummary}
        </div>

        {/* 底部信息栏：移动端融合标签与首播时间 */}
        <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px] lg:text-xs font-light text-editorial-sans">
          <div className="text-editorial-accent/80 tracking-wide truncate flex-1">
            {animeInfo.tags.map((tag) => (
              <span key={tag}>{tag} / </span>
            ))}
          </div>
          <div className="md:hidden text-editorial-muted font-clash-display shrink-0">
            {formatReleaseDate(animeInfo.release_date)}
          </div>
        </div>
      </div>

      {/* 侧边信息/杂项面板：桌面端独立展示，移动端隐藏 */}
      <div className="hidden md:flex w-36 lg:w-40 2xl:w-44 bg-editorial-panel flex-col justify-between border-l border-editorial-divider p-3 lg:p-3.5 shrink-0">
        <div className="flex items-baseline justify-between">
          <span className="text-editorial-muted text-[11px] lg:text-xs font-editorial-sans">个人评分</span>
          <span className="text-lg lg:text-xl font-clash-display font-medium text-editorial-accent">
            {animeInfo.rate ?? '--'}
          </span>
        </div>

        <div>
          <div className="text-[10px] lg:text-[11px] text-editorial-muted uppercase tracking-wider mb-1 font-clash-display">
            Subject Type
          </div>
          <Marker subjectType={animeInfo.type} />
        </div>

        <div className="w-full text-editorial-muted text-[11px] lg:text-xs flex items-center justify-between font-editorial-sans border-t border-editorial-divider/60 pt-2">
          <span>首播 / 发行</span>
          <span className="font-clash-display font-normal text-editorial-foreground">
            {formatReleaseDate(animeInfo.release_date)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
