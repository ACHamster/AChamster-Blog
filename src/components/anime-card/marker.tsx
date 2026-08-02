import React from 'react';
import { BangumiSubjectType } from '@/types/anime.ts';

interface UnitProps {
  letter: string;
  isActive?: boolean;
}

const Unit: React.FC<UnitProps> = ({letter, isActive = false}) => {
  return (
    <div className={`
    w-8 h-full flex items-center justify-center font-clash-display border-r-1
    ${
      isActive
        ? 'bg-editorial-accent text-white font-medium'
        : 'bg-editorial-mark-background text-editorial-foreground hover:bg-slate-200'
    }
  `}>
      {letter}
    </div>
  );
}

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
    <div className="grid grid-cols-4 grid-row-1 bg-editorial-background w-30 h-8">
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
