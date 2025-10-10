import { useState } from "react";

export default function SignupEmailPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isMatch, setIsMatch] = useState(true);

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordConfirm(value);
    setIsMatch(value === password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isMatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    alert("회원가입 완료!");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#FFFDF4]">
      {/* 회원가입 카드 컨테이너 */}
      <div className="text-center w-full max-w-sm">
        {/* 타이틀 영역 */}
        <h2 className="font-pretendard font-black text-[20px] text-[#5D3C28] leading-[25px] tracking-[0.4px] mb-4">
          내 방이 따뜻해지는 가장 쉬운 방법
        </h2>
        <h3 className="font-pretendard font-normal text-[14px] text-[#5D3C28] leading-[25px] tracking-[0.4px] mb-15">
          작은 방이 나답게 채워지는 경험을 시작해보세요
        </h3>

        {/* 로그인 폼 영역 */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 px-[10px] text-left"
        >
          {/* 닉네임 입력창 */}
          <div className="relative">
            <label className="block text-[#5D3C28] text-sm mb-1">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력해주세요"
              className="w-full h-[50px] p-3 bg-white border border-[#5D3C28] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D3C28] placeholder-[#8D7569]"
            />
          </div>

          {/* 이메일 입력창 */}
          <div className="relative">
            <label className="block text-[#5D3C28] text-sm mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소를 입력해주세요"
              className="w-full h-[50px] p-3 bg-white border border-[#5D3C28] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D3C28] placeholder-[#8D7569]"
            />
          </div>

          {/* 비밀번호 입력창 */}
          <div className="relative">
            <label className="block text-[#5D3C28] text-sm mb-1">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              className="w-full h-[50px] p-3 bg-white border border-[#5D3C28] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D3C28] placeholder-[#8D7569]"
            />
          </div>

          {/* 비밀번호 확인창 */}
          <div className="relative">
            <label className="block text-[#5D3C28] text-sm mb-1">
              비밀번호 확인
            </label>

            {/* 🚨 비밀번호 불일치 문구 */}
            {!isMatch && passwordConfirm.length > 0 && (
              <p className="text-red-500 text-xs mb-1">
                비밀번호가 일치하지 않습니다.
              </p>
            )}

            <input
              type="password"
              value={passwordConfirm}
              onChange={handleConfirmChange}
              placeholder="비밀번호를 다시 입력해주세요"
              className={`w-full h-[50px] p-3 bg-white border rounded-md focus:outline-none focus:ring-2 ${
                isMatch
                  ? "border-[#5D3C28] focus:ring-[#5D3C28]"
                  : "border-red-500 focus:ring-red-400"
              } placeholder-[#8D7569]`}
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="h-[50px] bg-[#5D3C28] text-white rounded-md hover:bg-[#4A2F1F] mt-2"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
