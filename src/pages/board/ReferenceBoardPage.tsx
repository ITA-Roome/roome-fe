import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserApi } from "@/api/user";
import { ReferenceApi } from "@/api/reference";
import type { UserUploadedReference } from "@/types/user";
import InfiniteScrollGrid from "@/components/feed&shop/grid/InfiniteScrollGrid";
import PhotoCard from "@/components/feed&shop/grid/PhotoCard";

export default function ReferenceBoardPage() {
  const navigate = useNavigate();
  const [references, setReferences] = useState<UserUploadedReference[]>([]);

  const fetchReferences = useCallback(async () => {
    try {
      const res = await UserApi.fetchUserUploadedReferences();

      if (!res.isSuccess || !res.data) {
        setReferences([]);
        return;
      }
      setReferences(res.data.userUploadedReferenceList ?? []);
    } catch (error) {
      console.error("내가 업로드한 레퍼런스 조회 실패", error);
      setReferences([]);
    }
  }, []);

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  const handleReferenceToggleLike = useCallback(async (referenceId: number) => {
    try {
      const res = await ReferenceApi.toggleReferenceLike(referenceId);
      setReferences((prev) =>
        prev.map((r) =>
          r.referenceId === referenceId
            ? { ...r, isLiked: res?.liked ?? r.isLiked }
            : r,
        ),
      );
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  }, []);

  return (
    <div className="max-w-md mx-auto px-5 min-h-screen">
      {references.length === 0 ? (
        <p className="py-16 text-center text-primary-700">
          공유한 레퍼런스가 없습니다!
        </p>
      ) : (
        <InfiniteScrollGrid
          items={references}
          keySelector={(it) => it.referenceId}
          renderItem={(it) => (
            <PhotoCard
              id={it.referenceId}
              title={it.name} // 필요하면 nickname으로 변경
              price={0}
              imageUrl={it.imageUrlList?.[0] ?? ""}
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

      <div className="h-20" />
    </div>
  );
}
