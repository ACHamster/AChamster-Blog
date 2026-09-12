import React from 'react';
import { BangumiSubjectType } from '@/types/anime.ts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx';

interface UnitProps {
  letter: string;
  label: string;
  isActive?: boolean;
}

const Unit: React.FC<UnitProps> = ({ letter, label, isActive = false }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`w-7 h-7 flex items-center justify-center font-clash-display text-xs border-r last:border-r-0 border-editorial-mark-border transition-colors cursor-default select-none ${
            isActive
              ? 'bg-editorial-accent text-white font-medium'
              : 'bg-editorial-mark-background text-editorial-muted hover:bg-stone-200/50'
          }`}
        >
          {letter}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-[11px] font-editorial-sans tracking-wide py-1 px-2.5 shadow-sm">
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

const SUBJECT_TYPE_MARKERS = [
  {
    letter: 'A',
    label: 'Animation / 动画',
    type: BangumiSubjectType.ANIME,
  },
  {
    letter: 'C',
    label: 'Comic / 漫画',
    type: BangumiSubjectType.COMIC,
  },
  {
    letter: 'G',
    label: 'Game / 游戏',
    type: BangumiSubjectType.GAME,
  },
  {
    letter: 'N',
    label: 'Novel / 轻小说',
    type: BangumiSubjectType.NOVEL,
  },
];

interface MarkerProps {
  subjectType?: BangumiSubjectType;
}

const Marker: React.FC<MarkerProps> = ({ subjectType }) => {
  const isUnitActive = (markerType: BangumiSubjectType) => {
    if (subjectType === undefined) return false;
    if (subjectType === markerType) return true;
    // 兼容历史未清洗的 BOOK(1) 条目归入轻小说
    if (markerType === BangumiSubjectType.NOVEL && subjectType === BangumiSubjectType.BOOK) {
      return true;
    }
    return false;
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex border border-editorial-mark-border rounded-xs overflow-hidden w-fit">
        {SUBJECT_TYPE_MARKERS.map(({ letter, label, type }) => (
          <Unit
            key={letter}
            letter={letter}
            label={label}
            isActive={isUnitActive(type)}
          />
        ))}
      </div>
    </TooltipProvider>
  );
};

export default Marker;

