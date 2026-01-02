import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../lib/apiClient";
import { AuthApi } from "../../api/auth";
import { UserApi } from "@/api/user";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) {
      navigate("/", { replace: true });
      return;
    }

    const handleGoogleAuth = async () => {
      try {
        const { data } = await AuthApi.loginWithGoogle({ code }); // 백엔드로 code 전달
        console.log(data);
        if (!data.isSuccess || !data.data) {
          throw new Error(data.message || "구글 로그인 실패");
        }

        const { accessToken, refreshToken, userInfo } = data.data;
        setAuthToken(accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        sessionStorage.setItem("userId", String(userInfo.userId));
        sessionStorage.setItem("nickname", userInfo.nickname);

        const { data: onboardingData } =
          await UserApi.checkOnboardingExistence();
        const alreadyOnboarded =
          onboardingData.data?.isExist ??
          onboardingData.data?.exists ??
          onboardingData.data?.hasOnboardingInformation ??
          false;

        navigate(alreadyOnboarded ? "/feed" : "/onboarding", { replace: true });
      } catch (err) {
        console.error("구글 로그인 실패:", err);
        alert("구글 로그인 실패");
        navigate("/", { replace: true });
      }
    };

    void handleGoogleAuth();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen text-[#5D3C28]">
      구글 로그인 중...
    </div>
  );
}
