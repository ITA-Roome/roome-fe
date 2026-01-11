import { useState, ReactNode } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

export type InquiryStatus = "ANSWERED" | "PENDING";

type Props = {
  label: string; // 기본: "문의 유형"
  typeText?: string; // "abc***" 같은 유형/제목
  dateText: string; // "26.01.09"
  status: InquiryStatus; // 답변완료/응답대기중
  locked?: boolean; // ✅ 자물쇠 표시 여부 (props)
  defaultOpen?: boolean;
  children?: ReactNode; // 펼쳤을 때 들어갈 내용
};

export default function InquiryToggleItem({
  label,
  typeText = "본인",
  dateText,
  status,
  locked = false,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const statusText = status === "ANSWERED" ? "답변 완료" : "응답 대기 중";
  const StatusIcon = status === "ANSWERED" ? CheckCircleIcon : XCircleIcon;

  return (
    <div className="w-full rounded-[10px] border border-[#6D5A46] overflow-hidden bg-white">
      {/* 헤더(토글 영역) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex flex-col items-start gap-1">
          <span className="font-body3 text-primary-700">{label}</span>

          <div className="flex items-center gap-1 text-[12px] text-[#6D5A46]">
            <span>{statusText}</span>
            <StatusIcon
              className={`w-4 h-4 ${
                status === "ANSWERED" ? "text-[#FFC800]" : "text-[#AFAFAF]"
              }`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-primary-700">
            {typeText} / {dateText}
          </span>

          {locked && <LockClosedIcon className="w-4 h-4 text-primary-700" />}

          {open ? (
            <ChevronUpIcon className="w-5 h-5 text-primary-700" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-primary-700" />
          )}
        </div>
      </button>

      {/* 펼침 영역 */}
      {open && <div className="border-t border-[#6D5A46] p-4">{children}</div>}
    </div>
  );
}
