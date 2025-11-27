export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
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

export type OAuthCodeRequest = {
  code: string;
};

export type SocialAuthUrlResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  data: { authorizeUri: string };
  success: boolean;
};

export type OAuthLoginResponse = {
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

export type CommonResponse<T = undefined> = {
  isSuccess: boolean;
  code: string;
  message: string;
  data?: T;
  success: boolean;
};

export type NicknameCheckResponse = CommonResponse<{ isExist: boolean }>;
export type EmailVerificationRequest = { email: string };
export type EmailVerificationConfirmRequest = {
  email: string;
  emailVerificationCode: string;
};

export type SignupRequest = {
  email: string;
  nickname: string;
  password: string;
  phoneNumber: string;
};
export type SignupResponse = CommonResponse<{ userId: number }>;
