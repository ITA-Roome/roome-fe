import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// import type { UserLikeProduct } from "@/types/user";
import { UserApi } from "@/api/user";
import { ChatApi } from "@/api/chatbot";

import PageContainer from "@/components/layout/PageContainer";

interface BoardItem {
  title: string;
  images: string[];
  path: string;
}

export default function BoardPage() {
  const navigate = useNavigate();

  const [likePreviewImages, setLikePreviewImages] = useState<string[]>([]);
  const [consultImages, setConsultImages] = useState<string[]>([]);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);

  // 레퍼런스/제품 이미지 배열을 받아 4칸(2x2) 미리보기 조합
  const buildLikePreview = (refs: string[], prods: string[]) => {
    const refQueue = [...refs];
    const prodQueue = [...prods];

    // 상단 2칸: 레퍼런스 우선, 부족하면 제품으로 채움
    const top = refQueue.splice(0, 2);
    while (top.length < 2 && prodQueue.length) top.push(prodQueue.shift()!);

    // 하단 2칸: 제품 우선, 부족하면 남은 레퍼런스로 채움
    const bottom = prodQueue.splice(0, 2);
    while (bottom.length < 2 && refQueue.length) bottom.push(refQueue.shift()!);

    // 남은 슬록(총 4칸) 채우기: 레퍼런스 → 제품 순
    const preview = [...top, ...bottom];
    while (preview.length < 4 && (refQueue.length || prodQueue.length)) {
      if (refQueue.length) preview.push(refQueue.shift()!);
      else if (prodQueue.length) preview.push(prodQueue.shift()!);
    }

    return preview; // 길이가 0~4일 수 있음
  };

  const fetchBoardData = useCallback(async () => {
    try {
      // 제품 좋아요
      const prodRes = await UserApi.fetchUserScrapProducts();
      const prodImgs =
        prodRes.isSuccess && prodRes.data
          ? ((prodRes.data.userScrapProductList ?? [])
              .map((p) => p.imageList?.[0])
              .filter(Boolean) as string[])
          : [];

      // 레퍼런스 좋아요
      const refRes = await UserApi.fetchUserScrapReferences();
      const refImgs =
        refRes.isSuccess && refRes.data
          ? ((refRes.data.userScrapReferenceList ?? [])
              .map((r) => r.imageUrlList?.[0])
              .filter(Boolean) as string[])
          : [];

      // 좋아요 썸네일 4칸 조합
      setLikePreviewImages(buildLikePreview(refImgs, prodImgs));

      // 내가 공유한 레퍼런스
      const myRefRes = await UserApi.fetchUserUploadedReferences();
      const myRefImages =
        myRefRes.isSuccess && myRefRes.data
          ? ((myRefRes.data?.userUploadedReferenceList ?? [])
              .map((r) => r.imageUrlList?.[0])
              .filter(Boolean) as string[])
          : [];
      setReferenceImages(myRefImages.slice(0, 4));

      const chatRes = await ChatApi.getBoardList({
        page: 0,
        size: 20,
        sort: ["createdAt,desc"],
      });

      const chatList = Array.isArray(chatRes.data?.content)
        ? chatRes.data.content
        : [];

      const chatImages = chatRes.isSuccess
        ? (chatList
            .map(
              (b) => b.products?.[0]?.imageUrl ?? b.references?.[0]?.imageUrl,
            )
            .filter(Boolean) as string[])
        : [];
      setConsultImages(chatImages.slice(0, 4));
    } catch (err) {
      console.error(err);
      setReferenceImages([]);
      setLikePreviewImages([]);
      setConsultImages([]);
    }
  }, []);

  useEffect(() => {
    void fetchBoardData();
  }, [fetchBoardData]);

  // 전체 보드 구성
  const boards: BoardItem[] = [
    {
      title: "저장됨",
      images: likePreviewImages,
      path: "/board/like",
    },
    {
      title: "ROOME와의 상담",
      images: consultImages.slice(0, 4),
      path: "/board/chat",
    },
    {
      title: "내가 공유한 레퍼런스",
      images: referenceImages,
      path: "/board/reference",
    },
  ];

  return (
    <PageContainer>
      <div className="min-h-screen">
        <div className="relative isolate mt-5">
          {/* 3개의 4칸 카드 */}
          <div className="grid grid-cols-2 gap-6">
            {boards.map((board) => (
              <div
                key={board.title}
                className="flex flex-col items-start cursor-pointer active:opacity-60 transition"
                onClick={() => navigate(board.path)}
              >
                <div
                  className="w-full aspect-square rounded-2xl overflow-hidden border border-[var(--color-primary-700)] bg-white grid grid-cols-2 grid-rows-2"
                  style={{
                    backgroundImage: `
                      linear-gradient(var(--color-primary-700) 0 0),
                      linear-gradient(var(--color-primary-700) 0 0)
                    `,
                    backgroundSize: "1px 100%, 100% 1px",
                    backgroundPosition: "50% 0, 0 50%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
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
                      <div className="bg-white" />
                      <div className="bg-white" />
                      <div className="bg-white" />
                      <div className="bg-white" />
                    </>
                  )}
                </div>

                <p className="mt-2 text-sm text-[#5D3C28]">{board.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
