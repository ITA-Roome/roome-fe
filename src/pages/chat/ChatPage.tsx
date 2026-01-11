import { useMemo, useState, useEffect, useCallback } from "react";
import MessageList from "@/components/chatbot/MessageList";
import ChatInput from "@/components/chatbot/ChatInput";
import { ChatApi } from "@/api/chatbot";
import {
  ChatInputType,
  ChatResponseType,
  ChatResultData,
} from "@/types/chatbot";

export type Message = {
  role: "user" | "bot";
  content: string;
  resultData?: ChatResultData;
};

const STORAGE_KEY = "chatMessages";

/**
 * Render the chat page UI and manage the message list.
 *
 * Maintains local message state and, when input is sent, appends the user message followed by a placeholder bot reply.
 *
 * @returns The chat page JSX element containing the message list and input area
 */
export default function ChatPage() {
  const userId = sessionStorage.getItem("userId") ?? "guest";
  const nickname = sessionStorage.getItem("nickname") ?? "guest";
  const storageKey = `${STORAGE_KEY}:${userId}`;

  const defaultBotMessages = useMemo(
    () => [
      {
        role: "bot" as const,
        content: `안녕 ${nickname}!\n나는 ${nickname}의 인테리어를 도와줄 ROOME라고 해!\n만나서 반가워 :)`,
      },
      {
        role: "bot" as const,
        content: `${nickname}가 원하는 인테리어를 알려줘!\n[예시) 6평 원룸 꾸미기를 하고 싶은데, 어떤 제품들로 구성하면 좋을지 추천받고싶어! 화이트 톤을 이용한 깔끔한 인테리어로!]`,
      },
    ],
    [nickname],
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 1) 세션 저장소에서 복원. 없으면 기본 봇 인사.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages(defaultBotMessages);
      }
    } catch (err) {
      console.error("대화 복원 실패:", err);
      setMessages(defaultBotMessages);
    } finally {
      setIsHydrated(true);
    }
  }, [storageKey, defaultBotMessages]);

  useEffect(() => {
    // 대화가 복원된 뒤 옵션이 비어 있으면 기본 질문 두 개를 노출
    if (isHydrated && options.length === 0) {
      setOptions(["인테리어 추천", "제품 추천"]);
    }
  }, [isHydrated, options.length]);

  // 2) 복원 후에만 저장 (Strict Mode 중복 실행 방지)
  useEffect(() => {
    if (!isHydrated) return; // 초기 빈 상태로 덮어쓰는 것 방지
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (err) {
      console.error("대화 저장 실패:", err);
    }
  }, [messages, isHydrated, storageKey]);

  const sendToBot = useCallback(
    async (UserMessage: string, inputType: ChatInputType) => {
      const trimmed = UserMessage.trim();
      if (!trimmed) return;

      setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      setLoading(true);

      try {
        const res = await ChatApi.chatMessage({
          sessionId,
          inputType,
          message: trimmed,
        });

        const botContent =
          res.data?.type === ChatResponseType.RESULT && res.data.data
            ? (res.data.message ?? "추천 결과입니다.")
            : (res.data?.message ?? "답변을 가져오지 못했습니다.");

        setSessionId(res.data?.sessionId ?? null);
        setOptions(
          res.data?.type === ChatResponseType.RESULT
            ? []
            : (res.data?.options ?? []),
        );

        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: botContent,
            resultData:
              res.data?.type === ChatResponseType.RESULT
                ? res.data.data
                : undefined,
          },
        ]);
      } catch (error) {
        console.error("챗봇 호출 실패:", error);
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "죄송해요. 잠시 후 다시 시도해 주세요." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [sessionId],
  );

  const handleSend = (userMessage: string) => {
    void sendToBot(userMessage, ChatInputType.TEXT);
  };

  const handleOptionClick = (option: string) => {
    void sendToBot(option, ChatInputType.BUTTON);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 채팅 영역 */}
      <div className="flex-1 min-h-0 overflow-y-auto whitespace-pre-line px-4">
        <MessageList messages={messages} className="h-full" />
      </div>

      <div className="shrink-0">
        {/* 옵션 버튼 */}
        {options.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleOptionClick(opt)}
                className="px-3 py-2 rounded-full border border-primary-700 text-sm bg-white active:bg-primary-50"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* 입력창 */}
        <div className="px-4 py-3">
          <ChatInput onSend={handleSend} disabled={loading} />
        </div>
      </div>
    </div>
  );
}
