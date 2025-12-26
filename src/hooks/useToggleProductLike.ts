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
import { productKeys, type ProductListKeyParams } from "@/constants/queryKeys";

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
                p.id === productId ? { ...p, liked: nextLiked } : p,
              ),
            }
          : page.data,
      };
    }),
  };
}

export function useToggleProductLike(params: ProductListKeyParams) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => ProductApi.toggleProductLike(productId),

    onMutate: async (productId) => {
      // 모든 products 쿼리 취소
      await qc.cancelQueries({ queryKey: productKeys.all });

      // 1. detail 쿼리에서 현재 liked 상태 가져오기
      const detailKey = productKeys.detail(productId);
      const detailData =
        qc.getQueryData<CommonResponse<ProductItem>>(detailKey);

      let currentLiked = false;

      if (detailData?.data?.liked !== undefined) {
        currentLiked = detailData.data.liked;
      } else {
        // detail이 없으면 현재 list에서 찾기
        const listKey = productKeys.list(params);
        const listData =
          qc.getQueryData<InfiniteData<CommonResponse<ProductListResponse>>>(
            listKey,
          );

        if (listData) {
          for (const page of listData.pages) {
            const found = page.data?.content?.find((p) => p.id === productId);
            if (found) {
              currentLiked = found.liked ?? false;
              break;
            }
          }
        }
      }

      const nextLiked = !currentLiked;

      // 2. 모든 list 쿼리 업데이트 (optimistic update)
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

      // 3. detail 쿼리 업데이트
      if (detailData?.data) {
        qc.setQueryData(detailKey, {
          ...detailData,
          data: {
            ...detailData.data,
            liked: nextLiked,
          },
        });
      }

      return { productId, prevLiked: currentLiked };
    },

    onSuccess: (res: ToggleLikeResponse, productId) => {
      const finalLiked = res.liked;

      // 1. 모든 list 쿼리 업데이트
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

      // 2. detail 쿼리 업데이트
      const detailKey = productKeys.detail(productId);
      const detailData =
        qc.getQueryData<CommonResponse<ProductItem>>(detailKey);

      if (detailData?.data) {
        qc.setQueryData(detailKey, {
          ...detailData,
          data: {
            ...detailData.data,
            liked: finalLiked,
          },
        });
      }
    },

    onError: (_err, _productId, ctx) => {
      if (!ctx) return;

      const { productId, prevLiked } = ctx;

      // 1. 모든 list 쿼리 롤백
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

      // 2. detail 쿼리 롤백
      const detailKey = productKeys.detail(productId);
      const detailData =
        qc.getQueryData<CommonResponse<ProductItem>>(detailKey);

      if (detailData?.data) {
        qc.setQueryData(detailKey, {
          ...detailData,
          data: {
            ...detailData.data,
            liked: prevLiked,
          },
        });
      }
    },
  });
}
