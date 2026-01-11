import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserApi } from "@/api/user";
import { AuthApi } from "@/api/auth";
import RoomeDefault from "@/assets/RoomeLogo/comment_icon.svg";
import ConfirmModal from "@/components/setting/ConfirmModal";

export default function SettingPage() {
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("");

  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await UserApi.fetchUserProfile();
        if (!res.isSuccess || !res.data) return;

        setProfileImage(res.data.profileImage);
        setNickname(res.data.nickname);
      } catch (error) {
        console.error("프로필 로드 실패:", error);
      }
    }
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    if (logoutLoading) return;
    try {
      setLogoutLoading(true);
      const res = await AuthApi.logout();

      if (!res.isSuccess) {
        alert(res.message || "로그아웃에 실패했습니다.");
        return;
      }

      // 스토리지 전체 정리
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      sessionStorage.clear();

      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      alert("로그아웃 중 오류가 발생했습니다.");
    } finally {
      setLogoutLoading(false);
      setLogoutConfirmOpen(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5">
      {/* 프로필 영역 */}
      <div className="flex flex-col items-center mt-20">
        <div className="w-40 h-40 bg-[#D4CFC8] rounded-full overflow-hidden">
          {profileImage ? (
            <img
              src={profileImage}
              alt={`${nickname}의 프로필 이미지`}
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
        <p className="mt-4 text-[16px] text-[#5D3C28]">{nickname}</p>
      </div>

      {/* 메뉴 리스트 (닉네임과 로그아웃 사이 가운데 배치) */}
      <div className="mt-12 flex flex-col gap-4">
        <button
          className="w-full h-12 rounded-3xl bg-primary-700 text-white text-[15px]"
          onClick={() => navigate("/setting/profile")}
        >
          프로필 관리
        </button>

        <button
          className="w-full h-12 rounded-3xl bg-primary-700 text-white text-[15px]"
          onClick={() => navigate("/setting/account")}
        >
          계정 정보
        </button>

        <button
          className="w-full h-12 rounded-3xl bg-primary-700 text-white text-[15px]"
          onClick={() => navigate("/setting/inquiry")}
        >
          문의하기
        </button>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="mt-12 mb-6">
        <button
          className="w-full h-12 rounded-3xl bg-point text-primary-700 text-[15px]"
          onClick={() => setLogoutConfirmOpen(true)}
        >
          로그아웃
        </button>
      </div>

      <ConfirmModal
        open={logoutConfirmOpen}
        title="로그아웃"
        description="정말 로그아웃하시겠습니까?"
        confirmText={logoutLoading ? "처리 중..." : "확인"}
        cancelText="취소"
        onConfirm={() => handleLogout()}
        onCancel={() => {
          if (logoutLoading) return;
          setLogoutConfirmOpen(false);
        }}
        closeOnBackdrop={!logoutLoading}
      />
    </div>
  );
}
