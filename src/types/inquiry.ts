import { CommonResponse } from "@/types/common";

export type InquiryRequest = {
  type: string;
  content: string;
};

export type InquiryResponse = CommonResponse<undefined>;
