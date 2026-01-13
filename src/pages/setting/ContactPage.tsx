import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InquiryApi } from "@/api/inquiry";
import type { InquiryType } from "@/types/inquiry";
import PageContainer from "@/components/layout/PageContainer";

const inquiryTypeMap: Record<string, InquiryType> = {
  "계정/로그인 문제": "ACCOUNT_LOGIN",
  "오류 및 버그 신고": "BUG_REPORT",
  "제품 및 협업 문의": "PARTNERSHIP",
  "직접 작성": "CUSTOM",
};

export default function ContactPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const inquiryTypes: Array<keyof typeof inquiryTypeMap> = [
    "계정/로그인 문제",
    "오류 및 버그 신고",
    "제품 및 협업 문의",
    "직접 작성",
  ];

  const handleSubmit = async () => {
    if (!selectedType || !content.trim()) return;
    const typeCode = inquiryTypeMap[selectedType];

    setSubmitting(true);
    try {
      const res = await InquiryApi.submitInquiry({
        type: typeCode,
        content: content.trim(),
      });

      if (!res.isSuccess) {
        alert(res.message || "문의 등록에 실패했습니다.");
        return;
      }

      alert("문의가 등록되었습니다!");
      setContent("");
      setSelectedType("");
      navigate("/setting/inquiry", { replace: true });
    } catch (err) {
      console.error("문의 등록 실패:", err);
      alert("문의 등록 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const canSubmit = !!selectedType && !!content.trim() && !submitting;

  return (
    <PageContainer>
      <div className="px-6 pt-3">
        {/* Dropdown */}
        <div ref={wrapperRef} className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown((prev) => !prev)}
            className="
              w-full h-[38px]
              rounded-[6px]
              bg-primary-50
              px-4
              flex items-center justify-between
              text-primary-700 text-[12px]
            "
          >
            <span className="truncate">
              {selectedType || "문의 유형 선택하기"}
            </span>

            <span
              className={`text-primary-700 text-[14px] transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {showDropdown && (
            <div
              className="
                absolute left-0 top-[44px] w-full
                bg-white
                rounded-[10px]
                border border-[#6D5A46]
                shadow-[0_8px_20px_rgba(0,0,0,0.12)]
                overflow-hidden
                z-50
              "
            >
              {inquiryTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSelectedType(type);
                    setShowDropdown(false);
                  }}
                  className="
                    w-full text-left
                    px-4 py-2
                    text-[12px] text-[#5D3C28]
                    hover:bg-[#FFF8E1]
                  "
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="문의 내용을 입력해주세요"
          className="
            mt-4 w-full h-[300px]
            rounded-[10px]
            border border-primary-700
            placeholder:text-primary-200
            p-4
            text-[13px] text-primary-700
            placeholder:text-[#AFAFAF]
            outline-none
            resize-none
            bg-white
          "
        />

        {/* 오른쪽 작은 등록하기 버튼 */}
        <div className="mt-3 w-full flex justify-end">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="
              h-[28px] px-4
              rounded-full
              text-[12px]
              transition
              disabled:opacity-40 disabled:cursor-not-allowed
              bg-primary-200 text-white
            "
          >
            {submitting ? "제출 중..." : "문의 제출"}
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
