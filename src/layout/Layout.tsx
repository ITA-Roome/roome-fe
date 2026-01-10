import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import ScrollToTop from "../components/layout/ScrollToTop";
import PageTransition from "@/components/common/PageTransition";

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="px-4 relative">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
