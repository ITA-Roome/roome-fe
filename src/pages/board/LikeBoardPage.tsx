import { useState, useEffect, useCallback } from "react";
import InfiniteScrollGrid from "@/components/feed&shop/grid/InfiniteScrollGrid";
import PhotoCard from "@/components/feed&shop/grid/PhotoCard";
import TabMenu from "@/components/board/TabMenu";
import { UserApi } from "@/api/user";
import type { UserLikeProduct } from "@/types/user";
import { ProductApi } from "@/api/product";

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

  const fetchLikedProducts = useCallback(async () => {
    try {
      const res = await UserApi.fetchUserLikedProducts();

      if (!res.isSuccess || !res.data) {
        console.error("좋아요 상품 조회 실패:", res.message);
        setLikedProducts([]);
        return;
      }

      setLikedProducts(res.data.userLikeProductList ?? []);
    } catch (error) {
      console.error("좋아요 상품 조회 중 오류:", error);
    }
  }, []);

  useEffect(() => {
    fetchLikedProducts();
  }, [fetchLikedProducts]);

  const handleToggleLike = useCallback(async (productId: number) => {
    try {
      const res = await ProductApi.toggleProductLike(productId);
      if (!res?.liked) {
        setLikedProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (error) {
      console.error("좋아요 토글 실패: ", error);
    }
  }, []);

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
              liked={true}
              onToggleLike={handleToggleLike}
              showInfo={true}
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
              liked={true}
              showInfo={false}
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
