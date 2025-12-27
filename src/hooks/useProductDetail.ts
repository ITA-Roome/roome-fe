/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { ProductApi } from "@/api/product";
import { ReferenceApi } from "@/api/reference";
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

      // 관련 레퍼런스 조회 (상품명으로 검색)
      let relatedReferences: RelatedProductLike[] = [];
      try {
        if (product.name) {
          const refRes = await ReferenceApi.fetchReferenceList(product.name);
          if (refRes.success && refRes.data) {
            relatedReferences = refRes.data.referenceList.map((ref) => ({
              id: ref.referenceId,
              imageUrl: ref.imageUrlList[0], // 첫 번째 이미지 사용
              // 필요한 나머지 필드는 비워두거나 임시 값 채움
              name: "",
              category: "",
              description: "",
              price: 0,
            }));
          }
        }
      } catch (e) {
        console.error("Related references fetch failed", e);
      }

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

        relatedReferenceList: normalizeRelatedProducts(
          relatedReferences,
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
