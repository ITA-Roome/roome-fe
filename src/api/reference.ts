import { apiClient } from "@/lib/apiClient";
import type { CommonResponse } from "@/types/common";
import type { ReferenceListResponse } from "@/types/reference";

export const ReferenceApi = {
  fetchReferenceList: async (
    keyWord: string,
  ): Promise<CommonResponse<ReferenceListResponse>> => {
    const { data } = await apiClient.get<CommonResponse<ReferenceListResponse>>(
      "/api/references",
      {
        params: {
          keyWord,
        },
      },
    );
    return data;
  },
};
