import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";

import BookMarkedIcon from "@/assets/icons/bookmark.svg?react";
import MoveIcon from "@/assets/icons/move.svg?react";
import FavoriteIcon from "@/assets/icons/navBar/favorite.svg?react";
import FavoriteFillIcon from "@/assets/icons/navBar/favorite-fill.svg?react";
import RoomeFillIcon from "@/assets/RoomeLogo/roome-fill.svg?react";
import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";
import CommentIogo from "@/assets/RoomeLogo/comment_lcon.svg?react";

import { useProductDetail } from "@/hooks/useProductDetail";
import { useToggleProductLike } from "@/hooks/useToggleProductLike";
import type { ProductOrder } from "@/hooks/useInfiniteScroll";
import { useComments } from "@/hooks/comment/useComments";
import { useCreateComment } from "@/hooks/comment/useCreateComment";

import ChatInput from "@/components/chatbot/ChatInput";

export default function FeedDetailPage() {
  const { productId } = useParams<{ productId: string }>();

  const id = useMemo(() => {
    const n = Number(productId);
    return Number.isFinite(n) ? n : null;
  }, [productId]);

  const [isDescOpen, setIsDescOpen] = useState(false);

  const search = "";
  const order: ProductOrder = "LATEST";
  const limit = 21;

  const { data: product, isLoading, error } = useProductDetail(id);

  const { data: commentList = [], isLoading: isCommentLoading } = useComments({
    type: "PRODUCT",
    commentableId: id,
  });

  const { mutate: createComment, isPending: isCreating } = useCreateComment();

  const { mutate: toggleLike, isPending: isToggling } = useToggleProductLike({
    search,
    order,
    limit,
  });

  const handleSendComment = (message: string) => {
    if (id === null) return;

    createComment({
      commentableType: "PRODUCT",
      commentableId: id,
      content: message,
    });
  };

  if (isLoading) {
    return (
      <div className="relative isolate pt-16 max-w-md mx-auto pb-24 bg-primary-50 text-primary-700">
        <p className="font-body2">상품 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="relative isolate pt-16 max-w-md mx-auto px-7 pb-24 bg-primary-50 text-primary-700">
        <p className="font-body2">상품 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const relatedProducts = product.relatedProductList || [];

  return (
    <div className="relative isolate pt-16 max-w-md mx-auto px-5 pb-24 bg-primary-50 text-primary-700">
      <section>
        <div className="relative rounded-2xl aspect-4/3 overflow-hidden border border-primary-400">
          {product.thumbnailUrl && (
            <img
              src={product.thumbnailUrl}
              alt={product.name}
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

      {/* 제목 / 액션 */}
      <section className="mt-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="font-body1 line-clamp-2">{product.name}</h2>
          </div>

          <div className="flex items-center gap-1">
            <button type="button" aria-label="공유" className="p-2">
              <MoveIcon className="w-5 h-5 text-primary-700 fill-none" />
            </button>
            <button type="button" aria-label="저장" className="p-2">
              <BookMarkedIcon className="w-5 h-5 text-primary-700" />
            </button>
            <button
              type="button"
              aria-label={product.liked ? "좋아요 취소" : "좋아요"}
              className="p-2"
              disabled={isToggling}
              onClick={() => toggleLike(product.id)}
            >
              {product.liked ? (
                <FavoriteFillIcon className="w-5 h-5 text-primary-700" />
              ) : (
                <FavoriteIcon className="w-5 h-5 text-primary-700" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 샵 정보 */}
      <section className="mt-10">
        <div className="flex items-center gap-3">
          {product.shop?.logoUrl && (
            <img
              src={product.shop.logoUrl}
              alt={product.shop?.name ?? "shop"}
              className="w-11 h-11 rounded-full object-cover border border-primary-400"
            />
          )}
          <div>
            <p className="font-body2">{product.shop?.name ?? ""}</p>
            <p className="font-caption">간단한 설명</p>
          </div>
        </div>
      </section>

      {/* 제품 설명 */}
      <section className="mt-6">
        <p
          className={clsx(
            "mt-2 font-body2 text-primary-700",
            isDescOpen ? "" : "line-clamp-2",
          )}
        >
          {product.description}
        </p>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setIsDescOpen((prev) => !prev)}
            className="flex items-center gap-x-2 font-caption-strong text-primary-700"
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

      {/* 관련 제품 */}
      <section className="mt-10">
        <p className="mb-3 font-body3 text-primary-700">관련 제품들</p>
        {relatedProducts.length === 0 ? (
          <p className="font-caption text-primary-400">관련 상품이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {relatedProducts.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="aspect-4/3 rounded-xl overflow-hidden bg-primary-200 border border-primary-400"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 댓글 */}
      <section className="mt-10">
        <p className="mb-3 font-body3 text-primary-700">댓글</p>

        <ChatInput
          onSend={handleSendComment}
          placeholder="댓글을 입력하세요"
          disabled={isCreating}
        />

        {isCommentLoading ? (
          <p className="mt-3 font-caption text-primary-400">
            댓글을 불러오는 중...
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {commentList.map((c) => (
              <div
                key={String(c.id)}
                className="flex items-center gap-3 h-13 rounded-md bg-primary-200 px-4"
              >
                <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center">
                  <CommentIogo />
                </div>

                <div className="min-w-0 self-start pt-0.5 leading-none">
                  <p className="font-caption text-primary-700 leading-none">
                    {c.nickname}
                  </p>
                  <p className="font-caption text-primary-700/90 -mt-0.5 line-clamp-1">
                    {c.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
