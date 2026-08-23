import React from 'react';
import { BangumiSubjectType } from '@/types/anime.ts';

interface UnitProps {
  letter: string;
  isActive?: boolean;
}

const Unit: React.FC<UnitProps> = ({ letter, isActive = false }) => {
  return (
    <div
      className={`w-7 h-7 flex items-center justify-center font-clash-display text-xs border-r last:border-r-0 border-editorial-mark-border transition-colors ${
        isActive
          ? 'bg-editorial-accent text-white font-medium'
          : 'bg-editorial-mark-background text-editorial-muted hover:bg-stone-200/50'
      }`}
    >
      {letter}
    </div>
  );
};

const SUBJECT_TYPE_MARKERS = [
  { letter: 'A', type: BangumiSubjectType.ANIME },
  { letter: 'C', type: undefined },
  { letter: 'G', type: BangumiSubjectType.GAME },
  // Bangumi 的 type=1 同时覆盖漫画和轻小说；在 BFF 区分前，统一显示为轻小说。
  { letter: 'N', type: BangumiSubjectType.BOOK },
];

interface MarkerProps {
  subjectType?: BangumiSubjectType;
}

const Marker: React.FC<MarkerProps> = ({ subjectType }) => {
  return (
    <div className="flex border border-editorial-mark-border rounded-xs overflow-hidden w-fit">
      {SUBJECT_TYPE_MARKERS.map(({ letter, type }) => (
        <Unit
          key={letter}
          letter={letter}
          isActive={type !== undefined && subjectType === type}
        />
      ))}
    </div>
  );
};

export default Marker;
