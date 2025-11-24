import InfiniteScrollGrid from "@/components/feed&shop/grid/InfiniteScrollGrid";
import ConsultCard from "@/components/board/ConsultCard";

import img1 from "@/assets/icons/bed.svg";
import img2 from "@/assets/icons/desk.svg";
import img3 from "@/assets/icons/light.svg";

interface ConsultItem {
  id: number;
  title: string;
  details: string[];
  images: string[];
}

/**
 * Renders the chat board page that displays consult items in an infinite-scroll grid.
 *
 * Uses a static list of dummy consult items and renders each item as a ConsultCard inside InfiniteScrollGrid.
 *
 * @returns The page's JSX element containing the consult list layout.
 */
export default function ChatBoardPage() {
  const dummyConsultItems: ConsultItem[] = [
    {
      id: 1,
      title: "침실 인테리어 상담",
      details: ["원목 느낌 원함", "침대 위치 조정 고민", "포근한 느낌 선호"],
      images: [img1, img2, img3, img1, img2, img3],
    },
    {
      id: 2,
      title: "거실 전체 톤 매칭",
      details: ["화이트톤 요청", "조명 교체 희망", "소파 색상 고민"],
      images: [img2, img3, img1, img2, img1, img3],
    },
    {
      id: 3,
      title: "작은 방 공간 활용 상담",
      details: ["책상 크기 고민", "수납공간 최적화", "조명 추천 요청"],
      images: [img3, img1, img2, img3, img2, img1],
    },
    {
      id: 4,
      title: "조명 변경 상담",
      details: [
        "은은한 조명 원함",
        "천장 간접조명 고민",
        "전구 색온도 추천 요청",
      ],
      images: [img1, img1, img1, img1, img2, img3],
    },
    {
      id: 5,
      title: "원룸 전체 레이아웃 재배치",
      details: ["침대 방향 고민", "책상 위치 변경", "동선 최적화 상담"],
      images: [img3, img2, img2, img1, img1, img1],
    },
  ];

  return (
    <div className="pt-16 max-w-md mx-auto px-5 min-h-screen space-y-6">
      <InfiniteScrollGrid
        items={dummyConsultItems}
        keySelector={(it) => it.id}
        renderItem={(it) => (
          <ConsultCard
            title={it.title}
            details={it.details}
            images={it.images}
          />
        )}
        columns="grid-cols-1"
        gap="gap-6"
        hasNextPage={false}
        loadMore={() => {}}
      />

      <div className="h-20" />
    </div>
  );
}
