import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";

import BookMarkedIcon from "@/assets/icons/bookmark.svg?react";
import MoveIcon from "@/assets/icons/move.svg?react";
import FavoriteIcon from "@/assets/icons/navBar/favorite.svg?react";
import RoomeFillIcon from "@/assets/RoomeLogo/roome-fill.svg?react";
import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";

import type { ProductItem } from "@/types/product";
import type { CommonResponse } from "@/types/common";
import { ProductApi } from "@/api/product";

export default function FeedDetailPage() {
  const { productId } = useParams<{ productId: string }>();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) {
      setError("상품 ID가 없습니다.");
      setLoading(false);
      return;
    }

    const id = Number(productId);
    if (Number.isNaN(id)) {
      setError("유효하지 않은 상품 ID입니다.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchDetail = async () => {
      setLoading(true);
      setError("");

      try {
        const detailPayload: CommonResponse<ProductItem> =
          await ProductApi.fetchProductDetails(id);
        // console.log(detailPayload);

        if (!detailPayload.success || !detailPayload.data) {
          if (!cancelled) {
            setError(
              detailPayload.message ?? "상품 정보를 불러오지 못했습니다.",
            );
            setLoading(false);
          }
          return;
        }

        if (!cancelled) {
          setProduct(detailPayload.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("상품 상세 조회 실패:", err);
        if (!cancelled) {
          if (axios.isAxiosError(err)) {
            console.error("detail error response:", err.response?.data);
            setError("상품 정보를 불러오는 중 오류가 발생했습니다.");
          } else {
            setError("알 수 없는 오류가 발생했습니다.");
          }
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="relative isolate pt-16 max-w-md mx-auto px-7 pb-24 bg-primary-50 text-primary-700">
        <p className="font-body2">상품 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="relative isolate pt-16 max-w-md mx-auto px-7 pb-24 bg-primary-50 text-primary-700">
        <p className="font-body2">{error || "상품 정보를 찾을 수 없습니다."}</p>
      </div>
    );
  }

  return (
    <div className="relative isolate pt-16 max-w-md mx-auto px-7 pb-24 bg-primary-50 text-primary-700">
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

      {/* 제목 / 가격 / 액션 */}
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
            <button type="button" aria-label="좋아요" className="p-2">
              <FavoriteIcon className="w-5.5 h-5.5" />
            </button>
          </div>
        </div>
      </section>

      {/* TODO - shop 상세 조회*/}
      <section className="mt-10">
        <div className="flex items-center gap-3">
          {product.thumbnailUrl && (
            <img
              src={product.shop.logoUrl}
              alt={product.shop.name}
              className="w-11 h-11 rounded-full object-cover border border-primary-400"
            />
          )}

          <div>
            <p className="font-body2">{product.shop.name}</p>
            <p className="font-caption">간단한 설명</p>
          </div>
        </div>
      </section>

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

      {/* TODO: API 연결*/}
      <section className="mt-10">
        <p className="mb-3 font-body3 text-primary-700">관련 제품들</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="aspect-4/3 rounded-xl bg-primary-200" />
          <div className="aspect-4/3 rounded-xl bg-primary-200" />
          <div className="aspect-4/3 rounded-xl bg-primary-200" />
          <div className="aspect-4/3 rounded-xl bg-primary-200" />
          <div className="aspect-4/3 rounded-xl bg-primary-200" />
          <div className="aspect-4/3 rounded-xl bg-primary-200" />
        </div>
      </section>

      {/* TODO: API 연결*/}
      <section className="mt-10">
        <p className="mb-3 font-body3 text-primary-700">관련 레퍼런스들</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="aspect-4/3 rounded-xl bg-primary-200" />
          <div className="aspect-4/3 rounded-xl bg-primary-200" />
          <div className="aspect-4/3 rounded-xl bg-primary-200" />
          <div className="aspect-4/3 rounded-xl bg-primary-200" />
          <div className="aspect-4/3 rounded-xl bg-primary-200" />
          <div className="aspect-4/3 rounded-xl bg-primary-200" />
        </div>
      </section>
    </div>
  );
}
