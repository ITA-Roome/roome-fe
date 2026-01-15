import { useEffect, useRef } from "react";
import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";
import { Message } from "@/pages/chat/ChatPage";

type Props = {
  messages: Message[];
  className?: string;
  isLoading?: boolean;
  sessionId?: string | null;
  onSaveSuccess?: () => void;
};

export default function MessageList({
  messages,
  className = "",
  isLoading = false,
  sessionId,
  onSaveSuccess,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;

    const isOverflowing = node.scrollHeight > node.clientHeight;

    if (isOverflowing) {
      node.scrollTo({
        top: node.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      ref={listRef}
      className={`flex-1 overflow-y-auto py-6 space-y-4 ${className}`}
    >
      {messages.map((msg, i) =>
        msg.role === "user" ? (
          <UserMessage key={i} content={msg.content} />
        ) : (
          <BotMessage
            key={i}
            content={msg.content}
            resultData={msg.resultData}
            sessionId={sessionId}
            onSaveSuccess={onSaveSuccess}
          />
        ),
      )}

      {/* 로딩 중이면 봇 로딩 인디케이터 추가 */}
      {isLoading && (
        <BotMessage
          content="..."
          sessionId={sessionId}
          onSaveSuccess={onSaveSuccess}
        />
      )}
    </div>
  );
}
