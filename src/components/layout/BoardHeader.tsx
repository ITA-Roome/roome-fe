import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react";
import HeaderLogo from "@/assets/RoomeLogo/logo-header.svg?react";
import SettingIcon from "@/assets/icons/settings.svg?react";
import { Link } from "react-router-dom";

type BoardHeaderProps = { title?: string };

export default function BoardHeader({ title }: BoardHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-6 h-16 bg-white relative">
      <button
        onClick={() => history.back()}
        className="absolute left-4 top-1/2 -translate-y-1/2"
      >
        <ArrowLeftIcon className="w-4 h-4" />
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
