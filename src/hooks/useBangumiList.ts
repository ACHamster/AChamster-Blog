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

  const raw: BangumiSubject[] = Array.isArray(response.subjects) ? response.subjects : [];

  const normalized: AnimeCardProps[] = raw.map((item) => {
    return {
      subject_id: item.subject_id ?? 0,
      name_origin: item.name ?? '',
      name_cn: item.name_cn ?? item.name ?? '',
      coverImage: item.images?.common ?? item.images?.medium ?? item.images?.large ?? '',
      short_summary: item.short_summary ?? '',
      tags: Array.isArray(item.tags)
        ? item.tags
          .map((t: BangumiTag) => (t?.name ?? String(t)))
          .slice(0, 5)
        : [],
    } as AnimeCardProps;
  });

  const hasNextPage = response.hasMore;
  const nextPage = hasNextPage ? page + 1 : undefined;

  return {
    data: normalized,
    nextPageParam: nextPage,
    total: response.total ?? 0,
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
