import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../lib/apiClient";
import { AuthApi } from "../../api/auth";
import { OnboardingApi } from "@/api/user";

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) {
      return;
    }

    const handleKakaoAuth = async () => {
      try {
        const { data } = await AuthApi.loginWithKakao({ code });
        const { accessToken, refreshToken } = data.data;

        setAuthToken(accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        try {
          const { data: onboardingData } =
            await OnboardingApi.checkOnboardingExistence();

          const alreadyOnboarded =
            onboardingData.data?.isExist ??
            onboardingData.data?.exists ??
            onboardingData.data?.hasOnboardingInformation ??
            false;

          navigate(alreadyOnboarded ? "/feed" : "/onboarding", {
            replace: true,
          });
        } catch (existError) {
          console.error("온보딩 여부 확인 실패:", existError);
          navigate("/onboarding", { replace: true });
        }
      } catch (error) {
        console.error("카카오 로그인 실패", error);
        alert("카카오 로그인 실패");
        navigate("/");
      }
    };

    void handleKakaoAuth();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen text-[#5D3C28]">
      카카오 로그인 중...
    </div>
  );
}
