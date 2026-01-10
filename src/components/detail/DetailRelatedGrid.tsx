interface RelatedItem {
  id: number;
  imageUrl?: string;
  name?: string;
}

interface DetailRelatedGridProps {
  title: string;
  items: RelatedItem[];
  emptyMessage: string;
  onItemClick?: (id: number) => void;
  aspectRatio?: string;
  isRounded?: boolean;
}

export default function DetailRelatedGrid({
  title,
  items,
  emptyMessage,
  onItemClick,
  aspectRatio = "aspect-4/3",
  isRounded = true,
}: DetailRelatedGridProps) {
  return (
    <section className="mt-15">
      <p className="mb-3 font-body3 text-primary-700">{title}</p>
      {items.length === 0 ? (
        <p className="font-caption text-primary-400">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {items.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className={`${aspectRatio} ${
                isRounded ? "rounded-xl" : ""
              } overflow-hidden bg-primary-200 ${
                onItemClick ? "cursor-pointer" : ""
              }`}
              onClick={() => onItemClick?.(item.id)}
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name || "related item"}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
