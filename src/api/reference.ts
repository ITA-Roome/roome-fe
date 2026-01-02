import { apiClient } from "@/lib/apiClient";
import { CommonResponse } from "@/types/common";
import {
  ReferenceListParams,
  ReferenceListResponse,
  ReferenceDetail,
} from "@/types/reference";

export const ReferenceApi = {
  fetchReferences: async (
    params: ReferenceListParams,
  ): Promise<CommonResponse<ReferenceListResponse>> => {
    const { data } = await apiClient.get<CommonResponse<ReferenceListResponse>>(
      "/api/references",
      {
        params,
      },
    );
    return data;
  },

  fetchReferenceDetail: async (
    referenceId: number,
  ): Promise<CommonResponse<ReferenceDetail>> => {
    const { data } = await apiClient.get<CommonResponse<ReferenceDetail>>(
      `/api/references/${referenceId}`,
    );
    return data;
  },

  toggleReferenceLike: async (
    referenceId: number,
  ): Promise<{ liked: boolean }> => {
    const res = await apiClient.post<
      CommonResponse<{ liked: boolean }> | { liked: boolean }
    >(`/api/user/likes/reference/${referenceId}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = res.data as any;
    const isWrapped = "success" in data || "isSuccess" in data;

    if (isWrapped) {
      if (!data.success && !data.isSuccess) {
        throw new Error(data.message || "좋아요 토글 실패");
      }
      return data.data;
    }

    return data as { liked: boolean };
  },

  toggleReferenceScrap: async (
    referenceId: number,
  ): Promise<{ scrapped: boolean }> => {
    const res = await apiClient.post<
      CommonResponse<{ scrapped: boolean }> | { scrapped: boolean }
    >(`/api/user/scraps/reference/${referenceId}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = res.data as any;
    const isWrapped = "success" in data || "isSuccess" in data;

    if (isWrapped) {
      if (!data.success && !data.isSuccess) {
        throw new Error(data.message || "스크랩 토글 실패");
      }
      return data.data;
    }

    return data as { scrapped: boolean };
  },
};
