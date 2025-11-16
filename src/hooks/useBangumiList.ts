import {QueryKey, useInfiniteQuery} from "@tanstack/react-query";
import {AnimeCardProps, BangumiCollectionItem, BangumiSubject, BangumiTag} from "@/types/anime.ts";
import {fetchBangumiAnimeList} from "@/lib/api/bangumi.ts";

const ANIME_KEYS: QueryKey = ['animeList', 'infinite'];

interface PageResult {
  data: AnimeCardProps[]; // 经过处理的最终数据
  nextPageParam: number | undefined; // 下一页的页码
  total: number; // 总数据量
}

const bangumiListFetcher = async ({ pageParam = 1 }): Promise<PageResult> => {
  const page = pageParam;
  const limit = 10;
  const response = await fetchBangumiAnimeList(page, limit);

  const raw: BangumiCollectionItem[] = Array.isArray(response.data)
    ? response.data
    : Array.isArray(response.data)
      ? response.data
      : [];

  const normalized: AnimeCardProps[] = raw.map((item) => {
  const subject: BangumiSubject = item.subject ?? {
    id: item.subject_id ?? 0,
    name: '',
  };
  return {
    subject_id: item.subject_id ?? subject.id ?? 0,
    name_origin: subject.name ?? '',
    name_cn: subject.name_cn ?? subject.name ?? '',
    // prefer a commonly sized image
    coverImage: subject.images?.common ?? subject.images?.medium ?? subject.images?.large ?? '',
    short_summary: subject.short_summary ?? '',
    // tags from API are objects {name,count,total_cont} — convert to string names
    tags: Array.isArray(subject.tags)
      ? subject.tags
        .map((t: BangumiTag) => (t?.name ?? String(t)))
        .slice(0, 5)
      : [],
  } as AnimeCardProps;
  });

  const total = response?.total ?? 0;
  const hasNextPage = total > (page * limit);
  const nextPage = hasNextPage ? page + 1 : undefined;

  return {
    data: normalized,
    nextPageParam: nextPage,
    total: total,
  };
}

export const useBangumiList = () => {
  return useInfiniteQuery({
    queryKey: ANIME_KEYS,
    queryFn: bangumiListFetcher,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false, // 避免重复请求
    refetchOnReconnect: false,
  })
}
