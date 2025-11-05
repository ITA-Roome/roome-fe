import { apiClient } from "@/lib/apiClient";

export type OnboardingPayload = {
  ageGroup: string;
  gender: string;
  spaceType: string;
  moodType: string;
};

export const OnboardingApi = {
  onboardingSubmit: (payload: OnboardingPayload) =>
    apiClient.post("/api/user/onboarding", payload),
};
