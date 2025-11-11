type Props = {
  content: string;
  avatarSrc?: string;
};

export default function BotMessage({ content, avatarSrc }: Props) {
  return (
    <div className="flex items-start gap-3 mr-auto max-w-[85%]">
      <div className="w-10 h-10 rounded-full bg-[var(--color-primary-200)] overflow-hidden flex-shrink-0">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt="Bot avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-primary-700)] font-semibold">
            B
          </div>
        )}
      </div>
      <div className="bg-[var(--color-primary-200)] text-[var(--color-primary-800)] p-3 rounded-lg">
        {content}
      </div>
    </div>
  );
}
