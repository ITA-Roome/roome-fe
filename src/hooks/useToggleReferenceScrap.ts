import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { ReferenceApi } from "@/api/reference";
import { CommonResponse } from "@/types/common";
import { ReferenceListResponse, ReferenceDetail } from "@/types/reference";

export function useToggleReferenceScrap() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ReferenceApi.toggleReferenceScrap(id),

    onMutate: async (referenceId) => {
      await qc.cancelQueries({ queryKey: ["references", "list"] });
      await qc.cancelQueries({ queryKey: ["reference", referenceId] });

      const detailKey = ["reference", referenceId];
      const detailData = qc.getQueryData<
        CommonResponse<ReferenceDetail> | ReferenceDetail
      >(detailKey);

      let currentScrapped = false;

      const detailDataTyped = detailData as CommonResponse<ReferenceDetail>;

      if (detailDataTyped?.data?.isScrapped !== undefined) {
        currentScrapped = detailDataTyped.data.isScrapped;
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
              currentScrapped = found.isScrapped ?? false;
              break;
            }
          }
          if (currentScrapped) break;
        }
      }

      const nextScrapped = !currentScrapped;

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
                      ? { ...ref, isScrapped: nextScrapped }
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
            isScrapped: nextScrapped,
            scrapped: nextScrapped,
          },
        });
      }

      return { referenceId, prevScrapped: currentScrapped };
    },

    onSuccess: (res, referenceId) => {
      const finalScrapped = res.scrapped;

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
                      ? { ...ref, isScrapped: finalScrapped }
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
            isScrapped: finalScrapped,
            scrapped: finalScrapped,
          },
        });
      }
    },

    onError: (_err, _refId, ctx) => {
      if (!ctx) return;
      const { referenceId, prevScrapped } = ctx;
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
                      ? { ...ref, isScrapped: prevScrapped }
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
            isScrapped: prevScrapped,
            scrapped: prevScrapped,
          },
        });
      }
    },
  });
}
