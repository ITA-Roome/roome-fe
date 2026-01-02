type TileSkeletonProps = {
  aspect?: string;
  className?: string;
};

export default function TileSkeleton({
  aspect = "aspect-[3/4]",
  className = "",
}: TileSkeletonProps) {
  return (
    <div
      className={`rounded-xl bg-[#CFC5BB] ${aspect} animate-pulse ${className}`}
    />
  );
}
