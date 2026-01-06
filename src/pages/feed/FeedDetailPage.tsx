import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clsx from "clsx";

import BookmarkIcon from "@/assets/icons/bookmark.svg?react";
import BookmarkFillIcon from "@/assets/icons/bookmark-fill.svg?react";
import FavoriteIcon from "@/assets/icons/navBar/favorite.svg?react";
import FavoriteFillIcon from "@/assets/icons/navBar/favorite-fill.svg?react";
import RoomeFillIcon from "@/assets/RoomeLogo/roome-fill.svg?react";
import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";
import CommentLogo from "@/assets/RoomeLogo/comment_icon.svg?react";
import RoomeExport from "@/assets/RoomeLogo/roome_export.svg?react";

import { useReferenceDetail } from "@/hooks/useReferenceDetail";
import { useComments } from "@/hooks/comment/useComments";
import { useCreateComment } from "@/hooks/comment/useCreateComment";
import { useUpdateComment } from "@/hooks/comment/useUpdateComment";
import { useDeleteComment } from "@/hooks/comment/useDeleteComment";
import { useToggleReferenceLike } from "@/hooks/useToggleReferenceLike";
import { useToggleReferenceScrap } from "@/hooks/useToggleReferenceScrap";
import ChatInput from "@/components/chatbot/ChatInput";

export default function FeedDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const id = useMemo(() => {
    const n = Number(productId);
    return Number.isFinite(n) ? n : null;
  }, [productId]);

  const [isDescOpen, setIsDescOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const { data: reference, isLoading, error } = useReferenceDetail(id);

  const { data: commentList = [], isLoading: isCommentLoading } = useComments({
    type: "REFERENCE",
    commentableId: id,
  });

  const { mutate: createComment, isPending: isCreating } = useCreateComment();
  const { mutate: updateComment } = useUpdateComment();
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: toggleLike, isPending: isTogglingLike } =
    useToggleReferenceLike();
  const { mutate: toggleScrap, isPending: isTogglingScrap } =
    useToggleReferenceScrap();

  const handleSendComment = (message: string) => {
    if (id === null) return;

    createComment({
      commentableType: "REFERENCE",
      commentableId: id,
      content: message,
    });
  };

  const handleEditStart = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditContent(currentContent);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleEditSubmit = (commentId: number) => {
    if (!id) return;
    updateComment(
      {
        type: "REFERENCE",
        commentableId: id,
        commentId,
        content: editContent,
      },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditContent("");
        },
      },
    );
  };

  const handleDelete = (commentId: number) => {
    if (!id || !confirm("정말 삭제하시겠습니까?")) return;
    deleteComment({
      commentId,
      commentableType: "REFERENCE",
      commentableId: id,
    });
  };

  if (isLoading) {
    return (
      <div className="relative isolate pt-16 max-w-md mx-auto pb-24 bg-primary-50 text-primary-700">
        <p className="font-body2">레퍼런스 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !reference) {
    return (
      <div className="relative isolate pt-16 max-w-md mx-auto px-7 pb-24 bg-primary-50 text-primary-700">
        <p className="font-body2">레퍼런스 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const mainImage = reference.imageUrls?.[0] ?? "";
  const referenceItems = reference.referenceItems || [];

  return (
    <div className="relative isolate pt-16 max-w-md mx-auto px-5 pb-24 text-primary-700">
      <section>
        <div className="relative rounded-2xl aspect-4/3 overflow-hidden">
          {mainImage && (
            <img
              src={mainImage}
              alt={reference.name}
              className="w-full h-full object-cover"
            />
          )}
          <button
            type="button"
            aria-label="badge"
            className="absolute right-3 top-3"
          >
            <RoomeFillIcon />
          </button>
        </div>
      </section>

      <section className="mt-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="font-heading1">{reference.name}</h2>
          </div>

          <div className="flex items-center gap-1">
            <button type="button" aria-label="공유" className="p-2">
              <RoomeExport className="w-6 h-6 text-primary-700 fill-none" />
            </button>
            <button
              type="button"
              aria-label={reference.isScrapped ? "스크랩 취소" : "스크랩"}
              className="p-2"
              disabled={isTogglingScrap}
              onClick={() => toggleScrap(reference.referenceId)}
            >
              {reference.isScrapped ? (
                <BookmarkFillIcon className="w-6 h-6 text-primary-700" />
              ) : (
                <BookmarkIcon className="w-6 h-6 text-primary-50" />
              )}
            </button>
            <button
              type="button"
              aria-label={reference.isLiked ? "좋아요 취소" : "좋아요"}
              className="p-2"
              disabled={isTogglingLike}
              onClick={() => toggleLike(reference.referenceId)}
            >
              {reference.isLiked ? (
                <FavoriteFillIcon className="w-6 h-6 text-point" />
              ) : (
                <FavoriteIcon className="w-6 h-6 text-primary-50" />
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-15">
        <div className="flex items-center gap-3">
          {reference.userProfileUrl && (
            <img
              src={reference.userProfileUrl}
              alt={reference.userName}
              className="w-11 h-11 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-body1">{reference.userName}</p>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <p
          className={clsx(
            "font-body3 text-primary-700",
            isDescOpen ? "" : "line-clamp-2",
          )}
        >
          {reference.description}
        </p>

        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setIsDescOpen((prev) => !prev)}
            className="flex items-center gap-x-2 font-caption text-primary-700"
          >
            {isDescOpen ? (
              <>
                <ArrowUpIcon className="w-3 h-3" />
                <span>설명 접기</span>
              </>
            ) : (
              <>
                <ArrowDownIcon className="w-3 h-3" />
                <span>설명 더보기</span>
              </>
            )}
          </button>
        </div>
      </section>

      <section className="mt-15">
        <p className="mb-3 font-body3 text-primary-700">사용된 가구</p>
        {referenceItems.length === 0 ? (
          <p className="font-caption text-primary-400">관련 가구가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {referenceItems.slice(0, 6).map((item) => (
              <div
                key={item.productId}
                className="aspect-4/3 rounded-xl overflow-hidden bg-primary-200 cursor-pointer"
                onClick={() => navigate(`/shop/${item.productId}`)}
              >
                {item.thumbnailUrl && (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-15">
        <p className="mb-3 font-body3 text-primary-700">댓글</p>

        <ChatInput onSend={handleSendComment} disabled={isCreating} />

        {isCommentLoading ? (
          <p className="mt-3 font-caption text-primary-400">
            댓글을 불러오는 중...
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {commentList.map((c) => (
              <div
                key={String(c.id)}
                className="flex items-start gap-3 p-3 rounded-md bg-primary-200"
              >
                <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0">
                  <CommentLogo />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-caption-strong text-primary-700">
                      {c.nickname}
                    </p>
                    {c.isAuthor && editingCommentId !== c.id && (
                      <div className="flex gap-2 font-caption text-primary-500">
                        <button
                          onClick={() => handleEditStart(c.id, c.content)}
                        >
                          수정
                        </button>
                        <button onClick={() => handleDelete(c.id)}>삭제</button>
                      </div>
                    )}
                  </div>

                  {editingCommentId === c.id ? (
                    <div className="mt-1">
                      <input
                        className="w-full text-sm p-1 border rounded"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="flex gap-2 mt-2 font-caption justify-end">
                        <button onClick={handleEditCancel}>취소</button>
                        <button onClick={() => handleEditSubmit(c.id)}>
                          저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="font-caption text-primary-700 whitespace-pre-wrap leading-tight mt-0.5">
                      {c.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
