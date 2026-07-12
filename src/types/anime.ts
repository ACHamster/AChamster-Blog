export interface BangumiImageSet {
  large?: string;
  common?: string;
  medium?: string;
  small?: string;
  grid?: string;
}

export interface BangumiTag {
  name: string;
  count?: number;
  total_count?: number;
}

export interface BangumiSubject {
  subject_id: number;
  name: string;
  name_cn?: string;
  short_summary?: string;
  images?: BangumiImageSet;
  tags?: BangumiTag[];
  collection?: {
    comment: string;
    score: number;
  };
}

export interface BangumiApiResponse {
  subjects: BangumiSubject[];
  total: number;
  totalPages: number;
  page: number;
  hasMore: boolean;
}

export interface AnimeCardProps {
  subject_id: number,
  name_origin: string,
  name_cn: string,
  coverImage: string,
  short_summary: string,
  tags: string[],
}
