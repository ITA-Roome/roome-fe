import { useState } from "react";

export default function ChangePasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);

  const [email, setEmail] = useState("");
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const handleEmailSubmit = () => {
    // TODO: 이메일 인증 / 유효성 검사 API 호출
    // 성공 시 다음 단계로 이동
    setStep(2);
  };

  const handlePasswordChange = () => {
    // TODO: 비밀번호 변경 API 호출
    console.log("비밀번호 변경", oldPw, newPw, confirmPw);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF4] px-5 pt-24">
      <h1 className="text-center text-[#5D3C28] text-lg font-semibold mb-10">
        비밀번호 변경
      </h1>

      {/* ----------------- STEP 1 : 이메일 입력 ----------------- */}
      {step === 1 && (
        <div className="max-w-sm mx-auto">
          <label className="text-sm text-[#5D3C28]">이메일 주소</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 border border-[#C7B5A1] rounded-[8px] px-4 py-3"
            placeholder="example@romme.com"
          />

          <button
            onClick={handleEmailSubmit}
            className="w-full mt-6 py-3 bg-[#5D3C28] text-white rounded-[8px]"
          >
            비밀번호 변경
          </button>
        </div>
      )}

      {/* ----------------- STEP 2 : 새 비밀번호 설정 ----------------- */}
      {step === 2 && (
        <div className="max-w-sm mx-auto">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#5D3C28]">이전 비밀번호</label>
              <input
                type="password"
                value={oldPw}
                onChange={(e) => setOldPw(e.target.value)}
                className="w-full mt-2 border border-[#C7B5A1] rounded-[8px] px-4 py-3"
                placeholder="비밀번호 입력"
              />
            </div>

            <div>
              <label className="text-sm text-[#5D3C28]">
                새로운 비밀번호 – 최소 8자 이상 / 영문 / 숫자 / 특수문자 포함
              </label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="w-full mt-2 border border-[#C7B5A1] rounded-[8px] px-4 py-3"
                placeholder="비밀번호 입력"
              />
            </div>

            <div>
              <label className="text-sm text-[#5D3C28]">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className="w-full mt-2 border border-[#C7B5A1] rounded-[8px] px-4 py-3"
                placeholder="비밀번호 입력"
              />
            </div>
          </div>

          <button
            onClick={handlePasswordChange}
            className="w-full mt-8 py-3 bg-[#C7B5A1] text-white rounded-[8px]"
          >
            비밀번호 변경
          </button>
        </div>
      )}
    </div>
  );
}
