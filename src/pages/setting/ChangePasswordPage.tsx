import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserApi } from "@/api/user";
import { AuthApi } from "@/api/auth";

import axios from "axios";
import PageContainer from "@/components/layout/PageContainer";

export default function ChangePasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);

  const [userEmail, setUserEmail] = useState("");

  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [loading, setLoading] = useState(true);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&~^+=-])[A-Za-z\d@$!%*#?&~^+=-]{8,}$/;

  const isPasswordValid = passwordRegex.test(newPw);

  const isPwMatch = confirmPw.length > 0 && newPw === confirmPw;
  const isChangeEnabled = isPasswordValid && isPwMatch;

  const canVerifyOldPw = oldPw.trim().length > 0;
  const canChange =
    newPw.trim().length > 0 &&
    confirmPw.trim().length > 0 &&
    newPw === confirmPw;

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

  const handlePasswordConfirm = async () => {
    if (!canVerifyOldPw) return;
    setVerifyLoading(true);
    setErrorMessage("");

    try {
      const res = await AuthApi.passwordConfirm(oldPw.trim());
      if (!res.isSuccess) {
        setErrorMessage(res.message || "비밀번호가 올바르지 않습니다.");
        return;
      }
      setStep(2);
    } catch (error) {
      const msg = axios.isAxiosError(error)
        ? ((error.response?.data as { message?: string })?.message ??
          "비밀번호 확인 중 오류가 발생했습니다.")
        : "비밀번호 확인 중 오류가 발생했습니다.";
      setErrorMessage(msg);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!canChange) return;
    setSubmitLoading(true);
    setErrorMessage("");
    try {
      const res = await AuthApi.changePassword({
        email: userEmail,
        password: newPw.trim(),
      });

      if (!res.isSuccess) {
        setErrorMessage(res.message || "비밀번호 변경에 실패했습니다.");
        return;
      }

      alert("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
      // 필드 초기화 및 navigate로 이동
      setOldPw("");
      setNewPw("");
      setConfirmPw("");
      setUserEmail("");
      setStep(1);
      navigate("/login", { replace: true });
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "비밀번호 변경 중 오류가 발생했습니다.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="pt-24 text-center">로딩 중...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* STEP 1 */}
      {step === 1 && (
        <div className="max-w-sm mx-auto mt-10">
          <label className="text-sm text-primary-200">기존 비밀번호</label>
          <input
            type="password"
            value={oldPw}
            onChange={(e) => setOldPw(e.target.value)}
            className={
              "w-full mt-2 border border-primary-700 rounded-3xl px-4 py-3 placeholder:text-primary-200"
            }
            placeholder="비밀번호 입력"
          />
          {errorMessage && (
            <p className="text-xs text-red-500">{errorMessage}</p>
          )}
          <button
            onClick={handlePasswordConfirm}
            disabled={!canVerifyOldPw || verifyLoading}
            className={`w-full mt-7 py-3 rounded-3xl font-semibold text-white transition ${
              canVerifyOldPw && !verifyLoading
                ? "bg-primary-700"
                : "bg-[#C7B5A1] opacity-50"
            }`}
          >
            {verifyLoading ? "확인 중..." : "비밀번호 변경"}
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="flex min-h-[70vh] flex-col max-w-sm mx-auto space-y-4 mt-10">
          <div>
            <label className="text-sm text-primary-200">
              새로운 비밀번호 – 최소 8자 이상 / 영문 / 숫자 / 특수문자 포함
            </label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className={`w-full mt-2 border border-primary-700 rounded-3xl px-4 py-3 placeholder:text-primary-200 ${
                newPw && !isPasswordValid
                  ? "border-red-500"
                  : "border-[#C7B5A1]"
              }`}
              placeholder="새 비밀번호 입력"
            />
            {newPw && !isPasswordValid && (
              <p className="text-xs text-red-500 mt-1">
                최소 8자, 영문, 숫자, 특수문자를 포함해야 합니다.
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-primary-200">비밀번호 확인</label>
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className={`w-full mt-2 border border-primary-700 rounded-3xl px-4 py-3 placeholder:text-primary-200 ${
                confirmPw && !isPwMatch ? "border-red-500" : "border-[#C7B5A1]"
              }`}
              placeholder="다시 입력"
            />

            {confirmPw && !isPwMatch && (
              <p className="text-xs text-red-500 mt-1">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          <button
            onClick={handlePasswordChange}
            disabled={!isChangeEnabled || submitLoading}
            className={`mt-auto w-full mt-8 py-3 rounded-3xl font-semibold text-white transition ${
              isChangeEnabled && !submitLoading
                ? "bg-primary-700"
                : "bg-[#C7B5A1] opacity-50"
            }`}
          >
            {submitLoading ? "변경 중..." : "비밀번호 변경"}
          </button>
          {errorMessage && (
            <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>
      )}
    </PageContainer>
  );
}
