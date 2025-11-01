import { useState } from "react";

export default function SignupPage() {
  const [nickname, setNickname] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);

  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [code, setCode] = useState("");
  const [codeChecked, setCodeChecked] = useState(false);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 예시용 (닉네임 중복확인)
  const handleCheckNickname = () => {
    if (nickname.trim() === "") return alert("닉네임을 입력해주세요.");
    // TODO: 서버에 중복확인 요청
    setNicknameChecked(true);
  };

  const handleSendEmail = () => {
    if (!nicknameChecked) return alert("닉네임 중복 확인을 먼저 해주세요.");
    if (!email.includes("@"))
      return alert("올바른 이메일 주소를 입력해주세요.");
    alert("인증 메일을 발송했습니다!");
    setEmailVerified(true); // ✅ 버튼 누르면 이게 true로 변경됨
  };

  const handleVerifyCode = () => {
    if (code === "1234") {
      alert("인증 성공!");
      setCodeChecked(true);
    } else {
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFFDF4] py-10">
      <div className="w-full max-w-sm">
        <h2 className="text-[#5D3C28] text-xl font-bold mb-6 text-center">
          회원가입
        </h2>

        {/* 닉네임 */}
        <label className="block text-sm font-medium mb-1">닉네임</label>
        <div className="mb-4 relative">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
            className="w-full border rounded px-3 py-2 pr-20" // ✅ 오른쪽 버튼 공간 확보 (pr-20)
          />
          <button
            onClick={handleCheckNickname}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8D6E63] text-white text-sm px-3 py-1 rounded"
          >
            중복 확인
          </button>
        </div>

        {/* 이메일 (닉네임 확인 후 표시) */}
        {nicknameChecked && (
          <>
            <label className="block text-sm font-medium mb-1">이메일</label>
            <div className="mb-4 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ID@example.com"
                className="w-full border rounded px-3 py-2 pr-20" // ✅ 버튼 공간 확보
              />
              <button
                onClick={handleSendEmail}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8D6E63] text-white text-sm px-3 py-1 rounded"
              >
                인증하기
              </button>
            </div>
          </>
        )}

        {/* 인증번호 입력창: 이메일 인증 버튼을 누른 경우에만 표시 */}
        {nicknameChecked && emailVerified && !codeChecked && (
          <>
            <label className="block text-sm font-medium mb-1">인증번호</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="인증번호 입력"
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                onClick={handleVerifyCode}
                className="px-4 bg-[#8D6E63] text-white rounded"
              >
                확인
              </button>
            </div>
          </>
        )}

        {/* 인증 성공 후 하단 폼 표시 */}
        {codeChecked && (
          <>
            <label className="block text-sm font-medium mb-1">전화번호</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="전화번호"
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <label className="block text-sm font-medium mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <label className="block text-sm font-medium mb-1">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호 확인"
              className="w-full border rounded px-3 py-2 mb-6"
            />

            <button className="w-full bg-[#BCAAA4] text-white py-2 rounded">
              회원가입
            </button>
          </>
        )}
      </div>
    </div>
  );
}
