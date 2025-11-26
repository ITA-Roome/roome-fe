import { useEffect, useRef } from "react";
import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";
import { Message } from "@/pages/chat/ChatPage";

type Props = {
  messages: Message[];
};

/**
 * Render a vertically scrollable list of chat messages and, when the content overflows,
 * smoothly scroll to the bottom so the latest message is visible.
 *
 * @param messages - Array of chat messages; each message's `role` selects either the user or bot message component and `content` is rendered.
 * @returns The rendered message list container element.
 */
export default function MessageList({ messages }: Props) {
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
