import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserApi } from "@/api/user";
import { AuthApi } from "@/api/auth";
import RoomeDefault from "@/assets/RoomeLogo/comment_icon.svg";

export default function SettingPage() {
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("");

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
    try {
      const res = await AuthApi.logout();

      if (!res.isSuccess) {
        alert(res.message || "로그아웃에 실패했습니다.");
        return;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      // 세션스토리지 전체 정리
      sessionStorage.clear();

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="pt-24 max-w-md mx-auto px-5 pb-40">
        {/* 프로필 영역 */}
        <div className="flex flex-col items-center mt-6">
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
        <div className="mt-16 flex flex-col gap-6">
          <button
            className="w-full py-3 rounded-3xl bg-primary-700 text-white text-[15px]"
            onClick={() => navigate("/setting/profile")}
          >
            프로필 관리
          </button>

          <button
            className="w-full py-3 rounded-3xl bg-primary-700 text-white text-[15px]"
            onClick={() => navigate("/setting/account")}
          >
            계정 정보
          </button>

          <button
            className="w-full py-3 rounded-3xl bg-primary-700 text-white text-[15px]"
            onClick={() => navigate("/setting/contact")}
          >
            문의하기
          </button>
        </div>
      </div>

      {/* 로그아웃 버튼: 페이지 하단 고정 */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-md px-5">
        <button
          className="w-full py-3 rounded-3xl bg-primary-700 text-white text-[15px]"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
