import { Outlet, useLocation } from "react-router-dom";

import Footer from "../components/layout/Footer";
import BoardHeader from "../components/layout/BoardHeader";

import ScrollToTop from "../components/layout/ScrollToTop";

function BoardLayout() {
  const location = useLocation();

  const titleMap: Record<string, string> = {
    "/board/chat": "ROOME와의 상담",
    "/board/reference": "내가 공유한 레퍼런스",
  };

  const title =
    Object.entries(titleMap).find(([path]) =>
      location.pathname.startsWith(path),
    )?.[1] ?? undefined;

  return (
    <div className="h-dvh flex flex-col">
      <ScrollToTop />
      <BoardHeader title={title} />
      <main className="flex-1 min-h-0 overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default BoardLayout;
