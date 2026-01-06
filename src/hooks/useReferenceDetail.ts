import { useQuery, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { ReferenceApi } from "@/api/reference";
import { CommonResponse } from "@/types/common";
import { ReferenceListResponse, ReferenceDetail } from "@/types/reference";

export const useReferenceDetail = (referenceId: number | null) => {
  const queryClient = useQueryClient();

  const getInitialData = (): CommonResponse<ReferenceDetail> | undefined => {
    if (!referenceId) return undefined;

    const listQueries = queryClient.getQueriesData<
      InfiniteData<CommonResponse<ReferenceListResponse>>
    >({
      queryKey: ["references", "list"],
    });

    for (const [, data] of listQueries) {
      if (!data) continue;
      for (const page of data.pages) {
        const found = page.data?.content?.find(
          (r) => r.referenceId === referenceId,
        );
        if (found) {
          return {
            isSuccess: true,
            success: true,
            code: "200",
            message: "OK",
            data: {
              referenceId: found.referenceId,
              name: "",
              description: "",
              imageUrls: found.imageUrlList.filter(
                (url): url is string => !!url,
              ),
              referenceItems: [],
              scrapCount: found.scrapCount,
              likeCount: 0,
              isScrapped: found.isScrapped ?? false,
              isLiked: found.isLiked ?? false,
              userName: found.nickname,
              userProfileUrl: "",
              referenceUrl: "",
            },
          };
        }
      }
    }
    return undefined;
  };

  return useQuery({
    queryKey: ["reference", referenceId],
    queryFn: async () => {
      if (!referenceId) throw new Error("Invalid ID");
      const res = await ReferenceApi.fetchReferenceDetail(referenceId);
      return res;
    },
    initialData: getInitialData,
    enabled: !!referenceId,
    select: (data) => data.data,
  });
};
