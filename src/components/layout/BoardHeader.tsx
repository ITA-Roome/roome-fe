import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react";
import HeaderLogo from "@/assets/RoomeLogo/logo-header.svg?react";
import SettingIcon from "@/assets/icons/settings.svg?react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

type BoardHeaderProps = { title?: string };

export default function BoardHeader({ title }: BoardHeaderProps) {
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

      <Link to="/setting" className="absolute right-4">
        <SettingIcon className="w-5 h-5" />
      </Link>
    </header>
  );
}
