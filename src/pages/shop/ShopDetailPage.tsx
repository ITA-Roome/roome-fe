import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";

import BookmarkIcon from "@/assets/icons/bookmark.svg?react";
import BookmarkFillIcon from "@/assets/icons/bookmark-fill.svg?react";
import MoveIcon from "@/assets/icons/move.svg?react";
import FavoriteIcon from "@/assets/icons/navBar/favorite.svg?react";
import FavoriteFillIcon from "@/assets/icons/navBar/favorite-fill.svg?react";
import RoomeFillIcon from "@/assets/RoomeLogo/roome-fill.svg?react";
import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react";
import { useNavigate } from "react-router-dom";

import { useToggleProductLike } from "@/hooks/useToggleProductLike";
import { useToggleProductScrap } from "@/hooks/useToggleProductScrap";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useQuery } from "@tanstack/react-query";
import { ProductApi } from "@/api/product";

export default function ShopDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const id = useMemo(() => {
    const n = Number(productId);
    return Number.isFinite(n) ? n : null;
  }, [productId]);

  const [isDescOpen, setIsDescOpen] = useState(false);

  const { data: product, isLoading, error } = useProductDetail(id);

  const { mutate: toggleLike, isPending: isTogglingLike } =
    useToggleProductLike();
  const { mutate: toggleScrap, isPending: isTogglingScrap } =
    useToggleProductScrap();

  const { data: relatedReferencesData } = useQuery({
    queryKey: ["relatedReferences", id],
    queryFn: () => (id ? ProductApi.fetchRelatedReferences(id) : []),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="relative isolate pt-16 max-w-md mx-auto px-7 pb-24 text-primary-700">
        <p className="font-body2">상품 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="relative isolate pt-16 max-w-md mx-auto px-7 pb-24 text-primary-700">
        <p className="font-body2">상품 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const formattedPrice = product.price
    ? `₩${product.price.toLocaleString("ko-KR")}`
    : "가격 정보 없음";
  const relatedProducts = product.relatedProductList || [];

  const relatedReferences =
    relatedReferencesData?.map((ref) => ({
      id: ref.referenceId,
      thumbnailUrl: ref.thumbnailUrl,
    })) || [];

  return (
    <div className="relative isolate pt-16 max-w-md mx-auto px-7 pb-24 text-primary-700">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 max-w-md mx-auto px-5 bg-white/90 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-primary-700"
          aria-label="뒤로 가기"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-display text-2xl text-primary-700">
          ROOME
        </h1>
        <div className="w-10" />
      </header>

      <section>
        <div className="relative rounded-2xl aspect-4/3 overflow-hidden">
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

      <section className="mt-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="font-heading2 line-clamp-2 wrap-break-words">
              {product.name}
            </h2>
            <h2 className="font-heading1 line-clamp-2">{formattedPrice}</h2>
          </div>

          <div className="flex items-center gap-1">
            <button type="button" aria-label="공유" className="p-2">
              <MoveIcon className="w-5 h-5 text-primary-700 fill-none" />
            </button>
            <button
              type="button"
              aria-label={product.isScrapped ? "스크랩 취소" : "스크랩"}
              className="p-2"
              disabled={isTogglingScrap}
              onClick={() => toggleScrap(product.id)}
            >
              {product.isScrapped ? (
                <BookmarkFillIcon className="w-5 h-5 text-primary-700" />
              ) : (
                <BookmarkIcon className="w-5 h-5 text-primary-700" />
              )}
            </button>

            <button
              type="button"
              aria-label={product.isLiked ? "좋아요 취소" : "좋아요"}
              className="p-2"
              disabled={isTogglingLike}
              onClick={() => toggleLike(product.id)}
            >
              {product.isLiked ? (
                <FavoriteFillIcon className="w-5 h-5 text-primary-700" />
              ) : (
                <FavoriteIcon className="w-5 h-5 text-primary-700" />
              )}
            </button>
          </div>
        </div>
      </section>

      {product.shop && (
        <section className="mt-15">
          <div className="flex items-center gap-3">
            {product.shop.logoUrl && (
              <img
                src={product.shop.logoUrl}
                alt={product.shop.name}
                className="w-11 h-11 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-body1">{product.shop.name}</p>
            </div>
          </div>
        </section>
      )}

      <section className="mt-6">
        <p
          className={clsx(
            "mt-2 font-body3 text-primary-700",
            isDescOpen ? "" : "line-clamp-2",
          )}
        >
          {product.description}
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
        <p className="mb-3 font-body3 text-primary-700">관련 제품들</p>

        {relatedProducts.length === 0 ? (
          <p className="font-caption text-primary-400">관련 상품이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {relatedProducts.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="aspect-4/3 rounded-xl overflow-hidden bg-primary-200"
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

      <section className="mt-15">
        <p className="mb-3 font-body3 text-primary-700">관련 레퍼런스들</p>

        {relatedReferences.length === 0 ? (
          <p className="font-caption text-primary-400">
            관련 레퍼런스가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {relatedReferences.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="aspect-4/3 rounded-xl overflow-hidden bg-primary-200"
              >
                {item.thumbnailUrl && (
                  <img
                    src={item.thumbnailUrl}
                    alt="reference"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
