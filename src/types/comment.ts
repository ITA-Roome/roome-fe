export type CommentTargetType = "PRODUCT" | "REFERENCE";

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

export type CreateCommentRequest = {
  commentableType: CommentTargetType;
  commentableId: number;
  content: string;
};
