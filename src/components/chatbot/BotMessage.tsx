import botAvatar from "@/assets/RoomeLogo/comment_icon.svg";
import { ChatResultData } from "@/types/chatbot";
import ProductCard from "./ProductCard";

type Props = {
  content: string;
  avatarSrc?: string;
  resultData?: ChatResultData;
};

export default function BotMessage({ content, avatarSrc, resultData }: Props) {
  const src = avatarSrc ?? botAvatar;
  const products = resultData?.products ?? [];

  return (
    <div className="flex items-start gap-3 mr-auto max-w-[85%]">
      <div className="w-10 h-10 rounded-full bg-primary-200 overflow-hidden shrink-0">
        <img
          src={src}
          alt="Bot avatar"
          className="w-full h-full object-cover"
        />
      </div>
      {products.length > 0 ? (
        <div className="border border-primary-700 rounded-2xl p-3 space-y-3 bg-white">
          <p className="font-semibold text-primary-700">{content}</p>
          <div className="space-y-2">
            {products.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mt-2 px-4 py-2 rounded-2xl bg-primary-700 text-white text-sm"
            >
              저장하기
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-primary-700 text-primary-700 p-3 rounded-2xl">
          {content}
        </div>
      )}
    </div>
  );
}
