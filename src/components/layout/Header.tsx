import HeaderLogo from "@/assets/RoomeLogo/logo-header.svg?react";
import SettingIcon from "@/assets/icons/settings.svg?react";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg?react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isDetailPage =
    (pathname.startsWith("/feed/") && pathname !== "/feed") ||
    (pathname.startsWith("/shop/") && pathname !== "/shop");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-6 h-16 bg-white">
      {isDetailPage && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-2 p-2"
          aria-label="뒤로 가기"
        >
          <ArrowLeftIcon className="w-4.5 h-4.5 text-primary-700" />
        </button>
      )}

      <Link to="/feed">
        <HeaderLogo className="w-[95px] h-auto" />
      </Link>

      {!isDetailPage && (
        <Link to="/setting" className="absolute right-4">
          <SettingIcon className="w-5 h-5" />
        </Link>
      )}
    </header>
  );
}
