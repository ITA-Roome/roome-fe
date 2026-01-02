import botAvatar from "@/assets/RoomeLogo/comment_icon.svg";

type Props = {
  content: string;
  avatarSrc?: string;
};

export default function BotMessage({ content, avatarSrc }: Props) {
  const src = avatarSrc ?? botAvatar;

  return (
    <div className="flex items-start gap-3 mr-auto max-w-[85%]">
      <div className="w-10 h-10 rounded-full bg-primary-200 overflow-hidden shrink-0">
        <img
          src={src}
          alt="Bot avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="border border-primary-700 text-primary-700 p-3 rounded-2xl">
        {content}
      </div>
    </div>
  );
}
