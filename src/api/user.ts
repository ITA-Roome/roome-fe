import { apiClient } from "@/lib/apiClient";
import { CommonResponse } from "@/types/common";
import {
  OnboardingPayload,
  OnboardingExistenceResponse,
  UserLikeProductResponse,
  UserProfile,
} from "@/types/user";

export const UserApi = {
  onboardingSubmit: (payload: OnboardingPayload) =>
    apiClient.post("/api/user/onboarding", payload),

  checkOnboardingExistence: () =>
    apiClient.get<OnboardingExistenceResponse>(
      "/api/user/onboarding/existence",
    ),

  fetchUserLikedProducts: async (): Promise<
    CommonResponse<UserLikeProductResponse>
  > => {
    const { data } =
      await apiClient.get<CommonResponse<UserLikeProductResponse>>(
        "/api/user/likes",
      );
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
};
