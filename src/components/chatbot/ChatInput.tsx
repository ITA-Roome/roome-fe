import { useState } from "react";
import sendIcon from "@/assets/icons/send.svg";

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
          className="w-full pr-12 pl-4 py-3 bg-white border border--primary-300 rounding-32 focus:outline-none focus:ring-1 focus:ring-primary-600"
        />
        <button
          onClick={handleSubmit}
          aria-label="메시지 보내기"
          className="absolute inset-y-0 right-4 flex items-center text-2xl"
        >
          <img src={sendIcon} alt="send" className="w-6 h-6 object-contain" />
        </button>
      </div>
    </div>
  );
}
