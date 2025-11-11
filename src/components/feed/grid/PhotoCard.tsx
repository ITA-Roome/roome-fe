import FavoriteIcon from "@/assets/icons/navBar/favorite.svg?react";
import FavoriteFillIcon from "@/assets/icons/navBar/favorite-fill.svg?react";
import { useState } from "react";

type PhotoCardProps = {
  id: number;
  title: string;
  imageUrl: string;
  price: number;
  subtitle?: string;
  onClick?: () => void; // 추후 상세 이동 구현 예정
  defaultLiked?: boolean;
  showInfo?: boolean; // 제품 정보 표시 여부
};

export default function PhotoCard({
  title,
  price,
  imageUrl,
  onClick,
  defaultLiked = false,
  showInfo = true,
}: PhotoCardProps) {
  const [liked, setLiked] = useState(defaultLiked);

  return (
    <div className="w-full">
      {/* 제품 이미지 */}
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
        className="relative rounded-xl aspect-[3/4] overflow-hidden border border-primary-400"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full" />
        )}

        {/* 하트 */}
        <button
          type="button"
          className="absolute right-2 bottom-2 transition-transform"
          aria-label={liked ? "unlike" : "like"}
          onClick={(e) => {
            e.stopPropagation();
            setLiked((p) => !p);
          }}
        >
          {liked ? (
            <FavoriteFillIcon className="w-5 h-5 text-primary-700" />
          ) : (
            <FavoriteIcon className="w-5 h-5 text-primary-700" />
          )}
        </button>
      </div>
      {/* 제품 정보 */}
      {showInfo && (
        <div className="mt-1">
          {title && (
            <p className="font-caption truncate text-primary-700">{title}</p>
          )}
          {price != null && (
            <p className="-mt-2 font-caption text-primary-700">
              ₩{Number(price).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
