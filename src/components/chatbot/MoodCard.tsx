import type { ChatMoodResult } from "@/types/chatbot";

type Props = {
  data: ChatMoodResult;
};

export default function MoodCard({ data }: Props) {
  const imageUrl = data.imageUrlList?.[0] ?? "";
  const keywords = data.moodKeywords?.join(", ");
  const baseText = data.moodDescription ?? data.summary ?? "";
  const hasBreak = baseText.includes("\n");
  const [summaryText, detailText] = hasBreak
    ? (() => {
        const [first, ...rest] = baseText.split(/\n+/);
        return [first?.trim() ?? "", rest.join("\n").trim()];
      })()
    : [data.moodDescription ?? "", data.summary ?? ""];

  return (
    <div className="border border-primary-200 rounded-2xl p-4 flex flex-col gap-3 bg-white">
      {/* 제목 */}
      <p className="font-semibold text-sm text-primary-700">
        {data.title ?? "인테리어 추천"}
      </p>

      {/* 키워드 칩 */}
      {keywords && (
        <div className="flex flex-wrap gap-2">
          {keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
            .map((k) => (
              <span
                key={k}
                className="px-3 py-1 rounded-full border border-primary-200 text-xs text-primary-700 bg-white"
              >
                {k}
              </span>
            ))}
        </div>
      )}

      {/* 대표 이미지 (가로 전체) */}
      {imageUrl && (
        <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={data.title ?? "interior"}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 무드 한 줄 요약 */}
      {summaryText && <p className="text-sm text-primary-700">{summaryText}</p>}

      {/* 상세 설명 / 요약 */}
      {detailText && (
        <p className="text-xs text-primary-500 leading-5 whitespace-pre-line">
          {detailText}
        </p>
      )}
    </div>
  );
}
