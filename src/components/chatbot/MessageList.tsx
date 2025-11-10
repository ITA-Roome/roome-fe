import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";
import { Message } from "@/pages/chat/ChatPage";

type Props = {
  messages: Message[];
};

export default function MessageList({ messages }: Props) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
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
