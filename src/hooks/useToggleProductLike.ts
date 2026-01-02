import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { ProductApi } from "@/api/product";
import type { CommonResponse } from "@/types/common";
import type {
  ProductListResponse,
  ProductItem,
  ToggleLikeResponse,
} from "@/types/product";
import { productKeys } from "@/constants/queryKeys";

function updateInfiniteListLike(
  old: InfiniteData<CommonResponse<ProductListResponse>> | undefined,
  productId: number,
  nextLiked: boolean,
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
                p.id === productId ? { ...p, isLiked: nextLiked } : p,
              ),
            }
          : page.data,
      };
    }),
  };
}

export function useToggleProductLike() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => ProductApi.toggleProductLike(productId),

    onMutate: async (productId) => {
      await qc.cancelQueries({ queryKey: productKeys.all });
      const detailKey = productKeys.detail(productId);
      const detailData = qc.getQueryData<ProductItem>(detailKey);
      let currentLiked = false;
      if (detailData?.liked !== undefined) {
        currentLiked = detailData.liked;
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
            if (found) {
              currentLiked = found.isLiked ?? false;
              break;
            }
          }
          if (currentLiked) break;
        }
      }

      const nextLiked = !currentLiked;

      const listQueries = qc.getQueriesData<
        InfiniteData<CommonResponse<ProductListResponse>>
      >({
        queryKey: ["products", "list"],
      });

      listQueries.forEach(([key, data]) => {
        qc.setQueryData(
          key,
          updateInfiniteListLike(data, productId, nextLiked),
        );
      });
      if (detailData) {
        qc.setQueryData(detailKey, {
          ...detailData,
          liked: nextLiked,
          isLiked: nextLiked,
        });
      }

      return { productId, prevLiked: currentLiked };
    },

    onSuccess: (res: ToggleLikeResponse, productId) => {
      const finalLiked = res.liked;
      const listQueries = qc.getQueriesData<
        InfiniteData<CommonResponse<ProductListResponse>>
      >({
        queryKey: ["products", "list"],
      });

      listQueries.forEach(([key, data]) => {
        qc.setQueryData(
          key,
          updateInfiniteListLike(data, productId, finalLiked),
        );
      });
      const detailKey = productKeys.detail(productId);
      const detailData = qc.getQueryData<ProductItem>(detailKey);

      if (detailData) {
        qc.setQueryData(detailKey, {
          ...detailData,
          liked: finalLiked,
          isLiked: finalLiked,
        });
      }
    },

    onError: (_err, _productId, ctx) => {
      if (!ctx) return;

      const { productId, prevLiked } = ctx;

      const listQueries = qc.getQueriesData<
        InfiniteData<CommonResponse<ProductListResponse>>
      >({
        queryKey: ["products", "list"],
      });

      listQueries.forEach(([key, data]) => {
        qc.setQueryData(
          key,
          updateInfiniteListLike(data, productId, prevLiked),
        );
      });

      const detailKey = productKeys.detail(productId);
      const detailData = qc.getQueryData<ProductItem>(detailKey);

      if (detailData) {
        qc.setQueryData(detailKey, {
          ...detailData,
          liked: prevLiked,
          isLiked: prevLiked,
        });
      }
    },
  });
}
