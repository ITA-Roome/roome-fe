import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { ReferenceApi } from "@/api/reference";
import { ReferenceListItem, ReferenceListResponse } from "@/types/reference";
import { CommonResponse } from "@/types/common";

type SelectedData = {
  items: ReferenceListItem[];
};

export default function useGetInfiniteReferences(
  keyWord?: string,
): UseInfiniteQueryResult<SelectedData, unknown> {
  return useInfiniteQuery<
    CommonResponse<ReferenceListResponse>,
    unknown,
    SelectedData,
    (string | undefined)[],
    number
  >({
    queryKey: ["references", "list", keyWord],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      ReferenceApi.fetchReferences({
        keyWord,
        page: pageParam,
        size: 21,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const isLast = lastPage.data?.last ?? true;
      if (isLast) return undefined;
      return allPages.length;
    },
    select: (data) => {
      const items = data.pages
        .flatMap((page) => page.data?.content ?? [])
        .map((item) => ({
          ...item,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          isLiked: item.isLiked ?? (item as any).liked ?? false,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          isScrapped: item.isScrapped ?? (item as any).scrapped ?? false,
        }));
      return { items };
    },
    staleTime: 60 * 1000,
  });
}
