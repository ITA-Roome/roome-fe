// 댓글이 달리는 대상 타입
export type CommentTargetType = "PRODUCT" | "REFERENCE";

// 댓글 하나의 응답 모델
export type CommentItem = {
  id: number;
  userId: number;
  nickname: string;
  profileImage: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  isAuthor: boolean;
  createdAt: string;
  updatedAt: string;
  childComments: string[];
};

//댓글 목록 조회
export type GetCommentsParams = {
  type: CommentTargetType;
  commentableId: number;
};

//댓글 생성
export type CreateCommentRequest = {
  commentableType: CommentTargetType;
  commentableId: number;
  content: string;
};
