/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { ProductApi } from "@/api/product";
import type { ProductItem, ProductListResponse } from "@/types/product";
import type { CommonResponse } from "@/types/common";
import { productKeys } from "@/constants/queryKeys";

type RelatedProductLike = {
  id?: number;
  productId?: number;
  name?: string;
  category?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  url?: string;
};

export function useProductDetail(id: number | null) {
  const queryClient = useQueryClient();

  const getInitialData = (): ProductItem | undefined => {
    if (id === null) return undefined;

    const listQueries = queryClient.getQueriesData<
      InfiniteData<CommonResponse<ProductListResponse>>
    >({
      queryKey: ["products", "list"],
      exact: false,
    });

    for (const [, data] of listQueries) {
      if (!data) continue;

      for (const page of data.pages) {
        const found = page.data?.content?.find((p) => p.id === id);
        if (found) {
          return {
            ...found,
            liked: found.liked ?? false,
          } as ProductItem;
        }
      }
    }

    return undefined;
  };

  /**
   * - id 보정: id ?? productId
   * - imageUrl 보정: imageUrl ?? thumbnailUrl ?? url ?? ""
   * - id 기준 dedupe(Map)
   */
  const normalizeRelatedProducts = (
    list: RelatedProductLike[] | undefined,
  ): RelatedProductLike[] => {
    const mapped = (list ?? [])
      .map((x) => {
        const normalizedId = x.id ?? x.productId;
        if (typeof normalizedId !== "number") return null;

        return {
          ...x,
          id: normalizedId,
          imageUrl: x.imageUrl ?? x.thumbnailUrl ?? x.url ?? "",
        } as RelatedProductLike & { id: number; imageUrl: string };
      })
      .filter(Boolean) as Array<
      RelatedProductLike & { id: number; imageUrl: string }
    >;

    // id 기준 중복 제거
    return Array.from(new Map(mapped.map((p) => [p.id, p])).values());
  };

  return useQuery<ProductItem>({
    queryKey:
      id !== null ? productKeys.detail(id) : ["products", "detail", null],

    queryFn: async () => {
      if (id === null) throw new Error("invalid product id");

      const res = await ProductApi.fetchProductDetails(id);
      if (!res.success || !res.data) throw new Error(res.message ?? "fail");

      const product = res.data as any;
      const cached = getInitialData();

      const normalizedProduct: ProductItem = {
        ...product,

        liked: product.liked ?? cached?.liked ?? false,
        shop: product.shop ?? {
          id: product.shopId ?? 0,
          name: product.shopName ?? "",
          logoUrl: product.shopLogoUrl ?? "",
        },

        relatedProductList: normalizeRelatedProducts(
          product.relatedProductList as RelatedProductLike[] | undefined,
        ) as any,
      };

      return normalizedProduct;
    },

    // 리스트에서 넘어올 때 첫 화면 빠르게 채우기
    initialData: getInitialData,

    /**
     * - initialData가 있어도 mount 시 무조건 상세를 다시 받아온다
     * - staleTime을 0으로 해서 "요약 캐시"를 신선한 데이터로 착각하지 않게 한다
     */
    staleTime: 0,
    refetchOnMount: "always",

    gcTime: 5 * 60_000,
    enabled: id !== null,

    retry: 1,
  });
}
