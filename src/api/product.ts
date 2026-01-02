import { apiClient } from "@/lib/apiClient";
import type { CommonResponse } from "@/types/common";
import type {
  ProductListParams,
  ProductListResponse,
  ProductItem,
  ToggleLikeResponse,
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
    const res = await apiClient.post<CommonResponse<ToggleLikeResponse>>(
      `/api/user/likes/${productId}`,
    );

    // sucess 필드 표준화
    const ok = res.data.success ?? res.data.isSuccess ?? false;

    if (!ok || !res.data.data) {
      throw new Error(res.data.message || "좋아요 토글 실패");
    }

    return res.data.data;
  },
};
