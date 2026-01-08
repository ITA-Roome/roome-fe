import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

import { UserApi } from "@/api/user";
import { AuthApi } from "@/api/auth";
import type { UserProfile } from "@/types/user";

import RoomeDefault from "@/assets/RoomeLogo/comment_icon.svg";

export default function AccountPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleDeleteAccount = async () => {
    try {
      const res = await AuthApi.withdraw();

      if (res.isSuccess) {
        localStorage.clear();
        sessionStorage.clear();
        alert("회원 탈퇴가 완료되었습니다.");
        navigate("/");
      } else {
        alert(res.message || "회원 탈퇴 실패");
      }
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ code?: string }>;

      if (axiosErr.response?.data?.code === "JWT_401") {
        alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        alert("오류가 발생했습니다.");
      }
    }
  };

  const handleChangePassword = () => {
    navigate("/setting/account/password");
  };

  return (
    <div className="relative">
      <div className="pt-18 max-w-md mx-auto px-3 pb-6">
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
              <p className="mt-4 text-sm text-[#5D3C28]">
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
                  className="flex justify-between items-center pb-3 border-b border-[#C7B5A1]"
                >
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </section>
          </div>

          <section className="w-full mt-10 space-y-3">
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="w-full h-12 rounded-3xl bg-primary-700 text-[#FFFDF4] text-[14px]"
            >
              회원 탈퇴
            </button>
            <button
              type="button"
              onClick={handleChangePassword}
              className="w-full h-12 rounded-3xl bg-primary-700 text-[#FFFDF4] text-[14px]"
            >
              비밀번호 변경
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
