export enum BangumiSubjectType {
  BOOK = 1,
  ANIME = 2,
  MUSIC = 3,
  GAME = 4,
  REAL = 6,
}
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
  type?: BangumiSubjectType;
  /** 用户自己的评分，后端以字符串形式返回。 */
  rate?: string | number | null;
  /** Bangumi 条目评分，不用于“个人主观评分”。 */
  score?: string | number | null;
  release_date?: string | null;
  collection?: {
    comment: string;
    score: number;
  } | null;
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
  type?: BangumiSubjectType,
  rate?: string | number | null,
  release_date?: string | null,
  tags: string[],
}
