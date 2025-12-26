import type { CommonResponse } from "@/types/common";
import type { CommentItem, CommentTargetType } from "@/types/comment";
import { apiClient } from "@/lib/apiClient";

type GetCommentsParams = {
  type: CommentTargetType; // "PRODUCT" | "REFERENCE"
  commentableId: number;
};

type CreateCommentParams = {
  commentableType: CommentTargetType;
  commentableId: number;
  content: string;
};

type UpdateCommentParams = {
  commentId: number;
  content: string;
};

export const CommentApi = {
  getComments: async ({ type, commentableId }: GetCommentsParams) => {
    const res = await apiClient.get<CommonResponse<CommentItem[]>>(
      "/api/comment",
      {
        params: { type, commentableId },
      },
    );
    return res.data.data ?? [];
  },

  createComment: async (params: CreateCommentParams) => {
    const res = await apiClient.post<CommonResponse<CommentItem>>(
      "/api/comment",
      params,
    );
    return res.data.data as CommentItem;
  },

  updateComment: async ({ commentId, content }: UpdateCommentParams) => {
    const res = await apiClient.patch<CommonResponse<CommentItem>>(
      `/api/comment/${commentId}`,
      { content },
    );
    return res.data.data as CommentItem;
  },
};
