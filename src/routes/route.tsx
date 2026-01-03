import { PropsWithChildren, useEffect, useState } from "react";
import {
  createBrowserRouter,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import FindPw from "@/pages/auth/FindPw";
import LoginPage from "@/pages/auth/LoginPage";
import SignupEmailPage from "@/pages/auth/SignupEmailPage";
import KakaoCallback from "@/pages/auth/KakaoCallback";
import GoogleCallback from "@/pages/auth/GoogleCallback";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";
import SplashPage from "@/pages/auth/SplashPage";
import NotFoundPage from "@/pages/common/NotFoundPage";
import { UserApi } from "@/api/user";
import ChatPage from "@/pages/chat/ChatPage";
import BoardPage from "@/pages/board/BoardPage";
import FeedPage from "@/pages/feed/FeedPage";
import Layout from "@/layout/Layout";
import ShopPage from "@/pages/shop/ShopPage";
import AuthLayout from "@/layout/AuthLayout";
import FeedDetailPage from "@/pages/feed/FeedDetailPage";
import ShopDetailPage from "@/pages/shop/ShopDetailPage";
import ChatBoardPage from "@/pages/board/ChatBoardPage";
import LikeBoardPage from "@/pages/board/LikeBoardPage";
import ReferenceBoardPage from "@/pages/board/ReferenceBoardPage";
import SettingLayout from "@/layout/SettingLayout";
import BoardLayout from "@/layout/BoardLayout";
import SettingPage from "@/pages/setting/SettingPage";
import ProfilePage from "@/pages/setting/ProfilePage";
import AccountPage from "@/pages/setting/AccountPage";
import ChangePasswordPage from "@/pages/setting/ChangePasswordPage";
import ContactPage from "@/pages/setting/ContactPage";

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
        const { data } = await UserApi.checkOnboardingExistence();
        const alreadyOnboarded =
          data.data?.isExist ??
          data.data?.exists ??
          data.data?.hasOnboardingInformation ??
          false;

        if (alreadyOnboarded && location.pathname === "/onboarding") {
          navigate("/feed", { replace: true });
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
    element: <SplashPage />,
    errorElement: <NotFoundPage />,
  },
  {
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/find-pw",
        element: <FindPw />,
      },
      {
        path: "/signup",
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
        path: "feed",
        element: <FeedPage />,
      },
      {
        path: "feed/:productId",
        element: <FeedDetailPage />,
      },
      {
        path: "board",
        element: <BoardPage />,
      },
      {
        path: "shop",
        element: <ShopPage />,
      },
      {
        path: "shop/:productId",
        element: <ShopDetailPage />,
      },
    ],
  },
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <OnboardingPage />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <BoardLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "chat",
        element: <ChatPage />,
      },
      {
        path: "board/like",
        element: <LikeBoardPage />,
      },
      {
        path: "board/chat",
        element: <ChatBoardPage />,
      },
      {
        path: "board/reference",
        element: <ReferenceBoardPage />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <SettingLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "setting",
        element: <SettingPage />,
      },
      {
        path: "setting/profile",
        element: <ProfilePage />,
      },
      {
        path: "setting/account",
        element: <AccountPage />,
      },
      {
        path: "setting/account/password",
        element: <ChangePasswordPage />,
      },
      {
        path: "setting/contact",
        element: <ContactPage />,
      },
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
