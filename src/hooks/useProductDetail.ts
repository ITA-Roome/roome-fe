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
          const localIsLiked =
            (found as any).isLiked ?? (found as any).liked ?? false; // eslint-disable-line @typescript-eslint/no-explicit-any
          const localIsScrapped =
            (found as any).isScrapped ?? (found as any).scrapped ?? false; // eslint-disable-line @typescript-eslint/no-explicit-any

          return {
            ...found,
            liked: localIsLiked,
            isLiked: localIsLiked,
            isScrapped: localIsScrapped,
            description: "",
            images: [],
            tags: [],
            shop: {
              id: found.shopId,
              name: found.shopName,
              logoUrl: "",
            },
            relatedProductList: [],
            relatedReferenceList: [],
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const product = res.data as any;
      const cached = getInitialData();
      const relatedReferences: RelatedProductLike[] = [];
      const apiIsLiked =
        product.isLiked ?? product.liked ?? cached?.liked ?? false;
      const apiIsScrapped =
        product.isScrapped ?? product.scrapped ?? cached?.isScrapped ?? false;

      const normalizedProduct: ProductItem = {
        ...product,

        liked: apiIsLiked,
        isLiked: apiIsLiked,
        isScrapped: apiIsScrapped,

        shop: product.shop ?? {
          id: product.shopId ?? 0,
          name: product.shopName ?? "",
          logoUrl: product.shopLogoUrl ?? "",
        },

        relatedProductList: normalizeRelatedProducts(
          product.relatedProductList as RelatedProductLike[] | undefined,
        ) as any, // eslint-disable-line @typescript-eslint/no-explicit-any

        relatedReferenceList: normalizeRelatedProducts(
          relatedReferences,
        ) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      };

      return normalizedProduct;
    },
    initialData: getInitialData,
    staleTime: 0,
    refetchOnMount: "always",

    gcTime: 5 * 60_000,
    enabled: id !== null,

    retry: 1,
  });
}
