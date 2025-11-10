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
    <div className="flex items-center border-t border-[var(--color-primary-200)] p-3 bg-white">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="무엇이든 물어보세요!"
        className="flex-1 px-3 py-2 border border-[var(--color-primary-400)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-700)]"
      />
      <button
        onClick={handleSubmit}
        className="ml-3 bg-[var(--color-primary-700)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary-800)]"
      >
        보내기
      </button>
    </div>
  );
}
