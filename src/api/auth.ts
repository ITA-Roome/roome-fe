import { apiClient } from "../lib/apiClient";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  isSuccess: boolean;
  code: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    userInfo: {
      userId: number;
      nickname: string;
      email: string;
      loginType: string;
    };
  };
  message?: string;
};

type OAuthCodeRequest = {
  code: string;
};

type SocialAuthUrlResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: { authorizeUri: string };
  success: boolean;
};

type OAuthLoginResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    userInfo: {
      userId: number;
      nickname: string;
      email: string;
      loginType: string;
    };
  };
  success: boolean;
};

export const AuthApi = {
  login: (payload: LoginRequest) =>
    apiClient.post<LoginResponse>("/api/auth/login", payload),
  loginWithGoogle: (payload: OAuthCodeRequest) =>
    apiClient.post<OAuthLoginResponse>("/api/auth/google/callback", payload),
  loginWithKakao: (payload: OAuthCodeRequest) =>
    apiClient.post<OAuthLoginResponse>("/api/auth/kakao/callback", payload),
  getGoogleLoginUrl: () =>
    apiClient.get<SocialAuthUrlResponse>("/api/auth/google/authorize-uri"),
  getKakaoLoginUrl: () =>
    apiClient.get<SocialAuthUrlResponse>("/api/auth/kakao/authorize-uri"),
};
