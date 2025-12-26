import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentApi } from "@/api/comment";
import { commentKeys } from "@/constants/queryKeys";
import type { CommentTargetType } from "@/types/comment";

type UpdateCommentParams = {
  type: CommentTargetType;
  commentableId: number;
  commentId: number;
  content: string;
};

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: UpdateCommentParams) =>
      CommentApi.updateComment({ commentId, content }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(variables.type, variables.commentableId),
      });
    },
  });
}
