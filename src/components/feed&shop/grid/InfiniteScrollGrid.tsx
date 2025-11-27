import { ReactNode, useEffect, useRef } from "react";

type Props<T> = {
  items: T[];
  keySelector: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => ReactNode;

  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  loadMore: () => void | Promise<unknown>;

  className?: string;
  gap?: string;
  columns?: string;
  Skeletons?: ReactNode;
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
        if (!hasNextPage || isFetchingNextPage) return;
        void loadMore();
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.01,
      },
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
          {/* 뷰포트 트리거 */}
          <div ref={sentinelRef} className="h-1 col-span-full" />
        </>
      )}
    </div>
  );
}
