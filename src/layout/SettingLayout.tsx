import { Outlet } from "react-router-dom";

import Footer from "../components/layout/Footer";
import SettingHeader from "../components/layout/SettingHeader";

function SettingLayout() {
  return (
    <div className="min-h-screen">
      <SettingHeader />
      <main className="px-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default SettingLayout;
