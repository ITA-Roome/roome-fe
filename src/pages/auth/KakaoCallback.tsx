import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../lib/apiClient";
import { AuthApi } from "../../api/auth";

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
        const { accessToken } = data.data;

        setAuthToken(accessToken);
        navigate("/feed");
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
