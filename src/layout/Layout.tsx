import { Outlet } from "react-router-dom";

import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

function Layout() {
  return (
    <div className="min-h-screen bg-primary-50 pt-[100px] pb-[96px]">
      <Header />
      <main className="px-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
