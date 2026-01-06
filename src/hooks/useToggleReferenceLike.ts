import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { ReferenceApi } from "@/api/reference";
import { CommonResponse } from "@/types/common";
import { ReferenceListResponse, ReferenceDetail } from "@/types/reference";

export function useToggleReferenceLike() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ReferenceApi.toggleReferenceLike(id),

    onMutate: async (referenceId) => {
      await qc.cancelQueries({ queryKey: ["references", "list"] });
      await qc.cancelQueries({ queryKey: ["reference", referenceId] });

      const detailKey = ["reference", referenceId];
      const detailData = qc.getQueryData<
        CommonResponse<ReferenceDetail> | ReferenceDetail
      >(detailKey);

      let currentLiked = false;

      const detailDataTyped = detailData as CommonResponse<ReferenceDetail>;

      if (detailDataTyped?.data?.isLiked !== undefined) {
        currentLiked = detailDataTyped.data.isLiked;
      } else {
        const listQueries = qc.getQueriesData<
          InfiniteData<CommonResponse<ReferenceListResponse>>
        >({
          queryKey: ["references", "list"],
        });

        for (const [, listData] of listQueries) {
          if (!listData) continue;
          for (const page of listData.pages) {
            const found = page.data?.content?.find(
              (r) => r.referenceId === referenceId,
            );
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
        InfiniteData<CommonResponse<ReferenceListResponse>>
      >({
        queryKey: ["references", "list"],
      });

      listQueries.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData(key, {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            data: page.data
              ? {
                  ...page.data,
                  content: page.data.content.map((ref) =>
                    ref.referenceId === referenceId
                      ? { ...ref, isLiked: nextLiked }
                      : ref,
                  ),
                }
              : page.data,
          })),
        });
      });
      if (detailDataTyped?.data) {
        qc.setQueryData(detailKey, {
          ...detailDataTyped,
          data: {
            ...detailDataTyped.data,
            isLiked: nextLiked,
            liked: nextLiked,
          },
        });
      }

      return { referenceId, prevLiked: currentLiked };
    },

    onSuccess: (res, referenceId) => {
      const finalLiked = res.liked;

      const listQueries = qc.getQueriesData<
        InfiniteData<CommonResponse<ReferenceListResponse>>
      >({
        queryKey: ["references", "list"],
      });

      listQueries.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData(key, {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            data: page.data
              ? {
                  ...page.data,
                  content: page.data.content.map((ref) =>
                    ref.referenceId === referenceId
                      ? { ...ref, isLiked: finalLiked }
                      : ref,
                  ),
                }
              : page.data,
          })),
        });
      });

      const detailKey = ["reference", referenceId];
      const detailData =
        qc.getQueryData<CommonResponse<ReferenceDetail>>(detailKey);

      if (detailData?.data) {
        qc.setQueryData(detailKey, {
          ...detailData,
          data: {
            ...detailData.data,
            isLiked: finalLiked,
            liked: finalLiked,
          },
        });
      }
    },

    onError: (_err, _refId, ctx) => {
      if (!ctx) return;
      const { referenceId, prevLiked } = ctx;
      const listQueries = qc.getQueriesData<
        InfiniteData<CommonResponse<ReferenceListResponse>>
      >({
        queryKey: ["references", "list"],
      });

      listQueries.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData(key, {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            data: page.data
              ? {
                  ...page.data,
                  content: page.data.content.map((ref) =>
                    ref.referenceId === referenceId
                      ? { ...ref, isLiked: prevLiked }
                      : ref,
                  ),
                }
              : page.data,
          })),
        });
      });

      const detailKey = ["reference", referenceId];
      const detailData =
        qc.getQueryData<CommonResponse<ReferenceDetail>>(detailKey);

      if (detailData?.data) {
        qc.setQueryData(detailKey, {
          ...detailData,
          data: {
            ...detailData.data,
            isLiked: prevLiked,
            liked: prevLiked,
          },
        });
      }
    },
  });
}
