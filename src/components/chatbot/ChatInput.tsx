import { useRef, useState } from "react";
import sendIcon from "@/assets/icons/send.svg";

type Props = {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function ChatInput({ onSend, disabled = false }: Props) {
  const [input, setInput] = useState("");
  const isSubmittingRef = useRef(false);

  const handleSubmit = () => {
    if (disabled) return;

    const trimmed = input.trim();
    if (!trimmed) return;

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    onSend(trimmed);
    setInput("");

    queueMicrotask(() => {
      isSubmittingRef.current = false;
    });
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((e.nativeEvent as any).isComposing) return;

          e.preventDefault();
          handleSubmit();
        }}
        disabled={disabled}
        className="w-full h-12 pl-4 pr-14 bg-white border border-primary-700 rounded-md
                     focus:outline-none font-body3 disabled:opacity-60"
      />

      <button
        type="button"
        onClick={handleSubmit}
        aria-label="메시지 보내기"
        disabled={disabled}
        className="absolute inset-y-0 right-5 flex items-center"
      >
        <img src={sendIcon} alt="send" className="w-4 h-4 object-contain" />
      </button>
    </div>
  );
}
