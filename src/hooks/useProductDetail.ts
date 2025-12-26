/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductApi } from "@/api/product";
import type { ProductItem } from "@/types/product";
import type { CommonResponse } from "@/types/common";
import type { ProductListResponse } from "@/types/product";
import type { InfiniteData } from "@tanstack/react-query";
import { productKeys } from "@/constants/queryKeys";

export function useProductDetail(id: number | null) {
  const queryClient = useQueryClient();

  // list 캐시에서 해당 product 찾기
  const getInitialData = (): ProductItem | undefined => {
    if (id === null) return undefined;

    const listQueries = queryClient.getQueriesData<
      InfiniteData<CommonResponse<ProductListResponse>>
    >({
      queryKey: ["products", "list"],
    });

    for (const [, data] of listQueries) {
      if (!data) continue;
      for (const page of data.pages) {
        const found = page.data?.content?.find((p) => p.id === id);
        if (found) {
          console.log("🔍 Found in list cache, liked:", found.liked);
          return {
            ...found,
            liked: found.liked ?? false,
          };
        }
      }
    }

    return undefined;
  };

  return useQuery<ProductItem>({
    queryKey:
      id !== null ? productKeys.detail(id) : ["products", "detail", null],
    queryFn: async () => {
      if (id === null) throw new Error("invalid product id");
      const res = await ProductApi.fetchProductDetails(id);
      if (!res.success || !res.data) throw new Error(res.message ?? "fail");

      const product = res.data;

      // list 캐시에서 liked 상태 가져오기 (API보다 우선)
      const cachedData = getInitialData();
      const likedFromCache = cachedData?.liked ?? product.liked ?? false;

      const normalizedProduct: ProductItem = {
        ...product,
        liked: likedFromCache, // 캐시의 liked 사용
        shop: product.shop ?? {
          id: (product as any).shopId ?? 0,
          name: (product as any).shopName ?? "",
          logoUrl: (product as any).shopLogoUrl ?? "",
        },
      };

      console.log(
        "📡 API response, using cached liked:",
        normalizedProduct.liked,
      );
      return normalizedProduct;
    },
    // initialData 사용
    initialData: getInitialData,
    // 캐시가 있으면 API 호출하지 않음
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: id !== null,
  });
}
