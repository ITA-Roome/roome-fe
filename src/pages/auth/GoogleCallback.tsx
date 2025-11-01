import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../../lib/apiClient";
import { AuthApi } from "../../api/auth";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) {
      return;
    }

    const handleGoogleAuth = async () => {
      try {
        const { data } = await AuthApi.loginWithGoogle({ code });
        const { accessToken } = data.data;

        setAuthToken(accessToken);
        navigate("/home");
      } catch (error) {
        console.error("구글 로그인 실패", error);
        alert("구글 로그인 실패");
        navigate("/login");
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
