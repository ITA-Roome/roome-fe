import {
  EmailVerificationConfirmRequest,
  EmailVerificationRequest,
  LoginRequest,
  LoginResponse,
  NicknameCheckResponse,
  EmailExistResponse,
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
  checkEmailExists: (email: string) =>
    apiClient.get<EmailExistResponse>("/api/auth/check-email", {
      params: { email },
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
  passwordConfirm: async (password: string): Promise<CommonResponse<void>> => {
    const { data } = await apiClient.post<CommonResponse<void>>(
      "/api/auth/password/confirm",
      { password },
    );
    return data;
  },
  changePassword: async (
    payload: LoginRequest,
  ): Promise<CommonResponse<void>> => {
    const { data } = await apiClient.patch<CommonResponse<void>>(
      "/api/auth/password",
      payload,
    );
    return data;
  },
  withdraw: async (): Promise<CommonResponse<null>> => {
    const { data } = await apiClient.delete("/api/auth/withdraw");
    return data;
  },
};
