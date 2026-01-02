import type {
  CommentItem,
  GetCommentsParams,
  CreateCommentRequest,
} from "@/types/comment";
import type { CommonResponse } from "@/types/common";
import { apiClient } from "@/lib/apiClient";

export const CommentApi = {
  getComments: async ({ type, commentableId }: GetCommentsParams) => {
    const res = await apiClient.get<CommonResponse<CommentItem[]>>(
      "/api/comment",
      { params: { type, commentableId } },
    );

    const body = res.data;
    const ok = body.success ?? body.isSuccess ?? false;
    if (!ok) throw new Error(body.message || "댓글 조회 실패");

    return body.data ?? [];
  },

  createComment: async (params: CreateCommentRequest) => {
    const res = await apiClient.post<CommonResponse<CommentItem>>(
      "/api/comment",
      params,
    );

    if (!res.data.data) {
      throw new Error(res.data.message || "댓글 생성 실패");
    }

    return res.data.data;
  },

  deleteComment: async (commentId: number) => {
    const res = await apiClient.delete<CommonResponse<null>>(
      `/api/comment/${commentId}`,
    );
    const body = res.data;
    const ok = body.success ?? body.isSuccess ?? false;
    if (!ok) throw new Error(body.message || "댓글 삭제 실패");
    return body.data;
  },

  updateComment: async (commentId: number, content: string) => {
    const res = await apiClient.patch<CommonResponse<CommentItem>>(
      `/api/comment/${commentId}`,
      { content },
    );
    const body = res.data;
    const ok = body.success ?? body.isSuccess ?? false;
    if (!ok) throw new Error(body.message || "댓글 수정 실패");
    return body.data;
  },
};
