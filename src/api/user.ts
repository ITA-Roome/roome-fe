import { apiClient } from "@/lib/apiClient";
import { CommonResponse } from "@/types/common";
import {
  OnboardingPayload,
  OnboardingExistenceResponse,
  UserScrapProductResponse,
  UserScrapReferenceResponse,
  UserProfile,
  UserUploadedReferenceResponse,
} from "@/types/user";
import { InquiryListResponse } from "@/types/inquiry";

export const UserApi = {
  onboardingSubmit: (payload: OnboardingPayload) =>
    apiClient.post("/api/user/onboarding", payload),

  checkOnboardingExistence: () =>
    apiClient.get<OnboardingExistenceResponse>(
      "/api/user/onboarding/existence",
    ),

  fetchUserScrapProducts: async (): Promise<
    CommonResponse<UserScrapProductResponse>
  > => {
    const { data } = await apiClient.get<
      CommonResponse<UserScrapProductResponse>
    >("/api/user/scraps/product");
    return data;
  },

  fetchUserScrapReferences: async (): Promise<
    CommonResponse<UserScrapReferenceResponse>
  > => {
    const { data } = await apiClient.get<
      CommonResponse<UserScrapReferenceResponse>
    >("/api/user/scraps/reference");
    return data;
  },

  fetchUserUploadedReferences: async (): Promise<
    CommonResponse<UserUploadedReferenceResponse>
  > => {
    const { data } = await apiClient.get<
      CommonResponse<UserUploadedReferenceResponse>
    >("/api/user/references");
    return data;
  },

  fetchUserProfile: async (): Promise<CommonResponse<UserProfile>> => {
    const { data } =
      await apiClient.get<CommonResponse<UserProfile>>("/api/user/profile");
    return data;
  },

  updateUserProfile: async (
    formData: FormData,
  ): Promise<CommonResponse<UserProfile>> => {
    const { data } = await apiClient.patch<CommonResponse<UserProfile>>(
      "/api/user/profile",
      formData,
    );
    return data;
  },

  getInquiries: async (): Promise<InquiryListResponse> => {
    const { data } = await apiClient.get<InquiryListResponse>(
      "/api/user/inquiries",
    );
    return data;
  },
};
