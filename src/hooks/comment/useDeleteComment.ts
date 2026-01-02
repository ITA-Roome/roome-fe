import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentApi } from "@/api/comment";
import { commentKeys } from "@/constants/queryKeys";
import { CommentTargetType } from "@/types/comment";

type DeleteCommentParams = {
  commentId: number;
  commentableType: CommentTargetType;
  commentableId: number;
};

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: DeleteCommentParams) =>
      CommentApi.deleteComment(commentId),
    onSuccess: (_, { commentableType, commentableId }) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(commentableType, commentableId),
      });
    },
  });
}
