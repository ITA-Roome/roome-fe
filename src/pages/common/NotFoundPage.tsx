import { Link } from "react-router-dom";
import LogoMain from "@/assets/RoomeLogo/Roome_main.svg?react";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-primary-700 px-6 py-16">
      <section
        role="alert"
        className="w-full max-w-md text-center text-primary-50"
      >
        <LogoMain
          aria-hidden="true"
          className="mx-auto mb-8 h-32 w-32 md:h-40 md:w-40"
        />

        <h1 className="font-heading1 text-2xl md:text-3xl">
          페이지를 찾을 수 없어요
        </h1>
        <p className="mt-3 text-primary-200 font-body2">
          주소가 변경되었거나 존재하지 않는 페이지입니다.
        </p>

        <div className="mt-10">
          <Link
            to="/feed"
            className="inline-block rounded-16 bg-primary-50 py-3 px-15 font-heading3 text-primary-700 transition-colors"
          >
            홈으로 가기
          </Link>
        </div>
      </section>
    </main>
  );
}
