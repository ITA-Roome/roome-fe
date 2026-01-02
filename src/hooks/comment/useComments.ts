import { useQuery } from "@tanstack/react-query";
import { CommentApi } from "@/api/comment";
import { commentKeys } from "@/constants/queryKeys";
import type { CommentItem, CommentTargetType } from "@/types/comment";

type Params = {
  type: CommentTargetType;
  commentableId: number | null;
};

export function useComments({ type, commentableId }: Params) {
  return useQuery<CommentItem[]>({
    queryKey:
      commentableId !== null
        ? commentKeys.list(type, commentableId)
        : ["comments", "list", type, null],
    queryFn: () => {
      if (commentableId === null) throw new Error("invalid commentableId");
      return CommentApi.getComments({ type, commentableId });
    },
    enabled: commentableId !== null,
    staleTime: 30_000,
    retry: 1,
  });
}
