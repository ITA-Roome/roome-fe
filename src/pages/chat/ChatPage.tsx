import { useState, useEffect } from "react";
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch (err) {
      console.error("대화 복원 실패:", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return; // 초기 빈 상태로 덮어쓰는 것 방지
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.error("대화 저장 실패:", err);
    }
  }, [messages, isHydrated]);

  const handleSend = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    setMessages((prev) => {
      const next: Message[] = [
        ...prev,
        { role: "user", content: userMessage },
        { role: "bot", content: `“${userMessage}”에 대한 답변이에요.` },
      ];
      return next;
    });
  };

  return (
    <div
      className="bg-primary-50 max-w-md mx-auto flex flex-col"
      style={{
        // 전체 높이에서 Header + Footer 제거 → ChatPage 영역 확보
        height: `calc(100vh - ${HEADER + FOOTER}px)`,
        marginTop: HEADER, // Header가 fixed라서 아래로 밀어주기
      }}
    >
      {/* 위~입력창 사이가 채팅 영역 */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList messages={messages} />
      </div>

      {/* 입력창 */}
      <div className="px-4 py-3 bg-primary-50">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
