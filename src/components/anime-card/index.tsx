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
    <div className="bg-transparent flex w-full h-60 justify-between overflow-hidden">
      {/*封面*/}
      <div className="w-36 h-full flex-shrink-0 overflow-hidden bg-neutral-200/50">
        <img src={animeInfo.coverImage} alt={animeInfo.name_cn} className="w-full h-full object-cover" />
      </div>
      {/*主体*/}
      <div className="flex-1 max-w-xl py-1 mx-8 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-2xl font-editorial-serif text-editorial-foreground">{animeInfo.name_cn}</h3>
          <h4 className="font-light text-xs text-editorial-muted/70 mt-1">{animeInfo.name_origin}</h4>
        </div>
        <div className="text-sm leading-relaxed overflow-hidden line-clamp-3 text-editorial-muted font-editorial-sans">
          {normalizedSummary}
        </div>
        <div className="text-xs font-light text-editorial-accent/80">
          {animeInfo.tags.map((tag) => (
            <span key={tag}>{tag} / </span>
          ))}
        </div>
      </div>
      {/*杂项面板*/}
      <div className="w-72 bg-editorial-panel flex flex-col border-l border-editorial-rail/30 p-4 gap-4 ">
        <div>
          <span className="text-editorial-muted text-xs">个人主观评分：</span>
          <span className="text-lg font-clash-display text-editorial-accent">
            {animeInfo.rate ?? '--'}
          </span>
        </div>
        <Marker subjectType={animeInfo.type} />
        <div className="w-full text-editorial-muted text-sm">
          推出时间：{formatReleaseDate(animeInfo.release_date)}
        </div>

      </div>
    </div>
  );
};

export default AnimeCard;
