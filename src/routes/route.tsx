import { PropsWithChildren } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// 각 페이지 import
import Layout from "@/layout/Layout";
import FindPw from "@/pages/auth/FindPw";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import NotFoundPage from "@/pages/common/NotFoundPage";
import HomePage from "@/pages/home/HomePage";

function ProtectedRoute({ children }: PropsWithChildren) {
  //추후 실제 로그인 여부로 대체 필요
  const isLoggedIn = true;

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
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
        path: "home",
        element: <HomePage />,
      },
      // 페이지 만들 시 추가
    ],
  },
]);

export default router;
