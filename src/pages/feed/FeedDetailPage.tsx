import { useState } from "react";
import BookMarkedIcon from "@/assets/icons/bookmark.svg?react";
import MoveIcon from "@/assets/icons/move.svg?react";
import FavoriteIcon from "@/assets/icons/navBar/favorite.svg?react";
import RoomeFillIcon from "@/assets/RoomeLogo/roome-fill.svg?react";

import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";
import clsx from "clsx";

export default function FeedDetailPage() {
  const [isDescOpen, setIsDescOpen] = useState(false);

  return (
    <div className="relative isolate pt-16 max-w-md mx-auto px-7 pb-24 bg-primary-50 text-primary-700">
      {/* 메인 이미지 */}
      <section>
        <div className="relative rounded-2xl bg-primary-200 aspect-[4/3] overflow-hidden">
          {/* 곰 아이콘 */}
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
            <h2 className="font-heading3">제목</h2>
            <p className="font-body2">₩10000</p>
          </div>

          {/* 액션 아이콘 */}
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

      {/* 작성자 정보 */}
      <section className="mt-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary-200" />
          <div>
            <p className="font-caption-strong">닉네임</p>
            <p className="font-body2 text-primary-400">간단한 설명</p>
          </div>
        </div>
      </section>

      {/* 기타 설명 */}
      <section className="mt-6">
        {/* 설명 텍스트*/}
        <p
          className={clsx(
            "mt-2 font-body2 text-primary-700",
            isDescOpen ? "" : "line-clamp-2"
          )}
        >
          Description text about something on this page that can be long or
          short. It can be pretty long and will be clamped to three lines in
          preview...
        </p>
        {/* 토글 */}
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

      {/* 관련 제품 - 레이아웃만 */}
      <section className="mt-10">
        <p className="mb-3 font-caption-strong text-primary-600">관련 제품들</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="aspect-[4/3] rounded-xl bg-primary-200" />
          <div className="aspect-[4/3] rounded-xl bg-primary-200" />
          <div className="aspect-[4/3] rounded-xl bg-primary-200" />
          <div className="aspect-[4/3] rounded-xl bg-primary-200" />
          <div className="aspect-[4/3] rounded-xl bg-primary-200" />
          <div className="aspect-[4/3] rounded-xl bg-primary-200" />
        </div>
      </section>

      {/* 관련 레퍼 - 레이아웃만 */}
      <section className="mt-10">
        <p className="mb-3 font-caption-strong text-primary-600">
          관련 레퍼런스들
        </p>

        <div className="grid grid-cols-3 gap-3">
          <div className="aspect-[4/3] rounded-xl bg-primary-200" />
          <div className="aspect-[4/3] rounded-xl bg-primary-200" />
          <div className="aspect-[4/3] rounded-xl bg-primary-200" />
          <div className="aspect-[4/3] rounded-xl bg-primary-200" />
          <div className="aspect-[4/3] rounded-xl bg-primary-200" />
          <div className="aspect-[4/3] rounded-xl bg-primary-200" />
        </div>
      </section>
    </div>
  );
}
