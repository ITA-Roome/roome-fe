import { Link } from "react-router-dom";
import LogoMain from "@/assets/RoomeLogo/Roome_main.svg?react";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-primary-700 px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary-600/30 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary-800/40 blur-[100px]" />
      </div>

      <section className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <div className="animate-bounce-custom mb-6 drop-shadow-2xl">
          <LogoMain aria-hidden="true" className="h-32 w-32 md:h-40 md:w-40" />
        </div>

        <div className="animate-fade-in space-y-2">
          <span className="font-heading1 tracking-[0.2em] text-primary-200/60">
            404 ERROR
          </span>
          <h1 className="font-heading1 mt-2 text-primary-50">
            페이지를 찾을 수 없어요
          </h1>
          <p className="font-body3 mt-4 text-primary-200">
            주소가 변경되었거나 존재하지 않는 페이지입니다.
          </p>
        </div>

        <div className="animate-fade-in mt-10 delay-100">
          <Link
            to="/feed"
            className="group flex items-center gap-2 rounded-full bg-primary-50 px-8 py-3.5 font-body2 text-primary-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-xl active:scale-95"
          >
            <Home className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:rotate-[-10deg]" />
            <span>홈으로 돌아가기</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
