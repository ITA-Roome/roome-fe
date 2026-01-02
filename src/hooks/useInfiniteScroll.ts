import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from "@tanstack/react-query";
import { ProductApi } from "@/api/product";
import type { CommonResponse } from "@/types/common";
import type { ProductItem, ProductListResponse } from "@/types/product";
import { productKeys } from "@/constants/queryKeys";

export type ProductOrder = "LATEST" | "PRICE_ASC" | "PRICE_DESC" | "POPULAR";

const orderToSort = (order: ProductOrder): string[] => {
  switch (order) {
    case "PRICE_ASC":
      return ["price,ASC"];
    case "PRICE_DESC":
      return ["price,DESC"];
    case "POPULAR":
      return ["popularity,DESC", "id,DESC"];
    case "LATEST":
    default:
      return ["id,DESC"];
  }
};

type SelectedData = {
  items: ProductItem[];
  total: number;
  pageCount: number;
};

export default function useGetInfiniteProductsList(
  limit: number,
  search: string,
  keywords: string[],
  order: ProductOrder,
): UseInfiniteQueryResult<SelectedData, unknown> {
  // combine search + keywords for the API
  // If the API supports multiple keywords via space separation:
  const combinedKeyword = [search, ...keywords].filter(Boolean).join(" ");

  return useInfiniteQuery<
    CommonResponse<ProductListResponse>,
    unknown,
    SelectedData,
    ReturnType<typeof productKeys.list>,
    number
  >({
    queryKey: productKeys.list({ search: combinedKeyword, order, limit }),
    enabled: true,

    queryFn: ({ pageParam = 0 }) =>
      ProductApi.fetchProducts({
        page: pageParam,
        size: limit,
        keyWord: combinedKeyword || undefined,
        sort: orderToSort(order),
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      const d = lastPage.data;
      if (!d) return undefined;
      return d.last ? undefined : d.number + 1;
    },

    select: (data: InfiniteData<CommonResponse<ProductListResponse>>) => {
      const pages = data.pages;
      const last = pages[pages.length - 1];
      const lastData = last?.data;

      const items: ProductItem[] = pages.flatMap((p) =>
        (p.data?.content ?? []).map((it) => ({
          ...it,
          liked: it.liked ?? false,
        })),
      );

      return {
        items,
        total: lastData?.totalElements ?? 0,
        pageCount: lastData?.totalPages ?? 0,
      };
    },

    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}
