import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InquiryToggleItem from "@/components/setting/InquiryToggleItem";

import { UserApi } from "@/api/user";
import { mapInquiryToUI, InquiryUIItem } from "@/types/inquiry";

export default function InquiryPage() {
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState<InquiryUIItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ 문의 목록 조회 (API 붙이면 여기만 바꾸면 됨)
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await UserApi.getInquiries();

        const mapped = res.data.content.map(mapInquiryToUI);
        setInquiries(mapped);
      } catch {
        setError("문의 목록을 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  return (
    // ✅ 바깥은 화면 고정 + 전체 스크롤 막기
    <div className="w-full h-dvh bg-white flex flex-col overflow-hidden pt-15">
      {/* ✅ 고정 영역: 문의 작성하기 버튼 (스크롤 X) */}
      <div className="shrink-0 px-6 pb-4">
        <button
          onClick={() => navigate("/setting/inquiry/contact")}
          className="w-full max-w-[520px] mx-auto h-[52px] rounded-full bg-[#6D5A46] text-white font-body2"
        >
          문의 작성하기
        </button>
      </div>

      {/* ✅ 스크롤 영역: 문의 리스트만 스크롤 */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading && (
          <div className="text-[13px] text-[#AFAFAF] py-6">
            문의 목록 불러오는 중...
          </div>
        )}

        {error && <div className="text-[13px] text-red-500 py-6">{error}</div>}

        {!loading && !error && inquiries.length === 0 && (
          <div className="text-[13px] text-[#AFAFAF] py-6">
            아직 작성한 문의가 없습니다.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {inquiries.map((it) => (
            <InquiryToggleItem
              key={it.id}
              label={it.typeText}
              dateText={it.dateText}
              status={it.status}
              locked={it.locked}
            >
              {/* ✅ SHOW_DETAIL 예시 */}
              {it.status === "ANSWERED" ? (
                <div className="flex flex-col gap-4">
                  <div className="w-full min-h-[120px] rounded-[8px] border border-[#6D5A46] p-4 text-[13px] text-primary-700">
                    {it.content ?? "-"}
                  </div>
                  <div className="w-full rounded-[8px] border border-[#6D5A46] p-4 text-[13px] text-primary-700">
                    <p className="font-body3">담당자 {it.manager ?? "-"}</p>
                    <p className="mt-2">
                      <span className="font-body3">답변 내용 </span>
                      {it.reply ?? "-"}
                    </p>
                  </div>
                </div>
              ) : (
                // ✅ PENDING 예시(내용만 보여주고 싶으면 여기 변경)
                <div className="flex flex-col gap-4 font-body3">
                  {it.content ?? "-"}
                </div>
              )}
            </InquiryToggleItem>
          ))}
        </div>
      </div>

      {/* 하단 탭바 자리 */}
      <div className="shrink-0 h-16" />
    </div>
  );
}
