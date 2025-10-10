import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

type LoginErrorResponse = {
  message?: string;
};

export default function LoginPage() {
  // 상태 정의
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 입력 초기화 함수
  const handleClear = (field: "email" | "password") => {
    if (field === "email") setEmail("");
    if (field === "password") setPassword("");
  };

  // 로그인 유효성 검사
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  // 로그인 로직
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 새로고침 방지
    setError(""); // 에러 초기화
    setLoading(true); // 로딩 시작

    try {
      // 로그인 요청 (백엔드 URL은 실제 API 주소로 변경)
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        { email, password },
      );

      // 로그인 성공 시
      if (response.status === 200 && response.data?.token) {
        const { token, user } = response.data;

        // 토큰 저장 (localStorage 또는 sessionStorage)
        localStorage.setItem("token", token);

        // 로그인 성공 피드백
        console.log("로그인 성공:", user);
        // React Router로 페이지 이동 (전체 새로고침 x)
        navigate("/home");
      }
    } catch (error) {
      if (axios.isAxiosError<LoginErrorResponse>(error)) {
        const { status, data } = error.response ?? {};
        if (status === 401) {
          setError(
            data?.message ?? "이메일 또는 비밀번호가 올바르지 않습니다.",
          );
        } else {
          setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

  const handleKakaoLogin = () => {
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoURL;
  };

  const handleGoogleLogin = () => {
    const googleURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;
    window.location.href = googleURL;
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#FFFDF4]">
      {/* 로그인 카드 컨테이너 */}
      <div className="text-center w-full max-w-sm">
        {/* 타이틀 영역 */}
        <h2 className="font-pretendard font-black text-[20px] text-[#5D3C28] leading-[25px] tracking-[0.4px] mb-4">
          내 방이 따뜻해지는 가장 쉬운 방법
        </h2>
        <h3 className="font-pretendard font-normal text-[14px] text-[#5D3C28] leading-[25px] tracking-[0.4px] mb-15">
          작은 방이 나답게 채워지는 경험을 시작해보세요
        </h3>

        {/* 로그인 폼 영역 */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 px-[10px]">
          {/* 이메일 입력창 */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 입력"
              className="w-full h-[50px] p-3 pr-10 bg-white border border-[#5D3C28] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D3C28] placeholder-[#8D7569]"
            />
            {/* 입력값이 있을 때만 X 버튼 보이기 */}
            {email && (
              <button
                type="button"
                onClick={() => handleClear("email")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5D3C28] text-xl"
              >
                ×
              </button>
            )}
          </div>

          {/* 비밀번호 입력창 */}
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full h-[50px] p-3 pr-10 bg-white border border-[#5D3C28] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D3C28] placeholder-[#8D7569]"
            />
            {/* 입력값이 있을 때만 X 버튼 보이기 */}
            {password && (
              <button
                type="button"
                onClick={() => handleClear("password")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5D3C28] text-xl"
              >
                ×
              </button>
            )}
          </div>

          {/* 에러 메시지 표시 */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* 로그인 버튼 (입력값이 없으면 비활성화) */}
          <button
            type="submit"
            disabled={!isFormValid || loading} // ← 둘 다 입력되어야 활성화
            className={`font-semibold h-[50px] py-2 rounded-md transition duration-300 
              ${
                isFormValid && !loading
                  ? "bg-[#5D3C28] hover:bg-[#4A3020] text-white cursor-pointer"
                  : "bg-[#D1C2B8] text-white cursor-not-allowed opacity-50"
              }`}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 회원가입 안내 문구 */}
        <h4 className="text-base font-normal text-[#5D3C28] mt-4">
          아직 계정이 없나요?{" "}
          <Link
            to="/signup" // 회원가입 페이지로 이동
            className="text-[#5D3C28] font-semibold hover:underline hover:text-[#3E271B]"
          >
            회원가입
          </Link>
        </h4>

        {/* "또는" 구분선 */}
        <div className="flex items-center justify-center gap-2 my-6">
          <div className="flex-1 border-t border-[#5D3C28]"></div>
          <span className="text-[#5D3C28] text-sm font-normal">또는</span>
          <div className="flex-1 border-t border-[#5D3C28]"></div>
        </div>

        {/* SNS 로그인 버튼 영역 */}
        <div className="flex justify-center items-center gap-6">
          {/* 카카오 버튼 */}
          <button
            type="button"
            onClick={handleKakaoLogin}
            className="w-12 h-12 rounded-full bg-[#8D7569] flex justify-center items-center hover:bg-[#7B655B] transition duration-300"
          >
            {/* 나중에 <img src="/kakao.png" alt="Kakao" className="w-6 h-6" /> 로 교체 */}
            <span className="text-white text-sm font-semibold">TALK</span>
          </button>

          {/* 구글 버튼 */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-12 h-12 rounded-full bg-[#8D7569] flex justify-center items-center hover:bg-[#7B655B] transition duration-300"
          >
            {/* 나중에 <img src="/google.png" alt="Google" className="w-6 h-6" /> 로 교체 */}
            <span className="text-white text-lg font-bold">G</span>
          </button>
        </div>
      </div>
    </div>
  );
}
