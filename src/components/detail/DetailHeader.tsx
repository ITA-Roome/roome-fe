import BookmarkIcon from "@/assets/icons/bookmark.svg?react";
import BookmarkFillIcon from "@/assets/icons/bookmark-fill.svg?react";
import FavoriteIcon from "@/assets/icons/navBar/favorite.svg?react";
import FavoriteFillIcon from "@/assets/icons/navBar/favorite-fill.svg?react";
import RoomeExport from "@/assets/RoomeLogo/roome_export.svg?react";

interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  isLiked?: boolean;
  isScrapped?: boolean;
  isTogglingLike?: boolean;
  isTogglingScrap?: boolean;
  onToggleLike: () => void;
  onToggleScrap: () => void;
  onShare?: () => void;
}

export default function DetailHeader({
  title,
  subtitle,
  isLiked,
  isScrapped,
  isTogglingLike,
  isTogglingScrap,
  onToggleLike,
  onToggleScrap,
  onShare,
}: DetailHeaderProps) {
  return (
    <section className="mt-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="font-heading1 text-primary-700 wrap-break-words">
            {title}
          </h2>
          {subtitle && (
            <h2 className="font-heading1 text-primary-700 line-clamp-2 mt-1">
              {subtitle}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="공유"
            className="p-2"
            onClick={onShare}
          >
            <RoomeExport className="w-6 h-6 text-primary-700 fill-none" />
          </button>
          <button
            type="button"
            aria-label={isScrapped ? "스크랩 취소" : "스크랩"}
            className="p-2"
            disabled={isTogglingScrap}
            onClick={onToggleScrap}
          >
            {isScrapped ? (
              <BookmarkFillIcon className="w-6 h-6 text-primary-700" />
            ) : (
              <BookmarkIcon className="w-6 h-6 text-primary-50" />
            )}
          </button>
          <button
            type="button"
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
            className="p-2"
            disabled={isTogglingLike}
            onClick={onToggleLike}
          >
            {isLiked ? (
              <FavoriteFillIcon className="w-6 h-6 text-point" />
            ) : (
              <FavoriteIcon className="w-6 h-6 text-primary-50" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
