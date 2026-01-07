import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserApi } from "@/api/user";
import { AuthApi } from "@/api/auth";

import ProfileChangeIcon from "@/assets/icons/imgChange.svg?react";
import RoomeDefault from "@/assets/RoomeLogo/comment_icon.svg";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [originalNickname, setOriginalNickname] = useState("");
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const [nickname, setNickname] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [nicknameLoading, setNicknameLoading] = useState(false);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await UserApi.fetchUserProfile();

        if (!res.isSuccess) {
          console.error("프로필 조회 실패: ", res.message);
          return;
        }

        if (!res.data) return;

        const profile = res.data;

        setOriginalNickname(profile.nickname);
        setOriginalImage(profile.profileImage);

        setNickname(profile.nickname);
        setPreviewImage(profile.profileImage);
      } catch (error) {
        console.error("프로필 로드 중 오류:", error);
      }
    }
    fetchData();
  }, []);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setNicknameChecked(value === originalNickname); // 기존 닉네임이면 자동확인
    setNicknameMessage("");
  };

  const handleCheckNickname = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) return;

    if (trimmed === originalNickname) return;

    setNicknameLoading(true);
    setNicknameChecked(false);

    try {
      const { data } = await AuthApi.checkNickname(trimmed);

      if (!data.data?.isExist) {
        setNicknameMessage("사용 가능한 닉네임입니다.");
        setNicknameChecked(true);
      } else {
        setNicknameMessage("이미 사용 중인 닉네임입니다.");
      }
    } catch (err) {
      console.error(err);
      setNicknameMessage("닉네임 확인 실패");
    } finally {
      setNicknameLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewImage && previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 변경 여부
  const nicknameChanged = nickname !== originalNickname;
  const imageChanged = profileImage !== null && previewImage !== originalImage;

  // 저장 버튼 활성화 로직
  let isSaveEnabled = false;

  if (imageChanged && !nicknameChanged) {
    // 이미지 변경만 → 바로 OK
    isSaveEnabled = true;
  } else if (nicknameChanged) {
    // 닉네임 변경 → 중복확인 필요
    isSaveEnabled = nicknameChecked;
  }

  // 저장 요청
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("nickname", nickname);

      if (imageChanged && profileImage instanceof File) {
        formData.append("profileImage", profileImage);
      }

      const res = await UserApi.updateUserProfile(formData);

      if (!res.isSuccess) {
        alert(res.message);
        return;
      }

      setOriginalNickname(nickname);
      setOriginalImage(previewImage);
      setProfileImage(null);

      alert("프로필이 저장되었습니다!");
      navigate("/setting");
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      alert("프로필 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="pt-24 max-w-md mx-auto px-5 pb-40">
        {/* 이미지 */}
        <section className="flex flex-col items-center mt-6">
          <div
            onClick={handleImageClick}
            className="relative w-[180px] h-[180px] rounded-full overflow-hidden bg-[#D7C7B5] cursor-pointer"
          >
            <img
              src={previewImage ?? RoomeDefault}
              alt="프로필 이미지 미리보기"
              className="w-full h-full object-cover"
            />

            <button
              type="button"
              className="absolute bottom-4 right-6 w-10 h-10 rounded-xl bg-primary-400 border flex items-center justify-center shadow-sm pointer-events-none"
            >
              <ProfileChangeIcon className="w-6 h-6" />
            </button>
          </div>

          <input
            id="profileImageInput"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </section>

        {/* 닉네임 */}
        <div className="mt-10">
          <label className="block text-[#5D3C28] text-sm mb-1">닉네임</label>
          <div className="relative">
            <input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              className="w-full h-12 border rounded-3xl pl-3 pr-24"
            />

            <button
              onClick={handleCheckNickname}
              disabled={
                nickname.trim() === "" ||
                nickname === originalNickname ||
                nicknameLoading
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#8D7569] text-white px-3 py-1 rounded-3xl disabled:opacity-40"
            >
              {nicknameLoading ? "확인 중..." : "중복 확인"}
            </button>
          </div>
          {nicknameMessage && (
            <p
              className={`text-xs mt-1 ${nicknameChecked ? "text-green-600" : "text-red-500"}`}
            >
              {nicknameMessage}
            </p>
          )}
        </div>

        {/* 저장 버튼 */}
        <div className="mt-12">
          <button
            onClick={handleSave}
            disabled={!isSaveEnabled}
            className={`w-full h-12 rounded-3xl font-semibold ${
              isSaveEnabled
                ? "bg-primary-700 text-[#FFFDF4]"
                : "bg-[#C4B3A2] opacity-40 text-white cursor-not-allowed"
            }`}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
