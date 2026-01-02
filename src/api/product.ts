import { apiClient } from "@/lib/apiClient";
import type { CommonResponse } from "@/types/common";
import type {
  ProductListParams,
  ProductListResponse,
  ProductItem,
  ToggleLikeResponse,
  RelatedReferenceResponse,
} from "@/types/product";

export const ProductApi = {
  fetchProducts: async (
    params: ProductListParams,
  ): Promise<CommonResponse<ProductListResponse>> => {
    const { data } = await apiClient.get<CommonResponse<ProductListResponse>>(
      "/api/products",
      {
        params,
      },
    );
    return data;
  },

  fetchProductDetails: async (
    productId: number,
  ): Promise<CommonResponse<ProductItem>> => {
    const { data } = await apiClient.get<CommonResponse<ProductItem>>(
      `/api/products/${productId}`,
    );
    return data;
  },

  toggleProductLike: async (productId: number): Promise<ToggleLikeResponse> => {
    const res = await apiClient.post<
      CommonResponse<ToggleLikeResponse> | ToggleLikeResponse
    >(`/api/user/likes/product/${productId}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = res.data as any;
    const isWrapped = "success" in data || "isSuccess" in data;

    if (isWrapped) {
      if (!data.success && !data.isSuccess) {
        throw new Error(data.message || "좋아요 토글 실패");
      }
      return data.data;
    }
    return data as ToggleLikeResponse;
  },

  toggleProductScrap: async (
    productId: number,
  ): Promise<{ scrapped: boolean }> => {
    const res = await apiClient.post<
      CommonResponse<{ scrapped: boolean }> | { scrapped: boolean }
    >(`/api/user/scraps/product/${productId}`);

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

  fetchRelatedReferences: async (
    productId: number,
  ): Promise<RelatedReferenceResponse[]> => {
    const { data } = await apiClient.get<
      CommonResponse<RelatedReferenceResponse[]>
    >(`/api/products/${productId}/related-references`);
    return data.data ?? [];
  },
};
