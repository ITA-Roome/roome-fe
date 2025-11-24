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

type CommonResponse<T = undefined> = {
  isSuccess: boolean;
  code: string;
  message: string;
  data?: T;
  success: boolean;
};

type NicknameCheckResponse = CommonResponse<{ isExist: boolean }>;
type EmailVerificationRequest = { email: string };
type EmailVerificationConfirmRequest = {
  email: string;
  emailVerificationCode: string;
};

type SignupRequest = {
  email: string;
  nickname: string;
  password: string;
  phoneNumber: string;
};
type SignupResponse = CommonResponse<{ userId: number }>;

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
    apiClient.post<CommonResponse>("/api/auth/email-verification", payload),
  confirmEmailVerification: (payload: EmailVerificationConfirmRequest) =>
    apiClient.post<CommonResponse>(
      "/api/auth/email-verification/confirm",
      payload,
    ),
  signup: (payload: SignupRequest) =>
    apiClient.post<SignupResponse>("/api/auth/signup", payload),
  logout: async (): Promise<CommonResponse<null>> => {
    const { data } = await apiClient.post("/api/auth/logout");
    return data;
  },
};
