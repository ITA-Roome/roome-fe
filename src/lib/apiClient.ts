import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    for (const key in params) {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, value as string);
      }
    }
    return searchParams.toString();
  },
});

const AUTH_FREE_PATHS = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/google/authorize-uri",
  "/api/auth/kakao/authorize-uri",
  "/api/auth/google/callback",
  "/api/auth/kakao/callback",
];

const NO_REISSUE_PATHS = [
  "/api/auth/logout",
  "/api/auth/withdraw",
  "/api/auth/password/confirm",
];

apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  // 인증이 필요 없는 요청이면 토큰을 붙이지 않는다
  if (config.url && AUTH_FREE_PATHS.some((p) => config.url?.includes(p))) {
    return config;
  }

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data;

    if (
      body &&
      typeof body === "object" &&
      ("success" in body || "isSuccess" in body)
    ) {
      const ok = body.success ?? body.isSuccess ?? false;

      if (!ok) {
        throw new Error(body.message || "요청 처리에 실패했습니다.");
      }
    }

    return response;
  },
  (error) => {
    const { response, config } = error || {};
    const status = response?.status;

    // 401 만료 시 리프레시 토큰으로 1회 재발급 후 재시도
    if (
      status === 401 &&
      config &&
      !config._retry &&
      !AUTH_FREE_PATHS.some((p) => config.url?.includes(p)) &&
      !NO_REISSUE_PATHS.some((p) => config.url?.includes(p))
    ) {
      config._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return Promise.reject(error);
      }

      return axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          { refreshToken },
          { withCredentials: true },
        )
        .then((res) => {
          const newToken =
            res.data?.data?.accessToken || res.data?.accessToken || "";

          if (!newToken) {
            throw new Error("토큰 재발급 실패");
          }

          setAuthToken(newToken);
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(config);
        })
        .catch((refreshErr) => {
          // 재발급 실패 시 토큰을 지우고 원래 에러 반환
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          return Promise.reject(refreshErr);
        });
    }

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "서버 오류가 발생했습니다.";

    return Promise.reject(new Error(message));
  },
);

export const setAuthToken = (token: string | null) => {
  if (!token) {
    localStorage.removeItem("token");
    return;
  }

  localStorage.setItem("token", token);
};
