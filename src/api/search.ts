import { apiClient } from "@/lib/apiClient";
import { SuggestItem } from "@/hooks/useSearchInput";
import { CommonResponse } from "@/types/common";

type PopularKeyword = {
  rank: number;
  keyword: string;
  score: number;
};

type PopularSearchResponse = {
  rankings: PopularKeyword[];
};

type RecentSearchResponse = {
  keywords: string[];
};

export async function fetchRecentSearch(): Promise<SuggestItem[]> {
  try {
    const { data } = await apiClient.get<CommonResponse<RecentSearchResponse>>(
      "/api/search/keywords/recent",
    );

    const keywords = data.data?.keywords ?? [];

    return keywords.map((text, idx) => ({
      id: `recent-${idx}`,
      text,
    }));
  } catch {
    return [];
  }
}

export async function fetchPopularSearch(): Promise<SuggestItem[]> {
  try {
    const { data } = await apiClient.get<CommonResponse<PopularSearchResponse>>(
      "/api/search/keywords/popular",
    );

    const rankings = data.data?.rankings ?? [];

    return rankings.map((item) => ({
      id: `popular-${item.rank}`,
      text: item.keyword,
    }));
  } catch {
    return [];
  }
}

export async function deleteRecentSearch(keyword: string): Promise<boolean> {
  try {
    const { data } = await apiClient.delete<CommonResponse<unknown>>(
      "/api/search/keywords/recent",
      {
        params: { keyword },
      },
    );
    return data.isSuccess || data.success;
  } catch {
    return false;
  }
}
