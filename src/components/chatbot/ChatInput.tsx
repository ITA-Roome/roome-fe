import { useState } from "react";

type Props = {
  onSend: (message: string) => void;
};

export default function ChatInput({ onSend }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    onSend(input);
    setInput("");
  };

  return (
    <div className="p-3">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="무엇이든 물어보세요!"
          className="w-full pr-12 pl-4 py-3 bg-white border border-[var(--color-primary-300)] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
        />
        <button
          onClick={handleSubmit}
          aria-label="메시지 보내기"
          className="absolute inset-y-0 right-4 flex items-center text-2xl"
        >
          📤
        </button>
      </div>
    </div>
  );
}
