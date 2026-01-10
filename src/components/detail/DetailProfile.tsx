interface DetailProfileProps {
  imageUrl?: string | null;
  name: string;
}

export default function DetailProfile({ imageUrl, name }: DetailProfileProps) {
  return (
    <section className="mt-15">
      <div className="flex items-center gap-3">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className="w-11 h-11 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-body1">{name}</p>
        </div>
      </div>
    </section>
  );
}
