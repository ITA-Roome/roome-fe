import HeaderLogo from "@/assets/RoomeLogo/logo-header.svg?react";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react";

export default function SettingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16">
      <button onClick={() => history.back()}>
        <ArrowLeftIcon className="w-4 h-4" />
      </button>

      <HeaderLogo className="w-[95px] h-auto" />

      <div className="w-6" />
    </header>
  );
}
