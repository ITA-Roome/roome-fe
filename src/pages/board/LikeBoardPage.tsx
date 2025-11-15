import { useState, useEffect, useCallback } from "react";
import InfiniteScrollGrid from "@/components/feed&shop/grid/InfiniteScrollGrid";
import PhotoCard from "@/components/feed&shop/grid/PhotoCard";
import TabMenu from "@/components/board/TabMenu";
import type { UserLikeProduct } from "@/types/user";

import ref1 from "@/assets/icons/bed.svg";
import ref2 from "@/assets/icons/desk.svg";
import ref3 from "@/assets/icons/light.svg";

/**
 * Like-board page that shows either liked reference images or liked products in a tabbed grid.
 *
 * Renders a TabMenu to switch between "reference" and "product" views and an InfiniteScrollGrid
 * populated with either predefined reference images or a static list of liked products.
 *
 * @returns The page's JSX element containing the tab menu and the grid for the active tab.
 */
export default function LikeBoardPage() {
  const [tab, setTab] = useState<"reference" | "product">("reference");
  const [likedProducts, setLikedProducts] = useState<UserLikeProduct[]>([]);
  const [referenceImages] = useState<string[]>([ref1, ref2, ref3]);

  // ⭐ fetchLikedProducts 내부에 dummy 배열 이동 → ESLint 해결
  const fetchLikedProducts = useCallback(() => {
    const dummy: UserLikeProduct[] = [
      {
        id: 1,
        name: "침대",
        price: 120000,
        description: "",
        category: "BEDROOM_BED",
        productUrl: "",
        thumbnailKey: "",
        imageList: [ref1],
        tagList: [],
        createdAt: "",
        updatedAt: "",
      },
      {
        id: 2,
        name: "책상",
        price: 90000,
        description: "",
        category: "LIVING_DESK",
        productUrl: "",
        thumbnailKey: "",
        imageList: [ref2],
        tagList: [],
        createdAt: "",
        updatedAt: "",
      },
      {
        id: 3,
        name: "조명",
        price: 40000,
        description: "",
        category: "LIVING_LIGHT",
        productUrl: "",
        thumbnailKey: "",
        imageList: [ref3],
        tagList: [],
        createdAt: "",
        updatedAt: "",
      },
    ];

    setLikedProducts(dummy);
  }, []);

  useEffect(() => {
    fetchLikedProducts();
  }, [fetchLikedProducts]);

  return (
    <div className="pt-16 max-w-md mx-auto px-5 min-h-screen">
      <TabMenu tab={tab} onChange={setTab} />

      {tab === "product" && (
        <InfiniteScrollGrid
          items={likedProducts}
          keySelector={(it) => it.id}
          renderItem={(it) => (
            <PhotoCard
              id={it.id}
              title={it.name}
              price={it.price}
              imageUrl={it.imageList?.[0]}
              showInfo={true}
              defaultLiked={true}
            />
          )}
          columns="grid-cols-3"
          gap="gap-4"
          hasNextPage={false}
          loadMore={() => {}}
        />
      )}

      {tab === "reference" && (
        <InfiniteScrollGrid
          items={referenceImages}
          keySelector={(_, i) => i}
          renderItem={(img) => (
            <PhotoCard
              id={0}
              title=""
              price={0}
              imageUrl={img}
              showInfo={false}
              defaultLiked={true}
            />
          )}
          columns="grid-cols-3"
          gap="gap-4"
          hasNextPage={false}
          loadMore={() => {}}
        />
      )}
    </div>
  );
}