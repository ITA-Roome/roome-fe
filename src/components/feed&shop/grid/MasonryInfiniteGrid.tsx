import { ReactNode, useEffect, useRef, useMemo } from "react";

type Props<T> = {
  items: T[];
  keySelector: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => ReactNode;

  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  loadMore: () => void | Promise<unknown>;

  className?: string;
  gap?: string;
  Skeletons?: ReactNode;
};

export default function MasonryInfiniteGrid<T>({
  items,
  keySelector,
  renderItem,
  hasNextPage = false,
  isFetchingNextPage = false,
  loadMore,
  className = "",
  gap = "gap-3",
  Skeletons,
}: Props<T>) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { col1, col2 } = useMemo(() => {
    const c1: T[] = [];
    const c2: T[] = [];
    items.forEach((item, i) => {
      if (i % 2 === 0) c1.push(item);
      else c2.push(item);
    });
    return { col1: c1, col2: c2 };
  }, [items]);

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
    <div className={`relative ${className}`}>
      <div className={`flex items-start ${gap}`}>
        <div className={`flex-1 flex flex-col ${gap}`}>
          {col1.map((item, i) => {
            const originalIndex = i * 2;
            return (
              <div key={keySelector(item, originalIndex)}>
                {renderItem(item, originalIndex)}
              </div>
            );
          })}
        </div>
        <div className={`flex-1 flex flex-col ${gap}`}>
          {col2.map((item, i) => {
            const originalIndex = i * 2 + 1;
            return (
              <div key={keySelector(item, originalIndex)}>
                {renderItem(item, originalIndex)}
              </div>
            );
          })}
        </div>
      </div>
      {(isFetchingNextPage || hasNextPage) && (
        <div className="mt-4">
          {isFetchingNextPage && (Skeletons ?? <div className="h-24" />)}
          <div ref={sentinelRef} className="h-1" />
        </div>
      )}
    </div>
  );
}
