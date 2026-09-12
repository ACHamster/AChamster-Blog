import { BangumiApiResponse } from "@/types/anime.ts";
import apiClient from "@/lib/api.ts";

export const fetchBangumiAnimeList = async (page: number = 1, limit: number = 10): Promise<BangumiApiResponse> => {
  const response = await apiClient.get<BangumiApiResponse>('/bangumi/records', {
    params: { limit, page },
  });
  return response.data;
};

