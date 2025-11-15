import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../lib/apiClient";
import { AuthApi } from "../../api/auth";
import { UserApi } from "@/api/user";

/**
 * Handles the Kakao OAuth callback: exchanges the authorization code for tokens, applies authentication state, checks onboarding status, and redirects the user accordingly.
 *
 * This component reads the `code` query parameter from the current URL. If present, it exchanges the code for access and refresh tokens, sets the access token for API requests, stores the refresh token in localStorage, queries whether the user has completed onboarding, and navigates to `/feed` if onboarding exists or to `/onboarding` otherwise. If the onboarding check fails it navigates to `/onboarding`. If the login exchange fails it shows an alert and navigates to `/`.
 *
 * Side effects:
 * - Calls authentication and user APIs.
 * - Calls setAuthToken with the retrieved access token.
 * - Stores the refresh token in localStorage under `refreshToken`.
 * - Navigates to `/feed`, `/onboarding`, or `/` depending on outcomes.
 * - Logs errors to the console and shows an alert on login failure.
 *
 * @returns A React element shown while the Kakao callback is being processed.
 */
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
            await UserApi.checkOnboardingExistence();

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