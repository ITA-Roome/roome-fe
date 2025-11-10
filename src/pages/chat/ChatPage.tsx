import { useState } from "react";
import MessageList from "@/components/chatbot/MessageList";
import ChatInput from "@/components/chatbot/ChatInput";

export type Message = {
  role: "user" | "bot";
  content: string;
};

const HEADER = 100;
const FOOTER = 96;

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

  // return (
  //   <div className="flex flex-col h-screen bg-[var(--color-primary-50)]">
  //     <MessageList messages={messages} />
  //     <ChatInput onSend={handleSend} />
  //   </div>
  // );
  return (
    <div
      className="flex flex-col bg-primary-50"
      style={{ minHeight: `calc(100vh - ${HEADER + FOOTER}px)` }}
    >
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <MessageList messages={messages} />
      </div>
      <div className="sticky bottom-0 bg-primary-50">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
