import HeaderLogo from "@/assets/RoomeLogo/logo-header.svg?react";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react";
import { useNavigate } from "react-router-dom";

type SettingHeaderProps = { title?: string };

export default function SettingHeader({ title }: SettingHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 flex items-center justify-center px-6 h-16 bg-white border-b border-primary-50/10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-2 p-2"
        aria-label="뒤로 가기"
      >
        <ArrowLeftIcon className="w-4.5 h-4.5 text-primary-700" />
      </button>

      {title ? (
        <p className="text-primary-700 font-semibold">{title}</p>
      ) : (
        <HeaderLogo className="w-[95px] h-auto" />
      )}

      <div className="w-6" />
    </header>
  );
}
