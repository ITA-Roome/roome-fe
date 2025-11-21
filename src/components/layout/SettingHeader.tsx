import HeaderLogo from "@/assets/RoomeLogo/logo-header.svg?react";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react";

export default function SettingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 bg-primary-50">
      {/* 왼쪽 뒤로가기 버튼 */}
      <button onClick={() => history.back()}>
        <ArrowLeftIcon className="w-4 h-4" />
      </button>

      {/* 중앙 로고 */}
      <HeaderLogo className="w-[100px] h-auto" />

      {/* 오른쪽 자리 맞추기용 빈 박스 */}
      <div className="w-6" />
    </header>
  );
}
