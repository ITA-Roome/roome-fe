import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { ProductApi } from "@/api/product";
import type { CommonResponse } from "@/types/common";
import type { ProductListResponse, ProductItem } from "@/types/product";
import { productKeys } from "@/constants/queryKeys";

function updateInfiniteListScrap(
  old: InfiniteData<CommonResponse<ProductListResponse>> | undefined,
  productId: number,
  nextScrapped: boolean,
): InfiniteData<CommonResponse<ProductListResponse>> | undefined {
  if (!old) return old;

  return {
    ...old,
    pages: old.pages.map((page) => {
      const content = page.data?.content ?? [];

      return {
        ...page,
        data: page.data
          ? {
              ...page.data,
              content: content.map((p) =>
                p.id === productId ? { ...p, isScrapped: nextScrapped } : p,
              ),
            }
          : page.data,
      };
    }),
  };
}

export function useToggleProductScrap() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => ProductApi.toggleProductScrap(productId),

    onMutate: async (productId) => {
      await qc.cancelQueries({ queryKey: productKeys.all });

      const detailKey = productKeys.detail(productId);
      const detailData = qc.getQueryData<ProductItem>(detailKey);

      let currentScrapped = false;

      if (detailData && "isScrapped" in detailData) {
        currentScrapped = detailData.isScrapped;
      } else {
        const listQueries = qc.getQueriesData<
          InfiniteData<CommonResponse<ProductListResponse>>
        >({
          queryKey: ["products", "list"],
        });

        for (const [, listData] of listQueries) {
          if (!listData) continue;
          for (const page of listData.pages) {
            const found = page.data?.content?.find((p) => p.id === productId);
            if (found && "isScrapped" in found) {
              currentScrapped = found.isScrapped ?? false;
              break;
            }
          }
          if (currentScrapped) break;
        }
      }

      const nextScrapped = !currentScrapped;
      const listQueries = qc.getQueriesData<
        InfiniteData<CommonResponse<ProductListResponse>>
      >({
        queryKey: ["products", "list"],
      });

      listQueries.forEach(([key, data]) => {
        qc.setQueryData(
          key,
          updateInfiniteListScrap(data, productId, nextScrapped),
        );
      });

      if (detailData) {
        qc.setQueryData(detailKey, {
          ...detailData,
          isScrapped: nextScrapped,
          scrapped: nextScrapped,
        });
      }

      return { productId, prevScrapped: currentScrapped };
    },

    onSuccess: (res: { scrapped: boolean }, productId) => {
      const finalScrapped = res.scrapped;

      const listQueries = qc.getQueriesData<
        InfiniteData<CommonResponse<ProductListResponse>>
      >({
        queryKey: ["products", "list"],
      });

      listQueries.forEach(([key, data]) => {
        qc.setQueryData(
          key,
          updateInfiniteListScrap(data, productId, finalScrapped),
        );
      });
      const detailKey = productKeys.detail(productId);
      const detailData = qc.getQueryData<ProductItem>(detailKey);

      if (detailData) {
        qc.setQueryData(detailKey, {
          ...detailData,
          isScrapped: finalScrapped,
          scrapped: finalScrapped,
        });
      }
    },

    onError: (_err, _productId, ctx) => {
      if (!ctx) return;
      const { productId, prevScrapped } = ctx;

      const listQueries = qc.getQueriesData<
        InfiniteData<CommonResponse<ProductListResponse>>
      >({
        queryKey: ["products", "list"],
      });

      listQueries.forEach(([key, data]) => {
        qc.setQueryData(
          key,
          updateInfiniteListScrap(data, productId, prevScrapped),
        );
      });

      const detailKey = productKeys.detail(productId);
      const detailData = qc.getQueryData<ProductItem>(detailKey);

      if (detailData) {
        qc.setQueryData(detailKey, {
          ...detailData,
          isScrapped: prevScrapped,
          scrapped: prevScrapped,
        });
      }
    },
  });
}
