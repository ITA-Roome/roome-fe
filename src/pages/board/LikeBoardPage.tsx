import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteScrollGrid from "@/components/feed&shop/grid/InfiniteScrollGrid";
import PhotoCard from "@/components/feed&shop/grid/PhotoCard";
import TabMenu from "@/components/board/TabMenu";
import { UserApi } from "@/api/user";
import type { UserScrapProduct, UserScrapReference } from "@/types/user";
import { ProductApi } from "@/api/product";
import { ReferenceApi } from "@/api/reference";
import PageContainer from "@/components/layout/PageContainer";

export default function LikeBoardPage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<"reference" | "product">("reference");
  const [scrapProducts, setScrapProducts] = useState<UserScrapProduct[]>([]);
  const [scrapReferences, setScrapReferences] = useState<UserScrapReference[]>(
    [],
  );

  const fetchScrapProducts = useCallback(async () => {
    try {
      const res = await UserApi.fetchUserScrapProducts();

      if (!res.isSuccess || !res.data) {
        console.error("좋아요 상품 조회 실패:", res.message);
        setScrapProducts([]);
        return;
      }

      setScrapProducts(res.data.userScrapProductList ?? []);
    } catch (error) {
      console.error("좋아요 상품 조회 중 오류:", error);
    }
  }, []);

  const fetchScrapReferences = useCallback(async () => {
    try {
      const res = await UserApi.fetchUserScrapReferences();
      if (!res.isSuccess || !res.data) {
        console.error("좋아요 레퍼런스 조회 실패:", res.message);
        setScrapReferences([]);
        return;
      }

      setScrapReferences(res.data.userScrapReferenceList ?? []);
    } catch (err) {
      console.error("좋아요 레퍼런스 조회 중 오류:", err);
    }
  }, []);

  useEffect(() => {
    fetchScrapProducts();
    fetchScrapReferences();
  }, [fetchScrapProducts, fetchScrapReferences]);

  const handleProductToggleLike = useCallback(async (productId: number) => {
    try {
      const res = await ProductApi.toggleProductLike(productId);
      setScrapProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, isLiked: res?.liked ?? p.isLiked } : p,
        ),
      );
    } catch (error) {
      console.error("좋아요 토글 실패: ", error);
    }
  }, []);

  const handleReferenceToggleLike = useCallback(async (referenceId: number) => {
    try {
      const res = await ReferenceApi.toggleReferenceLike(referenceId);
      setScrapReferences((prev) =>
        prev.map((p) =>
          p.referenceId === referenceId
            ? { ...p, isLiked: res?.liked ?? p.isLiked }
            : p,
        ),
      );
    } catch (error) {
      console.error("좋아요 토글 실패: ", error);
    }
  }, []);

  return (
    <PageContainer className="h-dvh">
      <div className="flex h-full flex-col overflow-hidden">
        <div className="shrink-0">
          <TabMenu tab={tab} onChange={setTab} />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {tab === "product" && (
            <>
              {scrapProducts.length === 0 ? (
                <p className="py-16 text-center text-primary-700">
                  스크랩한 상품이 없습니다!
                </p>
              ) : (
                <InfiniteScrollGrid
                  items={scrapProducts}
                  keySelector={(it) => it.id}
                  renderItem={(it) => (
                    <PhotoCard
                      id={it.id}
                      title={it.name}
                      price={it.price}
                      imageUrl={it.imageList?.[0]}
                      isLiked={it.isLiked}
                      onLike={() => handleProductToggleLike(it.id)}
                      showInfo={true}
                      onClick={() => navigate(`/shop/${it.id}`)}
                    />
                  )}
                  columns="grid-cols-3"
                  gap="gap-4"
                  hasNextPage={false}
                  loadMore={() => {}}
                />
              )}
            </>
          )}

          {tab === "reference" && (
            <>
              {scrapReferences.length === 0 ? (
                <p className="py-16 text-center text-primary-700">
                  스크랩한 레퍼런스가 없습니다!
                </p>
              ) : (
                <InfiniteScrollGrid
                  items={scrapReferences}
                  keySelector={(it) => it.referenceId}
                  renderItem={(it) => (
                    <PhotoCard
                      id={it.referenceId}
                      title={it.nickname}
                      price={0}
                      imageUrl={it.imageUrlList?.[0]}
                      isLiked={it.isLiked}
                      onLike={() => handleReferenceToggleLike(it.referenceId)}
                      showInfo={false}
                      onClick={() => navigate(`/feed/${it.referenceId}`)}
                    />
                  )}
                  columns="grid-cols-3"
                  gap="gap-4"
                  hasNextPage={false}
                  loadMore={() => {}}
                />
              )}
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
