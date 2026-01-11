import botAvatar from "@/assets/RoomeLogo/comment_icon.svg";
import {
  ChatResultData,
  ChatProductResult,
  ChatMoodResult,
} from "@/types/chatbot";
import ProductCard from "@/components/chatbot/ProductCard";
import MoodCard from "@/components/chatbot/MoodCard";

type Props = {
  content: string;
  avatarSrc?: string;
  resultData?: ChatResultData;
};

// 제품 추천인지 체크
const isProductResult = (data?: ChatResultData): data is ChatProductResult => {
  return !!data && "products" in data && Array.isArray(data.products);
};

// 인테리어 추천인지 체크
const isMoodResult = (data?: ChatResultData): data is ChatMoodResult => {
  return !!data && ("title" in data || "imageUrlList" in data);
};

export default function BotMessage({ content, avatarSrc, resultData }: Props) {
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

      {isProductResult(resultData) ? (
        <div className="border border-primary-700 rounded-2xl p-3 space-y-3 bg-white">
          <p className="font-semibold text-primary-700">{content}</p>
          <div className="space-y-2">
            {resultData.products.map((p) => (
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
      ) : isMoodResult(resultData) ? (
        <div className="border border-primary-700 rounded-2xl p-3 space-y-3 bg-white">
          <p className="font-semibold text-primary-700">{content}</p>
          <MoodCard data={resultData} />
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
          {content === "..." ? (
            <div className="flex gap-2 px-3 py-1">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          ) : (
            content
          )}
        </div>
      )}
    </div>
  );
}
