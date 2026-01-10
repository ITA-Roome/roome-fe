import TileSkeleton from "./TileSkeleton";

type GridSkeletonProps = {
  count?: number;
  aspect?: string;
  columns?: string;
  gap?: string;
};

export default function GridSkeleton({
  count = 9,
  aspect = "aspect-[3/4]",
  columns = "grid-cols-2",
  gap = "gap-4",
}: GridSkeletonProps) {
  return (
    <div className={`grid ${columns} ${gap} w-full`}>
      {Array.from({ length: count }).map((_, i) => (
        <TileSkeleton key={`skeleton-${i}`} aspect={aspect} />
      ))}
    </div>
  );
}
