import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommentLogo from "@/assets/RoomeLogo/comment_icon.svg?react";

import { useReferenceDetail } from "@/hooks/useReferenceDetail";
import { useComments } from "@/hooks/comment/useComments";
import { useCreateComment } from "@/hooks/comment/useCreateComment";
import { useUpdateComment } from "@/hooks/comment/useUpdateComment";
import { useDeleteComment } from "@/hooks/comment/useDeleteComment";
import { useToggleReferenceLike } from "@/hooks/useToggleReferenceLike";
import { useToggleReferenceScrap } from "@/hooks/useToggleReferenceScrap";
import ChatInput from "@/components/chatbot/ChatInput";

import PageContainer from "@/components/layout/PageContainer";
import DetailImage from "@/components/detail/DetailImage";
import DetailHeader from "@/components/detail/DetailHeader";
import DetailProfile from "@/components/detail/DetailProfile";
import DetailDescription from "@/components/detail/DetailDescription";
import DetailRelatedGrid from "@/components/detail/DetailRelatedGrid";

export default function FeedDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const id = useMemo(() => {
    const n = Number(productId);
    return Number.isFinite(n) ? n : null;
  }, [productId]);

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
      <PageContainer className="bg-primary-50 text-primary-700">
        <p className="font-body2">레퍼런스 정보를 불러오는 중입니다...</p>
      </PageContainer>
    );
  }

  if (error || !reference) {
    return (
      <PageContainer className="bg-primary-50 text-primary-700">
        <p className="font-body2">레퍼런스 정보를 찾을 수 없습니다.</p>
      </PageContainer>
    );
  }

  const mainImage = reference.imageUrls?.[0] ?? "";
  const referenceItems = reference.referenceItems || [];

  return (
    <PageContainer>
      <DetailImage src={mainImage} alt={reference.name} showBadge={true} />

      <DetailHeader
        title={reference.name}
        isLiked={reference.isLiked}
        isScrapped={reference.isScrapped}
        isTogglingLike={isTogglingLike}
        isTogglingScrap={isTogglingScrap}
        onToggleLike={() => toggleLike(reference.referenceId)}
        onToggleScrap={() => toggleScrap(reference.referenceId)}
        onShare={() => navigate("/chat", { state: { resetChat: true } })}
      />

      <DetailProfile
        name={reference.userName}
        imageUrl={reference.userProfileUrl}
      />

      <DetailDescription description={reference.description} />

      <DetailRelatedGrid
        title="사용된 가구"
        items={referenceItems.map((item) => ({
          id: item.productId,
          imageUrl: item.thumbnailUrl,
          name: item.productName,
        }))}
        emptyMessage="관련 가구가 없습니다."
        onItemClick={(productId) => navigate(`/shop/${productId}`)}
      />

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
                className="flex items-start gap-3 p-3 rounded-md bg-primary-50"
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
                    <div className="mt-2">
                      <textarea
                        className="w-full h-24 p-3 border border-primary-200 rounded-lg resize-none focus:outline-none focus:border-primary-500 font-body3 text-primary-700 bg-white"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="댓글을 입력해주세요"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={handleEditCancel}
                          className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded text-xs font-medium"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => handleEditSubmit(c.id)}
                          className="px-3 py-1.5 bg-primary-700 text-white rounded text-xs font-medium"
                        >
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
    </PageContainer>
  );
}
