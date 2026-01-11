interface DetailImageProps {
  src: string;
  alt: string;
  showBadge?: boolean;
}

export default function DetailImage({
  src,
  alt,
  showBadge = false,
}: DetailImageProps) {
  return (
    <section>
      <div className="relative rounded-2xl aspect-4/3 overflow-hidden">
        {src && (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        )}
        {showBadge && (
          <button
            type="button"
            aria-label="badge"
            className="absolute right-3 top-3"
          ></button>
        )}
      </div>
    </section>
  );
}
