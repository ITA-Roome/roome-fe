import { apiClient } from "@/lib/apiClient";
import type { CommonResponse } from "@/types/common";
import type {
  ProductListParams,
  ProductListResponse,
  ProductItem,
} from "@/types/product";

export const ProductApi = {
  fetchProducts: async (
    params: ProductListParams,
  ): Promise<CommonResponse<ProductListResponse>> => {
    const { data } = await apiClient.get<CommonResponse<ProductListResponse>>(
      "api/products",
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
      `api/products/${productId}`,
    );
    return data;
  },
};
