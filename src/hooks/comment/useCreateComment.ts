import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentApi } from "@/api/comment";
import { commentKeys } from "@/constants/queryKeys";
import type { CommentTargetType } from "@/types/comment";

type CreateCommentParams = {
  commentableType: CommentTargetType;
  commentableId: number;
  content: string;
  parentCommentId?: number;
};

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateCommentParams) =>
      CommentApi.createComment(params),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(
          variables.commentableType,
          variables.commentableId,
        ),
      });
    },
  });
}
