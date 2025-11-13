import { ReactNode, useEffect, useRef } from "react";

type Props<T> = {
  items: T[];
  keySelector: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => ReactNode;

  // 인피니트 관련
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  loadMore: () => void | Promise<unknown>;

  // 스타일 옵션
  className?: string;
  gap?: string; // ex) "gap-3"
  columns?: string; // ex) "grid-cols-3"
  Skeletons?: ReactNode; // 로딩 플레이스홀더
};

export default function InfiniteScrollGrid<T>({
  items,
  keySelector,
  renderItem,
  hasNextPage = false,
  isFetchingNextPage = false,
  loadMore,
  className = "",
  gap = "gap-3",
  columns = "grid-cols-3",
  Skeletons,
}: Props<T>) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const el = sentinelRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        if (!hasNextPage || isFetchingNextPage) return; // 중복 요청 방지
        // 다음 페이지 로드
        void loadMore();
      },
      {
        root: null,
        rootMargin: "200px", // 미리 당겨서 로드
        threshold: 0.01,
      }
    );

    io.observe(el);
    return () => io.unobserve(el);
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  return (
    <div className={`grid ${columns} ${gap} ${className}`}>
      {items.map((it, i) => (
        <div key={keySelector(it, i)}>{renderItem(it, i)}</div>
      ))}

      {(isFetchingNextPage || hasNextPage) && (
        <>
          {isFetchingNextPage && (Skeletons ?? <div className="h-24" />)}
          {/* 이 ref가 뷰포트에 들어오면 loadMore 트리거 */}
          <div ref={sentinelRef} className="h-1 col-span-full" />
        </>
      )}
    </div>
  );
}
