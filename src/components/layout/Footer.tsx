import { NavLink } from "react-router-dom";
import SearchIcon from "@/assets/icons/search.svg?react";
import HomeIcon from "@/assets/icons/home.svg?react";
import PersonIcon from "@/assets/icons/person.svg?react";
import FavoriteIcon from "@/assets/icons/favorite.svg?react";

export default function Footer() {
  const navItems = [
    { to: "/feed", label: "feed", Icon: SearchIcon },
    { to: "/shop", label: "shop", Icon: HomeIcon },
    { to: "/chat", label: "chat bot", Icon: PersonIcon },
    { to: "/board", label: "board", Icon: FavoriteIcon },
  ];

  return (
    <footer className="fixed bottom-3 left-0 right-0 z-50">
      <nav className="max-w-md mx-auto">
        <ul className="flex justify-around py-3">
          {navItems.map(({ to, label, Icon }) => (
            <li key={to} className="flex flex-col items-center">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center ${
                    isActive ? "text-primary-700" : "text-primary-disabled"
                  }`
                }
              >
                <Icon
                  className="w-[24px] h-[24px]"
                  style={{ fill: "currentColor" }}
                />
                <span className="font-caption">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
