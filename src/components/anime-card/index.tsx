import React from 'react';
import { AnimeCardProps } from "@/types/anime.ts";
import { Badge } from "@/components/ui/badge";

type props = {
  animeInfo: AnimeCardProps;
  style: React.CSSProperties;
};

const AnimeCard: React.FC<props> = ({ animeInfo, style }) => {
  const normalizedSummary = animeInfo.short_summary
    ? animeInfo.short_summary.replace(/\r\n|\r|\n/g, '\n')
    : '';

  return (
    <div
      className="bg-surface h-52 grid grid-cols-4 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      style={style}
    >
      <div className="col-span-1 w-11/12 rounded-lg">
        <img src={animeInfo.coverImage} alt={animeInfo.name_cn} className="object-cover w-full h-full py-2 mx-2 rounded-lg" />
      </div>
      <div className="col-span-3 px-4 pt-4 pb-2 flex flex-col gap-2 overflow-hidden">
        <div>
          <h3 className="text-title text-xl font-semibold">{animeInfo.name_cn ? animeInfo.name_cn : animeInfo.name_origin}</h3>
          <h4 className="text-muted text-sm">{animeInfo.name_origin}</h4>
        </div>
        {animeInfo.tags && animeInfo.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {animeInfo.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="text-sm text-body whitespace-pre-line line-clamp-4 max-h-64 overflow-hidden">
          {normalizedSummary}
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
