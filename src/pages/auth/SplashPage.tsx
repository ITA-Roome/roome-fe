import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RoomeMainLogo from "@/assets/RoomeLogo/Roome_main.svg?react";
import { UserApi } from "@/api/user";

export default function SplashPage() {
  const [step, setStep] = useState<"SPLASH" | "LANDING">("SPLASH");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep("LANDING");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await UserApi.checkOnboardingExistence();
          const alreadyOnboarded =
            data.data?.isExist ??
            data.data?.exists ??
            data.data?.hasOnboardingInformation ??
            false;

          navigate(alreadyOnboarded ? "/feed" : "/onboarding", {
            replace: true,
          });
        } catch (error) {
          console.error("Auth check failed", error);
        }
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#5D3C28] px-6 animate-fade-in transition-all duration-1000">
      <div className="flex flex-col items-center mb-10 transition-all duration-1000">
        <RoomeMainLogo className="w-40 h-auto mb-6 transition-all duration-1000" />

        <p
          className={`text-white font-body3 text-center transition-opacity duration-1000 ${
            step === "LANDING" ? "opacity-100" : "opacity-0"
          }`}
        >
          친근하고 현실적인
          <br />
          인테리어 도우미
        </p>
      </div>

      <div
        className={`w-full max-w-xs flex flex-col gap-4 transition-opacity duration-1000 ${
          step === "LANDING" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-white text-primary-700 py-3 rounded-full font-heading3 font-bold hover:bg-white/90 transition"
        >
          로그인
        </button>
        <p className="text-center text-white/60 text-sm">
          아직 계정이 없다면?{" "}
          <Link to="/signup" className="text-white  underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
