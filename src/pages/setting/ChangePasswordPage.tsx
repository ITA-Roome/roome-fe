import { useState, useEffect } from "react";
import { UserApi } from "@/api/user";

/**
 * Renders a two-step password change page that verifies the signed-in user's email and lets them set a new password.
 *
 * The component loads the current user's email, shows a loading state while fetching, requires the entered email to match
 * the account email to proceed to the new-password form, and validates that the new password and confirmation match
 * before enabling the change action.
 *
 * @returns The React element for the password change UI.
 */
export default function ChangePasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);

  const [userEmail, setUserEmail] = useState("");

  const [email, setEmail] = useState("");
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await UserApi.fetchUserProfile();

        if (response.isSuccess && response.data) {
          setUserEmail(response.data.email);
        }
      } catch (err) {
        console.error("사용자 정보 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // 🔹 정규식: 최소 8자 + 영문 + 숫자 + 특수문자 포함
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&~^+=-])[A-Za-z\d@$!%*#?&~^+=-]{8,}$/;

  const isEmailValid = email === userEmail;
  const isPasswordValid = passwordRegex.test(newPw);

  // 새 비밀번호 === 확인 입력
  const isPwMatch =
    newPw.length > 0 && confirmPw.length > 0 && newPw === confirmPw;

  // 버튼 활성화 조건 업데이트
  const isChangeEnabled = oldPw.length > 0 && isPasswordValid && isPwMatch;

  const handleEmailSubmit = () => {
    if (!isEmailValid) return;
    setStep(2);
  };

  const handlePasswordChange = () => {
    if (!isChangeEnabled) return;
    // TODO: Implement API call to change password
    // await AuthApi.changePassword({ oldPassword: oldPw, newPassword: newPw });
    alert("비밀번호 변경 API가 아직 연동되지 않았습니다.");
  };

  if (loading) return <div className="pt-24 text-center">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-[#FFFDF4] px-5 pt-24">
      <h1 className="text-center text-[#5D3C28] text-lg font-semibold mb-10">
        비밀번호 변경
      </h1>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="max-w-sm mx-auto">
          <label className="text-sm text-[#5D3C28]">이메일 주소</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full mt-2 border rounded-[8px] px-4 py-3 ${
              isEmailValid ? "border-green-500" : "border-[#C7B5A1]"
            }`}
            placeholder="example@romme.com"
          />

          <button
            onClick={handleEmailSubmit}
            disabled={!isEmailValid}
            className={`w-full mt-6 py-3 rounded-[8px] text-white transition ${
              isEmailValid ? "bg-[#5D3C28]" : "bg-[#C7B5A1] opacity-50"
            }`}
          >
            비밀번호 변경
          </button>

          {!isEmailValid && email.length > 0 && (
            <p className="text-xs text-red-500 mt-2">
              🔒 입력한 이메일이 계정과 일치하지 않습니다.
            </p>
          )}
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="max-w-sm mx-auto space-y-4">
          {/* 기존 비밀번호 */}
          <div>
            <label className="text-sm text-[#5D3C28]">기존 비밀번호</label>
            <input
              type="password"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              className="w-full mt-2 border border-[#C7B5A1] rounded-[8px] px-4 py-3"
              placeholder="현재 비밀번호 입력"
            />
          </div>

          {/* 새 비밀번호 */}
          <div>
            <label className="text-sm text-[#5D3C28]">
              새로운 비밀번호 – 최소 8자 이상 / 영문 / 숫자 / 특수문자 포함
            </label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className="w-full mt-2 border border-[#C7B5A1] rounded-[8px] px-4 py-3"
              placeholder="새 비밀번호 입력"
            />

            {newPw && !isPasswordValid && (
              <p className="text-xs text-red-500 mt-1">
                최소 8자, 영문, 숫자, 특수문자를 포함해야 합니다.
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="text-sm text-[#5D3C28]">비밀번호 확인</label>
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className="w-full mt-2 border border-[#C7B5A1] rounded-[8px] px-4 py-3"
              placeholder="다시 입력"
            />

            {confirmPw && !isPwMatch && (
              <p className="text-xs text-red-500 mt-1">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          {/* 변경 버튼 */}
          <button
            onClick={handlePasswordChange}
            disabled={!isChangeEnabled}
            className={`w-full mt-8 py-3 rounded-[8px] text-white transition ${
              isChangeEnabled ? "bg-[#5D3C28]" : "bg-[#C7B5A1] opacity-50"
            }`}
          >
            비밀번호 변경
          </button>
        </div>
      )}
    </div>
  );
}