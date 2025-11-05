import { apiClient } from "@/lib/apiClient";

export type OnboardingPayload = {
  ageGroup: string;
  gender: string;
  moodType: string;
  spaceType: string;
};

type OnboardingExistenceResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  success?: boolean;
  data?: {
    isExist?: boolean;
    exists?: boolean;
    hasOnboardingInformation: boolean;
  };
};

export const OnboardingApi = {
  onboardingSubmit: (payload: OnboardingPayload) =>
    apiClient.post("/api/user/onboarding", payload),
  checkOnboardingExistence: () =>
    apiClient.get<OnboardingExistenceResponse>("api/user/onboarding/existence"),
};
