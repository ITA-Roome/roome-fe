import { CommonResponse } from "@/types/common";

export type InquiryItem = {
  inquiryId: number;
  inquiryType: "BUG_REPORT" | "CUSTOM" | string;
  inquiryStatus: "OPEN" | "CLOSED" | string;
  inquiryContent: string;
  inquiryCreatedAt: string; // ISO string
  answerContent: string | null;
  answerCreatedAt: string | null;
};

// 목록 조회 응답 페이징 타입
export type InquiryListData = {
  content: InquiryItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

// 목록 조회 응답 타입
export type InquiryListResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: InquiryListData;
  success: boolean;
};

export type InquiryUIItem = {
  id: number;
  typeText: string; // abc*** 자리 -> 문의 유형 텍스트
  dateText: string; // 26.01.09 형태
  status: "ANSWERED" | "PENDING";
  locked: boolean;
  content: string;
  manager?: string; // 서버에 없으면 일단 생략/고정값
  reply?: string;
};

export const formatYYMMDD = (iso: string) => {
  const d = new Date(iso);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
};

const inquiryTypeLabel = (t: string) => {
  switch (t) {
    case "BUG_REPORT":
      return "버그 신고";
    case "CUSTOM":
      return "기타 문의";
    default:
      return t; // 서버 값 그대로라도 보여주기
  }
};

export const mapInquiryToUI = (x: InquiryItem): InquiryUIItem => {
  const answered = !!x.answerContent; // 답변 있으면 완료로 처리

  return {
    id: x.inquiryId,
    typeText: inquiryTypeLabel(x.inquiryType),
    dateText: formatYYMMDD(x.inquiryCreatedAt),
    status: answered ? "ANSWERED" : "PENDING",
    locked: false, // ✅ 서버에 비공개 여부가 없어서 일단 false
    content: x.inquiryContent,
    manager: answered ? "루미" : undefined, // 서버에 담당자 필드 생기면 매핑
    reply: x.answerContent ?? undefined,
  };
};

export type InquiryRequest = {
  type: string;
  content: string;
};

export type InquiryResponse = CommonResponse<undefined>;
