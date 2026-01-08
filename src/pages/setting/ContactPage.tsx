import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InquiryApi } from "@/api/inquiry";

const inquiryTypeMap: Record<string, string> = {
  "계정/로그인 문제": "ACCOUNT_LOGIN",
  "오류 및 버그 신고": "BUG_REPORT",
  "제품 및 협업 문의": "PRODUCT_COLLAB",
  "직접 작성": "CUSTOM",
};

export default function ContactPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const inquiryTypes = [
    "계정/로그인 문제",
    "오류 및 버그 신고",
    "제품 및 협업 문의",
    "직접 작성",
  ];

  const handleSubmit = async () => {
    if (!selectedType || !content.trim()) return;
    const typeCode = inquiryTypeMap[selectedType] ?? "CUSTOM";

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
      navigate("/setting", { replace: true });
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

  return (
    <div>
      <div className="pt-24 max-w-md mx-auto px-5">
        <div className="relative max-w-sm mx-auto w-full" ref={wrapperRef}>
          <div
            className="border border-[#C7B5A1] rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer bg-[#FFFDF4]"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <span className="text-[#5D3C28] text-[14px]">
              {selectedType || "문의 유형 선택하기"}
            </span>
            <span
              className={`text-[#5D3C28] text-[20px] transition ${showDropdown ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </div>

          {showDropdown && (
            <div
              className="
              absolute left-0 right-0 top-[calc(100%+4px)]
              border border-[#C7B5A1]
              bg-[#FFFDF4]
              rounded-lg
              shadow-md
              z-50
              overflow-hidden
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
                    w-full text-left px-4 py-3
                    text-[14px] text-[#5D3C28]
                    hover:bg-[#EFE6DB]
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
            mt-5 w-full h-48
            border border-[#C7B5A1]
            rounded-lg
            px-4 py-3
            text-[#5D3C28]
            bg-[#D7C7B5]/30
            resize-none
            focus:outline-none
            text-[14px]
          "
        />

        <button
          type="button"
          disabled={!selectedType || !content.trim() || submitting}
          onClick={handleSubmit}
          className={`
            w-full mt-4 py-3 rounded-3xl text-white text-[14px] transition
            ${selectedType && content ? "bg-primary-700" : "bg-[#C7B5A1] opacity-50"}
          `}
        >
          {submitting ? "제출 중..." : "문의 제출"}
        </button>
      </div>
    </div>
  );
}
