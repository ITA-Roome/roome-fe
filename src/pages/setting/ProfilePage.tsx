import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserApi } from "@/api/user";
import { AuthApi } from "@/api/auth";
import { isAxiosError } from "axios";

import ProfileChangeIcon from "@/assets/icons/imgChange.svg";
import RoomeDefault from "@/assets/RoomeLogo/comment_icon.svg";
import PageContainer from "@/components/layout/PageContainer";

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
  const [saveError, setSaveError] = useState<string | null>(null);

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
    setSaveError(null);

    try {
      const formData = new FormData();
      formData.append("nickname", nickname);

      if (imageChanged && profileImage instanceof File) {
        formData.append("profileImage", profileImage);
      }

      const res = await UserApi.updateUserProfile(formData);

      if (!res.isSuccess) {
        setSaveError(res.message || "프로필 저장에 실패했습니다.");
        return;
      }

      setOriginalNickname(nickname);
      setOriginalImage(previewImage);
      setProfileImage(null);

      alert("프로필이 저장되었습니다!");
      navigate("/setting");
    } catch (err: unknown) {
      let message = "프로필 저장 중 오류가 발생했습니다.";

      if (err instanceof Error) {
        message = err.message;
      }

      if (isAxiosError(err)) {
        message = err.response?.data?.message ?? message;
      }

      setSaveError(message);
    }
  };

  return (
    <PageContainer className="h-dvh">
      <div className="flex h-full flex-col">
        <div>
          {/* 이미지 */}
          <section className="w-full flex justify-center mt-6">
            {/* 바깥 래퍼: 버튼이 안 잘리게 */}
            <div className="relative w-[180px] h-[180px] mx-auto overflow-visible">
              {/* 원형 클리핑은 여기서만 */}
              <div className="w-full h-full rounded-full overflow-hidden bg-[#D7C7B5]">
                <img
                  src={previewImage ?? RoomeDefault}
                  alt="프로필 이미지 미리보기"
                  className="w-full h-full object-contain" // 원본 안 잘리게면 contain
                  // 꽉 채우고 싶으면 object-cover
                />
              </div>

              {/* 버튼은 바깥 래퍼에 올려서 안 잘림 */}
              <button
                type="button"
                onClick={handleImageClick}
                className="absolute -bottom-2 right-1 w-10 h-10 rounded-xl bg-white z-30"
              >
                <img
                  src={ProfileChangeIcon}
                  alt="프로필 이미지 변경"
                  className="w-full h-full object-contain"
                />
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </section>

          {/* 닉네임 */}
          <div className="mt-10">
            <label className="block text-primary-200 text-sm mb-1">
              닉네임 변경하기
            </label>
            <div className="relative">
              <input
                type="text"
                value={nickname}
                onChange={handleNicknameChange}
                className="w-full h-12 border text-primary-200 rounded-3xl pl-3 pr-24"
              />

              <button
                onClick={handleCheckNickname}
                disabled={
                  nickname.trim() === "" ||
                  nickname === originalNickname ||
                  nicknameLoading
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-200 text-white px-3 py-1 rounded-3xl disabled:opacity-40"
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
        </div>

        {/* 저장 버튼 */}
        <div className="mt-auto">
          {saveError && (
            <p className="mb-2 text-sm text-red-500">{saveError}</p>
          )}
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
    </PageContainer>
  );
}
