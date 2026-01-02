import InfiniteScrollGrid from "@/components/feed&shop/grid/InfiniteScrollGrid";
import PhotoCard from "@/components/feed&shop/grid/PhotoCard";

import ref1 from "@/assets/icons/bed.svg";
import ref2 from "@/assets/icons/desk.svg";
import ref3 from "@/assets/icons/light.svg";

export default function ReferenceBoardPage() {
  const dummyImages = [ref1, ref2, ref3];

  return (
    <div className="max-w-md mx-auto px-5 min-h-screen">
      <InfiniteScrollGrid
        items={dummyImages}
        keySelector={(_, i) => i}
        renderItem={(img) => (
          <PhotoCard
            id={0}
            title=""
            price={0}
            imageUrl={img}
            showInfo={false}
            liked={true}
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
