import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  if (config.url?.includes("/api/auth/login")) {
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
