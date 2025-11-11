import TileSkeleton from "./TileSkeleton";

type GridSkeletonProps = {
  count?: number;
  aspect?: string;
};

export default function GridSkeleton({
  count = 9,
  aspect = "aspect-[3/4]",
}: GridSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TileSkeleton key={`skeleton-${i}`} aspect={aspect} />
      ))}
    </>
  );
}
