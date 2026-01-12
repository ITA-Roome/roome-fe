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
import BottomSheet from "@/components/common/BottomSheet";

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
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

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
    setIsEditSheetOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditSheetOpen(false);
    setTimeout(() => {
      setEditingCommentId(null);
      setEditContent("");
    }, 200);
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
          setIsEditSheetOpen(false);
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
        onShare={() => {}}
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

                  <p className="font-caption text-primary-700 whitespace-pre-wrap leading-tight mt-0.5">
                    {c.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <BottomSheet
        isOpen={isEditSheetOpen}
        onClose={handleEditCancel}
        className="pb-8"
      >
        <div className="flex flex-col gap-4">
          <h3 className="font-heading3 text-primary-700">댓글 수정</h3>
          <textarea
            className="w-full h-32 p-3 border border-primary-200 rounded-lg resize-none focus:outline-none focus:border-primary-500 font-body3 text-primary-700"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="댓글을 입력해주세요"
          />
          <div className="flex gap-3">
            <button
              onClick={handleEditCancel}
              className="flex-1 py-3 bg-primary-100 text-primary-700 rounded-lg font-body2"
            >
              취소
            </button>
            <button
              onClick={() =>
                editingCommentId && handleEditSubmit(editingCommentId)
              }
              className="flex-1 py-3 bg-primary-700 text-white rounded-lg font-body2"
            >
              저장
            </button>
          </div>
        </div>
      </BottomSheet>
    </PageContainer>
  );
}
