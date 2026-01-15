import { useCallback, useEffect, useState } from "react";
import InfiniteScrollGrid from "@/components/feed&shop/grid/InfiniteScrollGrid";
import PageContainer from "@/components/layout/PageContainer";
import { ChatApi } from "@/api/chatbot";
import type { BoardItem, ChatMoodResult, ChatProduct } from "@/types/chatbot";
import MoodCard from "@/components/chatbot/MoodCard";
import ProductCard from "@/components/chatbot/ProductCard";

const isProductBoard = (item: BoardItem) =>
  item.category === "PRODUCT" || (item.products ?? []).length > 0;

const toMoodResult = (item: BoardItem): ChatMoodResult => ({
  title: item.title ?? "인테리어 추천",
  referenceIdList: (item.references ?? []).map((ref) => ref.referenceId),
  imageUrlList: (item.references ?? []).map((ref) => ref.imageUrl),
  moodDescription: item.description ?? "",
  moodKeywords: item.keywords ?? [],
  summary: item.description ?? "",
});

const toProducts = (item: BoardItem): ChatProduct[] =>
  (item.products ?? []).map((product) => ({
    productId: product.productId,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    reason: product.reason,
    advantage: product.advantage,
    mood: product.mood,
    recommendedPlace: product.recommendedPlace,
  }));

export default function ChatBoardPage() {
  const [boards, setBoards] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ChatApi.getBoardList({
        page: 0,
        size: 20,
        sort: ["createdAt,desc"],
      });

      if (!res.isSuccess || !res.data) {
        console.error("상담 보드 조회 실패", res.message);
        setBoards([]);
        return;
      }

      const list = Array.isArray(res.data.content) ? res.data.content : [];
      setBoards(list);
    } catch (error) {
      console.error("상담 보드 조회 오류:", error);
      setBoards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBoards();
  }, [fetchBoards]);

  return (
    <PageContainer>
      <div className="min-h-screen space-y-6">
        {loading && (
          <p className="py-8 text-center text-primary-700">불러오는 중...</p>
        )}

        {!loading && boards.length === 0 && (
          <p className="py-16 text-center text-primary-700">
            저장된 상담이 없습니다!
          </p>
        )}

        {boards.length > 0 && (
          <InfiniteScrollGrid
            items={boards}
            keySelector={(it) => it.boardId}
            renderItem={(it) =>
              isProductBoard(it) ? (
                <div className="space-y-2">
                  <p className="font-semibold text-primary-700">{it.title}</p>
                  {toProducts(it).map((p) => (
                    <ProductCard key={p.productId} product={p} />
                  ))}
                </div>
              ) : (
                <MoodCard data={toMoodResult(it)} />
              )
            }
            columns="grid-cols-1"
            gap="gap-6"
            hasNextPage={false}
            loadMore={() => {}}
          />
        )}
      </div>
    </PageContainer>
  );
}
