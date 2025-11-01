import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignupEmailPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [phone, setPhone] = useState("");
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
        {/* 회원가입 폼 */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 px-[10px] text-left"
        >
          {/* 닉네임 */}
          <div className="relative">
            <label className="block text-[#5D3C28] text-sm mb-1">닉네임</label>
            <div className="relative">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력해주세요"
                className="w-full h-[50px] pl-3 pr-24 border border-[#5D3C28] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#5D3C28] placeholder-[#8D7569]"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8D7569] text-white text-sm px-3 py-1 rounded"
              >
                중복 확인
              </button>
            </div>
          </div>

          {/* 이메일 */}
          <div className="relative">
            <label className="block text-[#5D3C28] text-sm mb-1">
              이메일 주소
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ID@example.com"
                className="w-full h-[50px] pl-3 pr-24 border border-[#5D3C28] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#5D3C28] placeholder-[#8D7569]"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8D7569] text-white text-sm px-3 py-1 rounded"
              >
                인증하기
              </button>
            </div>
          </div>

          {/* 인증번호 */}
          <div className="relative">
            <label className="block text-[#5D3C28] text-sm mb-1">
              인증번호
            </label>
            <div className="relative">
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="인증번호 입력"
                className="w-full h-[50px] pl-3 pr-20 border border-[#5D3C28] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#5D3C28] placeholder-[#8D7569]"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8D7569] text-white text-sm px-3 py-1 rounded"
              >
                확인
              </button>
            </div>
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-[#5D3C28] text-sm mb-1">
              전화번호
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="전화번호"
              className="w-full h-[50px] p-3 border border-[#5D3C28] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#5D3C28] placeholder-[#8D7569]"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-[#5D3C28] text-sm mb-1">
              비밀번호{" "}
              <span className="text-xs">
                (최소 8자 이상 / 영문, 숫자, 특수문자 포함)
              </span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full h-[50px] p-3 border border-[#5D3C28] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#5D3C28] placeholder-[#8D7569]"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-[#5D3C28] text-sm mb-1">
              비밀번호 확인
            </label>
            {!isMatch && passwordConfirm.length > 0 && (
              <p className="text-red-500 text-xs mb-1">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
            <input
              type="password"
              value={passwordConfirm}
              onChange={handleConfirmChange}
              placeholder="비밀번호 확인"
              className={`w-full h-[50px] p-3 border rounded-md bg-white focus:outline-none focus:ring-2 ${
                isMatch
                  ? "border-[#5D3C28] focus:ring-[#5D3C28]"
                  : "border-red-500 focus:ring-red-400"
              } placeholder-[#8D7569]`}
            />
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="w-full h-[50px] mt-2 bg-[#D3C6BC] text-[#5D3C28] font-medium rounded-md"
          >
            회원가입
          </button>
        </form>

        {/* 로그인 문구 */}
        <p className="text-center text-sm text-[#5D3C28] mt-4">
          이미 ROOME 회원이라면?{" "}
          <Link
            to="/" // 로그인 페이지로 이동
            className="text-[#5D3C28] font-semibold hover:underline hover:text-[#3E271B]"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
