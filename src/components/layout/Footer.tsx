import { NavLink } from "react-router-dom";
import SearchIcon from "@/assets/icons/navBar/search.svg?react";
import HomeIcon from "@/assets/icons/navBar/home.svg?react";
import PersonIcon from "@/assets/icons/navBar/person.svg?react";
import FavoriteIcon from "@/assets/icons/navBar/favorite.svg?react";

export default function Footer() {
  const navItems = [
    { to: "/feed", label: "feed", Icon: SearchIcon },
    { to: "/shop", label: "shop", Icon: HomeIcon },
    { to: "/chat", label: "chat bot", Icon: PersonIcon },
    { to: "/board", label: "board", Icon: FavoriteIcon },
  ];

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 bg-primary-50">
      <nav className="mx-auto max-w-md px-4">
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
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-6 h-6 ${
                        isActive ? "text-primary-700" : "text-primary-disabled"
                      }`}
                    />
                    <span
                      className={`font-caption ${
                        isActive ? "text-primary-700" : "text-primary-disabled"
                      }`}
                    >
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
