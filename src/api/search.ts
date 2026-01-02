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
  } catch (error) {
    console.error("fetchRecentSearch error:", error);
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
  } catch (error) {
    console.error("fetchPopularSearch error:", error);
    return [];
  }
}

// 최근 검색어 삭제
export async function deleteRecentSearch(keyword: string): Promise<boolean> {
  try {
    const { status } = await apiClient.delete("/api/search/keywords/recent", {
      params: { keyword },
    });
    return status === 200;
  } catch (error) {
    console.error("deleteRecentSearch error:", error);
    return false;
  }
}
