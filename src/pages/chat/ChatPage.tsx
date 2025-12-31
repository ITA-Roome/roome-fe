import { useMemo, useState, useEffect } from "react";
import MessageList from "@/components/chatbot/MessageList";
import ChatInput from "@/components/chatbot/ChatInput";

export type Message = {
  role: "user" | "bot";
  content: string;
};

const HEADER = 64;
const FOOTER = 80;

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

  // 2) 복원 후에만 저장 (Strict Mode 중복 실행 방지)
  useEffect(() => {
    if (!isHydrated) return; // 초기 빈 상태로 덮어쓰는 것 방지
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (err) {
      console.error("대화 저장 실패:", err);
    }
  }, [messages, isHydrated, storageKey]);

  const handleSend = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "bot", content: `“${userMessage}”에 대한 답변이에요.` },
    ]);
  };

  return (
    <div
      className="max-w-md mx-auto flex flex-col"
      style={{
        // 전체 높이에서 Header + Footer 제거 → ChatPage 영역 확보
        height: `calc(100vh - ${HEADER + FOOTER}px)`,
      }}
    >
      {/* 위~입력창 사이가 채팅 영역 */}
      <div className="flex-1 overflow-hidden flex flex-col whitespace-pre-line">
        <MessageList messages={messages} />
      </div>

      {/* 입력창 */}
      <div className="px-4 py-3">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
