import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/auth/kakao`, { code })
        .then((res) => {
          const token = res.data.token;
          localStorage.setItem("token", token);
          navigate("/home");
        })
        .catch(() => {
          alert("카카오 로그인 실패");
          navigate("/login");
        });
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen text-[#5D3C28]">
      카카오 로그인 중...
    </div>
  );
}
