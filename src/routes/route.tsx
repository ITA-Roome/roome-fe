import { PropsWithChildren, useEffect, useState } from "react";
import {
  createBrowserRouter,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

// 각 페이지 import
import Layout from "@/layout/Layout";
import FindPw from "@/pages/auth/FindPw";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import SignupEmailPage from "@/pages/auth/SignupEmailPage";
import KakaoCallback from "@/pages/auth/KakaoCallback";
import GoogleCallback from "@/pages/auth/GoogleCallback";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";
import NotFoundPage from "@/pages/common/NotFoundPage";
import HomePage from "@/pages/home/HomePage";
import { OnboardingApi } from "@/api/user";

function ProtectedRoute({ children }: PropsWithChildren) {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [allowRender, setAllowRender] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    async function checkOnboarding() {
      try {
        const { data } = await OnboardingApi.checkOnboardingExistence();
        const alreadyOnboarded =
          data.data?.isExist ??
          data.data?.exists ??
          data.data?.hasOnboardingInformation ??
          false;

        if (alreadyOnboarded && location.pathname === "/onboarding") {
          navigate("/home", { replace: true });
          return;
        }

        if (!alreadyOnboarded && location.pathname !== "/onboarding") {
          navigate("/onboarding", { replace: true });
          return;
        }

        setAllowRender(true);
      } catch (error) {
        console.error("온보딩 여부 확인 실패", error);
        navigate("/onboarding", { replace: true });
      } finally {
        setReady(true);
      }
    }

    checkOnboarding();
  }, [token, navigate, location.pathname]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!ready || !allowRender) {
    return null;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Layout />
      </>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "find-pw",
        element: <FindPw />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "signup/email",
        element: <SignupEmailPage />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "onboarding",
        element: <OnboardingPage />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      // 페이지 만들 시 추가
    ],
  },
  {
    path: "/auth/kakao/callback",
    element: <KakaoCallback />,
  },
  {
    path: "/auth/google/callback",
    element: <GoogleCallback />,
  },
]);

export default router;
