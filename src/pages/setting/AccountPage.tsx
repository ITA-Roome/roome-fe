import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { UserApi } from "@/api/user";
import { AuthApi } from "@/api/auth";
import type { UserProfile } from "@/types/user";

import RoomeDefault from "@/assets/RoomeLogo/comment_icon.svg";
import ConfirmModal from "@/components/setting/ConfirmModal";
import PageContainer from "@/components/layout/PageContainer";

export default function AccountPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // state 추가
  const [showConfirmStep1, setShowConfirmStep1] = useState(false);
  const [showConfirmStep2, setShowConfirmStep2] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async () => {
      try {
        const response = await UserApi.fetchUserProfile();

        if (!response.isSuccess || !response.data) {
          throw new Error(
            response.message || "회원정보를 불러오는 데 실패했어요.",
          );
        }

        if (isMounted) {
          setUserInfo(response.data);
          setErrorMessage(null);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setErrorMessage("회원 정보를 불러오는 중 문제가 발생했어요.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const formattedJoinDate = useMemo(() => {
    if (!userInfo?.signUpDate) return "-";

    return userInfo.signUpDate.replaceAll("-", ".");
  }, [userInfo?.signUpDate]);

  const detailItems = useMemo(
    () => [
      { label: "가입일", value: formattedJoinDate },
      { label: "이메일", value: userInfo?.email ?? "-" },
      { label: "전화번호", value: userInfo?.phoneNumber ?? "-" },
    ],
    [formattedJoinDate, userInfo?.email, userInfo?.phoneNumber],
  );

  const handleDeleteAccount = async (password: string) => {
    if (withdrawLoading) return;

    const pwd = password.trim();
    if (!pwd) {
      setPwdError("비밀번호를 입력해주세요.");
      return;
    }

    try {
      setWithdrawLoading(true);
      setPwdError(null);

      // 1) 비밀번호 검증 (예: 비밀번호 확인 API 사용)
      const confirmRes = await AuthApi.passwordConfirm(pwd);
      if (!confirmRes.isSuccess) {
        setPwdError(confirmRes.message || "비밀번호가 올바르지 않습니다.");
        return;
      }

      // 2) 탈퇴 진행
      const withdrawRes = await AuthApi.withdraw();
      if (withdrawRes.isSuccess) {
        localStorage.clear();
        sessionStorage.clear();
        alert("회원 탈퇴가 완료되었습니다.");
        navigate("/");
      } else {
        setPwdError(withdrawRes.message || "회원 탈퇴 실패");
      }

      setShowConfirmStep2(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const serverMsg = (error.response?.data as { message?: string })
          ?.message;

        if (status === 401) {
          setPwdError(serverMsg ?? "비밀번호가 올바르지 않습니다.");
          return;
        }

        setPwdError(serverMsg ?? "요청 처리 중 오류가 발생했습니다.");
        return;
      }

      if (error instanceof Error) {
        setPwdError(error.message || "요청 처리 중 오류가 발생했습니다.");
        return;
      }

      setPwdError("네트워크 오류가 발생했습니다.");
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleChangePassword = () => {
    navigate("/setting/account/password");
  };

  return (
    <PageContainer className="h-dvh font-semibold">
      <div className="flex h-full flex-col">
        <main className="flex flex-col items-center">
          {/* 여기만 폭 제한 */}
          <div className="w-full max-w-sm px-8">
            <div className="flex flex-col items-center">
              <div className="w-[180px] h-[180px] rounded-full bg-[#D7C7B5] overflow-hidden flex items-center justify-center">
                {userInfo?.profileImage ? (
                  <img
                    src={userInfo.profileImage}
                    alt="프로필 이미지"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={RoomeDefault}
                    alt="기본 프로필 이미지"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <p className="mt-4 text-sm text-primary-700">
                {isLoading
                  ? "불러오는 중 ..."
                  : (userInfo?.nickname ?? "닉네임을 불러오지 못했어요.")}
              </p>
              {errorMessage ? (
                <span className="mt-1 text-xs text-red-500">
                  {errorMessage}
                </span>
              ) : null}
            </div>

            <section className="w-full max-w-sm mt-10 space-y-4 text-[14px] text-[#5D3C28]">
              {detailItems.map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center pb-3 border-b border-primary-200"
                >
                  <span className="text-primary-700">{item.label}</span>
                  <span className="text-primary-200">{item.value}</span>
                </div>
              ))}
            </section>
          </div>
        </main>

        <section className="mt-auto w-full space-y-3">
          <button
            type="button"
            onClick={() => setShowConfirmStep1(true)}
            className="w-full h-12 rounded-full bg-primary-700 text-[#FFFDF4] text-[14px]"
          >
            회원 탈퇴
          </button>
          <button
            type="button"
            onClick={handleChangePassword}
            className="w-full h-12 rounded-full bg-primary-700 text-[#FFFDF4] text-[14px]"
          >
            비밀번호 변경
          </button>
        </section>
      </div>

      <ConfirmModal
        open={showConfirmStep1}
        title="회원 탈퇴"
        description="정말 탈퇴하시겠습니까?"
        confirmText={"탈퇴"}
        cancelText="취소"
        onConfirm={() => {
          setShowConfirmStep1(false);
          setPwdError(null);
          setShowConfirmStep2(true);
        }}
        onCancel={() => setShowConfirmStep1(false)}
        closeOnBackdrop
      />

      <ConfirmModal
        open={showConfirmStep2}
        title="회원 탈퇴"
        description="비밀번호를 입력해주세요."
        confirmText={withdrawLoading ? "처리 중..." : "확인"}
        cancelText="취소"
        onConfirm={(pwd) => {
          if (!pwd) return;
          handleDeleteAccount(pwd);
        }}
        onCancel={() => {
          if (withdrawLoading) return;
          setShowConfirmStep2(false);
          setPwdError(null);
        }}
        closeOnBackdrop={!withdrawLoading}
        input={{
          label: pwdError || undefined,
          type: "password",
          placeholder: "비밀번호",
          required: true,
          autoFocus: true,
        }}
      />
    </PageContainer>
  );
}
