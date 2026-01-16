import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../lib/apiClient";
import { AuthApi } from "../../api/auth";
import { UserApi } from "@/api/user";
import { useQueryClient } from "@tanstack/react-query";
import { USER_PROFILE } from "@/constants/queryKeys";

export default function KakaoCallback() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(window.location.search);
    const code = new URLSearchParams(window.location.search).get("code");
    console.log(code);
    if (!code) {
      navigate("/", { replace: true });
      return;
    }

    const handleKakaoAuth = async () => {
      try {
        const { data } = await AuthApi.loginWithKakao({ code }); // 백엔드로 code 전달
        console.log(data);
        if (!data.isSuccess || !data.data) {
          throw new Error(data.message || "카카오 로그인 실패");
        }

        const { accessToken, refreshToken } = data.data;
        setAuthToken(accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        try {
          const profileRes = await UserApi.fetchUserProfile();
          if (profileRes?.data) {
            queryClient.setQueryData(USER_PROFILE, profileRes.data);
          }
        } catch (profileError) {
          console.error("프로필 캐시 저장 실패:", profileError);
        }

        const { data: onboardingData } =
          await UserApi.checkOnboardingExistence();
        const alreadyOnboarded =
          onboardingData.data?.isExist ??
          onboardingData.data?.exists ??
          onboardingData.data?.hasOnboardingInformation ??
          false;

        navigate(alreadyOnboarded ? "/feed" : "/onboarding", { replace: true });
      } catch (err) {
        console.error("카카오 로그인 실패:", err);
        alert("카카오 로그인 실패");
        navigate("/", { replace: true });
      }
    };

    void handleKakaoAuth();
  }, [navigate, queryClient]);

  return (
    <div className="flex justify-center items-center h-screen text-[#5D3C28]">
      카카오 로그인 중...
    </div>
  );
}
