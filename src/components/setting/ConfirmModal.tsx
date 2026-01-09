import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  description?: string;

  confirmText?: string;
  cancelText?: string;

  onConfirm: (value?: string) => void; // ✅ input 있을 때 값 전달
  onCancel: () => void;

  closeOnBackdrop?: boolean;

  // ✅ 입력창 옵션
  input?: {
    label?: string; // "비밀번호를 입력해주세요"
    placeholder?: string;
    type?: "text" | "password";
    required?: boolean; // true면 confirm 비활성 제어
    defaultValue?: string;
    autoFocus?: boolean;
  };
};

export default function ConfirmModal({
  open,
  title,
  description = "정말 진행하시겠습니까?",
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
  closeOnBackdrop = true,
  input,
}: ConfirmModalProps) {
  const [value, setValue] = useState(input?.defaultValue ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") {
        const current = valueRef.current.trim();
        if (input?.required && !current) return;
        onConfirm(input ? current : undefined);
      }
    },
    [onCancel, onConfirm, input],
  );

  useEffect(() => {
    if (!open) return;

    window.addEventListener("keydown", handleKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // autofocus
    if (input?.autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, handleKeyDown, input?.autoFocus]);

  if (!open) return null;

  const confirmDisabled = input?.required ? !value.trim() : false;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "modal"}
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeOnBackdrop ? onCancel : undefined}
      />

      {/* modal */}
      <div className="relative w-[320px] rounded-2xl bg-[#8D7569] px-6 py-6 shadow-lg">
        {title && (
          <h2 className="text-center text-[#FFFDF4] text-[16px] font-semibold">
            {title}
          </h2>
        )}

        <p className="mt-2 text-center text-[#FFFDF4] text-[14px] whitespace-pre-line">
          {description}
        </p>

        {/* ✅ input 영역 */}
        {input && (
          <div className="mt-4">
            {input.label && (
              <p className="mb-2 text-center text-[#FFFDF4] text-[14px]">
                {input.label}
              </p>
            )}
            <input
              ref={inputRef}
              type={input.type ?? "text"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={input.placeholder}
              className="w-full h-10 rounded-md bg-[#FFFDF4] px-3 text-[#5D3C28] text-[14px] outline-none"
            />
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-10 rounded-full bg-[#FFFDF4] text-[#5D3C28] text-[14px] font-semibold"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={confirmDisabled}
            onClick={() => onConfirm(input ? value : undefined)}
            className={`flex-1 h-10 rounded-full text-[14px] font-semibold ${
              confirmDisabled
                ? "bg-[#5D3C28]/50 text-[#FFFDF4] cursor-not-allowed"
                : "bg-[#5D3C28] text-[#FFFDF4]"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
