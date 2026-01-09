import { Outlet, useLocation } from "react-router-dom";

import Footer from "../components/layout/Footer";
import SettingHeader from "../components/layout/SettingHeader";

import ScrollToTop from "../components/layout/ScrollToTop";

function SettingLayout() {
  const location = useLocation();

  const titleMap: Array<[string, string]> = [
    ["/setting/profile", "개인보드"],
    ["/setting/account/password", "비밀번호 변경"],
    ["/setting/account", "계정 정보"],
    ["/setting/contact", "문의하기"],
    ["/setting", "개인 페이지"],
  ];

  const title = titleMap.find(([path]) =>
    location.pathname.startsWith(path),
  )?.[1];

  return (
    <div className="h-dvh flex flex-col">
      <ScrollToTop />
      <SettingHeader title={title} />
      <main className="flex-1 overflow-y-auto px-4 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default SettingLayout;
