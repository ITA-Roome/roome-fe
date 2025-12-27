import HeaderLogo from "@/assets/RoomeLogo/logo-header.svg?react";
import SettingIcon from "@/assets/icons/settings.svg?react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-6 h-16 bg-white">
      <HeaderLogo className="w-[100px] h-auto" />

      <Link to="/setting" className="absolute right-4">
        <SettingIcon className="w-5 h-5" />
      </Link>
    </header>
  );
}
