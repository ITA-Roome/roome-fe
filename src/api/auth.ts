import {
  EmailVerificationConfirmRequest,
  EmailVerificationRequest,
  LoginRequest,
  LoginResponse,
  NicknameCheckResponse,
  OAuthCodeRequest,
  OAuthLoginResponse,
  SignupRequest,
  SignupResponse,
  SocialAuthUrlResponse,
} from "@/types/auth";
import { apiClient } from "../lib/apiClient";
import { CommonResponse } from "@/types/common";

export const AuthApi = {
  login: (payload: LoginRequest) =>
    apiClient.post<LoginResponse>("/api/auth/login", payload),

  loginWithGoogle: (payload: OAuthCodeRequest) =>
    apiClient.get<OAuthLoginResponse>("/api/auth/google/callback", {
      params: payload,
    }),
  loginWithKakao: (payload: OAuthCodeRequest) =>
    apiClient.get<OAuthLoginResponse>("/api/auth/kakao/callback", {
      params: payload,
    }),
  getGoogleLoginUrl: () =>
    apiClient.get<SocialAuthUrlResponse>("/api/auth/google/authorize-uri"),
  getKakaoLoginUrl: () =>
    apiClient.get<SocialAuthUrlResponse>("/api/auth/kakao/authorize-uri"),
  checkNickname: (nickname: string) =>
    apiClient.get<NicknameCheckResponse>("/api/auth/check-nickname", {
      params: { nickname },
    }),
  requestEmailVerification: (payload: EmailVerificationRequest) =>
    apiClient.post<CommonResponse<void>>(
      "/api/auth/email-verification",
      payload,
    ),
  confirmEmailVerification: (payload: EmailVerificationConfirmRequest) =>
    apiClient.post<CommonResponse<void>>(
      "/api/auth/email-verification/confirm",
      payload,
    ),
  signup: (payload: SignupRequest) =>
    apiClient.post<SignupResponse>("/api/auth/signup", payload),
  logout: async (): Promise<CommonResponse<null>> => {
    const { data } = await apiClient.post("/api/auth/logout");
    return data;
  },
  withdraw: async (): Promise<CommonResponse<null>> => {
    const { data } = await apiClient.delete("/api/auth/withdraw");
    return data;
  },
};
