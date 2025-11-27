type Props = {
  content: string;
  avatarSrc?: string;
};

export default function BotMessage({ content, avatarSrc }: Props) {
  return (
    <div className="flex items-start gap-3 mr-auto max-w-[85%]">
      <div className="w-10 h-10 rounded-full bg-primary-200 overflow-hidden shrink-0">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt="Bot avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text--primary-700 font-semibold">
            B
          </div>
        )}
      </div>
      <div className="bg-primary-200 text-primary-800 p-3 rounded-lg">
        {content}
      </div>
    </div>
  );
}
