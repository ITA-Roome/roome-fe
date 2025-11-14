import { useEffect, useRef } from "react";
import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";
import { Message } from "@/pages/chat/ChatPage";

type Props = {
  messages: Message[];
};

export default function MessageList({ messages }: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages]);

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map((msg, i) =>
        msg.role === "user" ? (
          <UserMessage key={i} content={msg.content} />
        ) : (
          <BotMessage key={i} content={msg.content} />
        ),
      )}
    </div>
  );
}
