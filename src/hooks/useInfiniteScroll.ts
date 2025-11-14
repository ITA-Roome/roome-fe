import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { ProductApi } from "@/api/product";
import type { CommonResponse } from "@/types/common";
import type { ProductItem, ProductListResponse } from "@/types/product";
import { QUERY_KEY } from "@/constants/key";

// 정렬 순서
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
  order: ProductOrder,
): UseInfiniteQueryResult<SelectedData, unknown> {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.products, "list", { search, order, limit }],
    enabled: true,
    queryFn: ({ pageParam = 0 }) =>
      ProductApi.fetchProducts({
        page: pageParam,
        size: limit,
        keyWord: search || undefined,
        sort: orderToSort(order),
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: CommonResponse<ProductListResponse>) => {
      const d = lastPage.data;
      if (!d) return undefined;
      return d.last ? undefined : d.number + 1;
    },
    select: (data) => {
      const pages = data.pages;
      const last = pages[pages.length - 1];
      const lastData = last?.data;

      return {
        items: pages.flatMap((p) => p.data?.content ?? []),
        total: lastData?.totalElements ?? 0,
        pageCount: lastData?.totalPages ?? 0,
      };
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}
