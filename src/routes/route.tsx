import { PropsWithChildren, useEffect, useState } from "react";
import {
  createBrowserRouter,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import FindPw from "@/pages/auth/FindPw";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import SignupEmailPage from "@/pages/auth/SignupEmailPage";
import KakaoCallback from "@/pages/auth/KakaoCallback";
import GoogleCallback from "@/pages/auth/GoogleCallback";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";
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

/**
 * Guards routes by verifying authentication and onboarding status before rendering children.
 *
 * Checks for a stored auth token and uses the server's onboarding existence check to decide
 * whether to redirect the user to login, onboarding, or allow rendering of the protected children.
 *
 * @returns The `children` when access is permitted; otherwise `null` while checks are in progress or a `Navigate` element redirecting to the appropriate route (login or onboarding).
 */
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
    element: (
      <>
        <AuthLayout />
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
        path: "feed",
        element: <FeedPage />,
      },
      {
        path: "feed-detail/:productId-detail",
        element: <FeedDetailPage />,
      },
      {
        path: "chat",
        element: <ChatPage />,
      },
      {
        path: "board",
        element: <BoardPage />,
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
      {
        path: "shop",
        element: <ShopPage />,
      },
      {
        path: "shop-detail/:productId-detail",
        element: <ShopDetailPage />,
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