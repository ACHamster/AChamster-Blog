import {BangumiApiResponse} from "@/types/anime.ts";

export const fetchBangumiAnimeList = async (offset: number = 1, limit: number = 10) => {
  const response = await fetch(`https://api.bgm.tv/v0/users/796189/collections?limit=${limit}&offset=${offset}&type=2`, {});
  if(!response.ok) {
    throw new Error('API request failed with status ' + response.status);
  }
  return response.json() as Promise<BangumiApiResponse>
}
