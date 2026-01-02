import { Link, useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();

  const handleEmailSignup = () => {
    navigate("/signup/email");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center w-full max-w-sm">
        <h2 className="font-pretendard font-black text-[20px] text-[#5D3C28] leading-[25px] tracking-[0.4px] mb-4">
          내 방이 따뜻해지는 가장 쉬운 방법
        </h2>
        <h3 className="font-pretendard font-normal text-[14px] text-[#5D3C28] leading-[25px] tracking-[0.4px] mb-15">
          작은 방이 나답게 채워지는 경험을 시작해보세요
        </h3>

        <div className="flex flex-col gap-3 w-full">
          <button className="h-[50px] bg-[#FAE100] text-#5D3C28 rounded-3xl mx-2.5">
            카카오톡으로 회원가입
          </button>
          <button className="h-[50px] text-#5D3C28 rounded-3xl mx-2.5 border border-[#5D3C28]">
            구글로 회원가입
          </button>
          <button
            onClick={handleEmailSignup}
            className="h-[50px] bg-[#5D3C28] text-white rounded-3xl mx-2.5"
          >
            이메일로 회원가입
          </button>
        </div>

        <h3 className="font-pretendard font-normal text-[14px] text-[#5D3C28] leading-[25px] tracking-[0.4px] mt-5">
          이미 ROOME 회원이라면?
          <Link
            to="/"
            className="text-[#5D3C28] font-semibold hover:underline hover:text-[#3E271B]"
          >
            로그인
          </Link>
        </h3>
      </div>
    </div>
  );
}
