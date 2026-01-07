import { NavLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ReferenceApi } from "@/api/reference";
import { ProductApi } from "@/api/product";
import { productKeys } from "@/constants/queryKeys";
import type { ProductOrder } from "@/hooks/useInfiniteScroll";

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

  const queryClient = useQueryClient();

  const handlePrefetch = (path: string) => {
    if (path === "/feed") {
      queryClient.prefetchInfiniteQuery({
        queryKey: ["references", "list", ""],
        queryFn: ({ pageParam = 0 }) =>
          ReferenceApi.fetchReferences({
            keyWord: "",
            page: pageParam,
            size: 21,
          }),
        initialPageParam: 0,
        staleTime: 60 * 1000,
      });
    } else if (path === "/shop") {
      // Default params from ShopPage
      const order: ProductOrder = "POPULAR";
      const limit = 21;
      const keyWord = undefined;

      queryClient.prefetchInfiniteQuery({
        queryKey: productKeys.list({
          search: "",
          order,
          limit,
          mood: undefined,
          usage: undefined,
        }),
        queryFn: ({ pageParam = 0 }) =>
          ProductApi.fetchProducts({
            page: pageParam,
            size: limit,
            keyWord,
            mood: undefined,
            usage: undefined,
            sort: ["popularity,DESC", "id,DESC"],
          }),
        initialPageParam: 0,
        staleTime: 60_000,
      });
    }
  };

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 bg-white">
      <nav className="mx-auto max-w-md px-4">
        <ul className="flex justify-around py-4">
          {navItems.map(({ to, label, Icon }) => (
            <li key={to} className="flex flex-col items-center">
              <NavLink
                to={to}
                onMouseEnter={() => handlePrefetch(to)}
                onTouchStart={() => handlePrefetch(to)}
                className={({ isActive }) =>
                  `flex flex-col items-center ${
                    isActive ? "text-primary-700" : "text-primary-50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-6 h-6 ${
                        isActive ? "text-primary-700" : "text-primary-50"
                      }`}
                    />
                    <span
                      className={`font-caption ${
                        isActive ? "text-primary-700" : "text-primary-50"
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
