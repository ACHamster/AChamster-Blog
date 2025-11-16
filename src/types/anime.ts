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
  id: number;
  name: string;
  name_cn?: string;
  short_summary?: string;
  images?: BangumiImageSet;
  tags?: BangumiTag[];
}

export interface BangumiCollectionItem {
  subject_id?: number;
  subject?: BangumiSubject;
}

export interface BangumiApiResponse {
  data?: BangumiCollectionItem[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface AnimeCardProps {
  subject_id: number,
  name_origin: string,
  name_cn: string,
  coverImage: string,
  short_summary: string,
  tags: string[],
}
