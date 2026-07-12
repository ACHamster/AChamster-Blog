import {BangumiApiResponse} from "@/types/anime.ts";

export const fetchBangumiAnimeList = async (page: number = 1, limit: number = 10) => {
  const response = await fetch(`https://api.achamster.com/bangumi/records?limit=${limit}&page=${page}`, {});
  if(!response.ok) {
    throw new Error('API request failed with status ' + response.status);
  }
  return response.json() as Promise<BangumiApiResponse>
}
