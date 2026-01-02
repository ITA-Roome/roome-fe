interface ConsultCardProps {
  title: string;
  details: string[];
  images: string[];
}

export default function ConsultCard({
  title,
  details,
  images,
}: ConsultCardProps) {
  return (
    <div className="w-full bg-[#5D3C28] text-white rounded-2xl p-5 space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="text-sm space-y-1">
        {details.map((line, i) => (
          <li key={i}>• {line}</li>
        ))}
      </ul>
      <div className="grid grid-cols-3 grid-rows-2 gap-3">
        {images.slice(0, 6).map((img, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl overflow-hidden bg-[#C8B8A9]"
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
