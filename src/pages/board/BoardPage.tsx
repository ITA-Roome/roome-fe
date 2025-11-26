import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import type { UserLikeProduct } from "@/types/user";
// import { UserApi } from "@/api/user";

import chat1 from "@/assets/icons/bed.svg";
import chat2 from "@/assets/icons/desk.svg";
import chat3 from "@/assets/icons/light.svg";

interface BoardItem {
  title: string;
  images: string[];
  path: string;
}

/**
 * Render the board overview page showing three clickable 2x2 preview cards for Likes, Consultations, and References.
 *
 * The component loads preview images on mount, builds three board sections (each limited to four images), and navigates to the corresponding board route when a card is clicked.
 *
 * @returns A JSX element containing the board overview with three clickable image-preview cards.
 */
export default function BoardPage() {
  const navigate = useNavigate();

  // const [likedProducts, setLikedProducts] = useState<UserLikeProduct[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [consultImages, setConsultImages] = useState<string[]>([]);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);

  useEffect(() => {
    fetchBoardData();
  }, []);

  const fetchBoardData = async () => {
    try {
      // 1️⃣ 좋아요 상품 API (아직 좋아요 기능이 없으므로 예시)
      // const liked = await UserApi.fetchUserLikedProducts();
      // setLikedProducts(liked.data?.userLikeProductList ?? []);
      setProductImages([chat1, chat2, chat3]);

      // 2️⃣ 상담 데이터 API (아직 없으므로 예시)
      // 실제 API 나오면 여기에 연결!
      setConsultImages([chat1, chat2, chat3, chat2]);

      // 3️⃣ 공유 레퍼런스 API (아직 없으므로 예시)
      setReferenceImages([chat1, chat2, chat3, chat1]);
    } catch (err) {
      console.error(err);
    }
  };

  // 좋아요 4개 이미지만 뽑기
  //const likePreview = likedProducts.slice(0, 4).map((p) => p.imageList?.[0]);

  // 전체 보드 구성
  const boards: BoardItem[] = [
    {
      title: "좋아요",
      // images: likePreview,
      images: productImages.slice(0, 4),
      path: "/board/like",
    },
    {
      title: "ROOME와의 상담",
      images: consultImages.slice(0, 4),
      path: "/board/chat",
    },
    {
      title: "내가 공유한 레퍼런스",
      images: referenceImages.slice(0, 4),
      path: "/board/reference",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative isolate pt-16 max-w-md mx-auto px-5">
        {/* 3개의 4칸 카드 */}
        <div className="grid grid-cols-2 gap-6">
          {boards.map((board) => (
            <div
              key={board.title}
              className="flex flex-col items-start cursor-pointer active:opacity-60 transition"
              onClick={() => navigate(board.path)}
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden grid grid-cols-2 grid-rows-2 gap-[1px] bg-[var(--color-primary-200)] border border-[var(--color-primary-700)]">
                {board.images.length > 0 ? (
                  board.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ))
                ) : (
                  <>
                    <div className="bg-[var(--color-primary-200)]" />
                    <div className="bg-[var(--color-primary-200)]" />
                    <div className="bg-[var(--color-primary-200)]" />
                    <div className="bg-[var(--color-primary-200)]" />
                  </>
                )}
              </div>

              <p className="mt-2 text-sm text-[#5D3C28]">{board.title}</p>
            </div>
          ))}
        </div>

        <div className="h-20" />
      </div>
    </div>
  );
}
