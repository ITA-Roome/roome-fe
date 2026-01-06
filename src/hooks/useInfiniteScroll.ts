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

const MOOD_MAP: Record<string, string> = {
  포근한: "COZY",
  심플한: "SIMPLE",
  아늑한: "SNUG",
};

const USAGE_MAP: Record<string, string> = {
  "방 (공간)": "ROOM",
  원룸: "ONE_ROOM",
  거실: "LIVING_ROOM",
};

export default function useGetInfiniteProductsList(
  limit: number,
  search: string,
  keywords: string[],
  order: ProductOrder,
): UseInfiniteQueryResult<SelectedData, unknown> {
  const mood = keywords.map((k) => MOOD_MAP[k]).filter(Boolean);
  const usage = keywords.map((k) => USAGE_MAP[k]).filter(Boolean);
  const keyWord = search || undefined;

  return useInfiniteQuery<
    CommonResponse<ProductListResponse>,
    unknown,
    SelectedData,
    ReturnType<typeof productKeys.list>,
    number
  >({
    queryKey: productKeys.list({ search: keyWord, order, limit, mood, usage }),
    enabled: true,

    queryFn: ({ pageParam = 0 }) =>
      ProductApi.fetchProducts({
        page: pageParam,
        size: limit,
        keyWord,
        mood: mood.length > 0 ? mood : undefined,
        usage: usage.length > 0 ? usage : undefined,
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
          liked: it.isLiked,
          description: "",
          images: [],
          tags: [],
          shop: {
            id: it.shopId,
            name: it.shopName,
            logoUrl: "",
          },
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
