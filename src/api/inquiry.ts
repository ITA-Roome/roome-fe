import { apiClient } from "@/lib/apiClient";
import { InquiryRequest, InquiryResponse } from "@/types/inquiry";

export const InquiryApi = {
  submitInquiry: async (payload: InquiryRequest): Promise<InquiryResponse> => {
    const { data } = await apiClient.post<InquiryResponse>(
      "/api/inquiries",
      payload,
    );
    return data;
  },
};
