import { useState, useEffect, useCallback } from "react";
import InfiniteScrollGrid from "@/components/feed&shop/grid/InfiniteScrollGrid";
import PhotoCard from "@/components/feed&shop/grid/PhotoCard";
import TabMenu from "@/components/board/TabMenu";
import { UserApi } from "@/api/user";
import type { UserLikeProduct, UserLikeReference } from "@/types/user";
import { ProductApi } from "@/api/product";

export default function LikeBoardPage() {
  const [tab, setTab] = useState<"reference" | "product">("reference");
  const [likedProducts, setLikedProducts] = useState<UserLikeProduct[]>([]);
  const [likedReferences, setLikedReferences] = useState<UserLikeReference[]>(
    [],
  );

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

  const fetchLikedReferences = useCallback(async () => {
    try {
      const res = await UserApi.fetchUserLikedReferences();
      if (!res.isSuccess || !res.data) {
        console.error("좋아요 레퍼런스 조회 실패:", res.message);
        setLikedReferences([]);
        return;
      }

      setLikedReferences(res.data.userLikeReferenceList ?? []);
    } catch (err) {
      console.error("좋아요 레퍼런스 조회 중 오류:", err);
    }
  }, []);

  useEffect(() => {
    fetchLikedProducts();
    fetchLikedReferences();
  }, [fetchLikedProducts, fetchLikedReferences]);

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
    <div className="max-w-md mx-auto px-5 min-h-screen">
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
          items={likedReferences}
          keySelector={(it) => it.referenceId}
          renderItem={(it) => (
            <PhotoCard
              id={it.referenceId}
              title={it.nickname}
              price={0}
              imageUrl={it.imageUrlList?.[0]}
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
