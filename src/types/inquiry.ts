import { CommonResponse } from "@/types/common";

export type InquiryType =
  | "BUG_REPORT"
  | "CUSTOM"
  | "ACCOUNT_LOGIN"
  | "PARTNERSHIP";

export type InquiryItem = {
  inquiryId: number;
  inquiryType: InquiryType | string;
  inquiryStatus: "OPEN" | "CLOSED" | string;
  inquiryContent: string;
  inquiryCreatedAt: string;
  answerContent: string | null;
  answerCreatedAt: string | null;
};

export type InquiryListData = {
  content: InquiryItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type InquiryListResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: InquiryListData;
  success: boolean;
};

export type InquiryUIItem = {
  id: number;
  typeText: string;
  dateText: string;
  status: "ANSWERED" | "PENDING";
  locked: boolean;
  content: string;
  manager?: string;
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
      return "오류 및 버그 신고";
    case "CUSTOM":
      return "기타 문의";
    case "ACCOUNT_LOGIN":
      return "계정/로그인 문제";
    case "PARTNERSHIP":
      return "제품 및 협업 문의";
    default:
      return t;
  }
};

export const mapInquiryToUI = (x: InquiryItem): InquiryUIItem => {
  const answered = !!x.answerContent;

  return {
    id: x.inquiryId,
    typeText: inquiryTypeLabel(x.inquiryType),
    dateText: formatYYMMDD(x.inquiryCreatedAt),
    status: answered ? "ANSWERED" : "PENDING",
    locked: false,
    content: x.inquiryContent,
    manager: answered ? "루미" : undefined,
    reply: x.answerContent ?? undefined,
  };
};

export type InquiryRequest = {
  type: string;
  content: string;
};

export type InquiryResponse = CommonResponse<undefined>;
