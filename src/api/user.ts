import { apiClient } from "@/lib/apiClient";
import { CommonResponse } from "@/types/common";
import {
  OnboardingPayload,
  OnboardingExistenceResponse,
  UserLikeProductResponse,
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
        "api/user/likes",
      );
    return data;
  },
};
