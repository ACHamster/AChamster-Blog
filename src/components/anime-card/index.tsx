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
    <div className="group bg-transparent flex w-full h-60 justify-between overflow-hidden">
      {/* 封面 */}
      <div className="w-40 h-full flex-shrink-0 overflow-hidden bg-stone-200/60 border border-editorial-divider/70 relative">
        <img
          src={animeInfo.coverImage}
          alt={animeInfo.name_cn}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* 主体文字区 */}
      <div className="flex-1 max-w-xl pb-1 mx-6 lg:mx-8 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-xl lg:text-2xl font-editorial-serif text-editorial-foreground tracking-tight line-clamp-1">
            {animeInfo.name_cn}
          </h3>
          <h4 className="font-light text-xs text-editorial-muted/80 mt-1 line-clamp-1 tracking-wide font-editorial-sans">
            {animeInfo.name_origin}
          </h4>
        </div>

        <div className="text-xs lg:text-[13px] leading-relaxed overflow-hidden line-clamp-3 text-editorial-body font-editorial-sans font-light">
          {normalizedSummary}
        </div>

        <div className="text-xs font-light text-editorial-accent/80 font-editorial-sans tracking-wide">
          {animeInfo.tags.map((tag) => (
            <span key={tag}>{tag} / </span>
          ))}
        </div>
      </div>

      {/* 侧边信息/杂项面板 */}
      <div className="w-64 bg-editorial-panel flex flex-col justify-between border-l border-editorial-divider p-4 shrink-0">
        <div className="flex items-baseline justify-between">
          <span className="text-editorial-muted text-xs font-editorial-sans">个人评分</span>
          <span className="text-xl font-clash-display font-medium text-editorial-accent">
            {animeInfo.rate ?? '--'}
          </span>
        </div>

        <div>
          <div className="text-[11px] text-editorial-muted uppercase tracking-wider mb-1.5 font-clash-display">
            Subject Type
          </div>
          <Marker subjectType={animeInfo.type} />
        </div>

        <div className="w-full text-editorial-muted text-xs flex items-center justify-between font-editorial-sans border-t border-editorial-divider/60 pt-2.5">
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
