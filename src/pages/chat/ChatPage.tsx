import { useState } from "react";
import MessageList from "@/components/chatbot/MessageList";
import ChatInput from "@/components/chatbot/ChatInput";

export type Message = {
  role: "user" | "bot";
  content: string;
};

const HEADER = 64;
const FOOTER = 80;

/**
 * Render the chat UI that manages a list of messages and processes user input.
 *
 * The component maintains local `messages` state and provides `handleSend`, which appends a trimmed user message and a placeholder bot reply to the message list.
 *
 * @returns The chat page JSX element containing the message list and input area
 */
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // 1️⃣ 사용자 메시지 추가
    const newMessage: Message = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, newMessage]);

    // 2️⃣ 서버 요청 (임시로 가짜 답변)
    const botReply: Message = {
      role: "bot",
      content: `“${userMessage}”에 대한 답변이에요.`,
    };
    setMessages((prev) => [...prev, botReply]);
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
