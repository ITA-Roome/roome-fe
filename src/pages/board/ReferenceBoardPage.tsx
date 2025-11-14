import InfiniteScrollGrid from "@/components/feed&shop/grid/InfiniteScrollGrid";
import PhotoCard from "@/components/feed&shop/grid/PhotoCard";

import ref1 from "@/assets/icons/bed.svg";
import ref2 from "@/assets/icons/desk.svg";
import ref3 from "@/assets/icons/light.svg";

/**
 * Renders a reference board page that displays three dummy images in a three-column grid.
 *
 * @returns A JSX element containing the page layout with a header and an InfiniteScrollGrid of PhotoCard items.
 */
export default function ReferenceBoardPage() {
  // 더미 3개
  const dummyImages = [ref1, ref2, ref3];

  return (
    <div className="pt-16 max-w-md mx-auto px-5 min-h-screen">
      <h2 className="text-center text-primary-700 font-semibold mb-4">
        내가 공유한 레퍼런스
      </h2>

      <InfiniteScrollGrid
        items={dummyImages}
        keySelector={(_, i) => i}
        renderItem={(img) => (
          <PhotoCard
            id={0}
            title=""
            price={0}
            imageUrl={img}
            showInfo={false} // 제품 정보 숨기기
            defaultLiked={true} // 좋아요 하트 고정
          />
        )}
        columns="grid-cols-3"
        gap="gap-4"
        hasNextPage={false}
        loadMore={() => {}}
      />

      <div className="h-20" />
    </div>
  );
}