import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RoomeMainLogo from "@/assets/RoomeLogo/Roome_main.svg?react";
import { UserApi } from "@/api/user";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashPage() {
  const [step, setStep] = useState<"SPLASH" | "LANDING">("SPLASH");
  const navigate = useNavigate();

  useEffect(() => {
    const initSplash = async () => {
      const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));
      const token = localStorage.getItem("token");
      let authResult = null;

      if (token) {
        try {
          authResult = await UserApi.checkOnboardingExistence().catch(
            () => null,
          );
        } catch (e) {
          console.error("Auth check internal error", e);
        }
      }
      await minDelay;

      if (token && authResult?.data) {
        const alreadyOnboarded =
          authResult.data.data?.isExist ??
          authResult.data.data?.exists ??
          authResult.data.data?.hasOnboardingInformation ??
          false;

        navigate(alreadyOnboarded ? "/feed" : "/onboarding", {
          replace: true,
        });
      } else {
        setStep("LANDING");
      }
    };

    initSplash();
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#5D3C28] px-6 overflow-hidden">
      <div className="flex flex-col items-center mb-10 w-full relative z-10">
        <motion.div
          layout
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <RoomeMainLogo className="w-40 h-auto" />
        </motion.div>

        <AnimatePresence>
          {step === "LANDING" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white font-body3 text-center"
            >
              친근하고 현실적인
              <br />
              인테리어 도우미
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {step === "LANDING" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-xs flex flex-col gap-4"
          >
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-white text-primary-700 py-3 rounded-full font-heading3 font-bold hover:bg-white/90 transition shadow-lg"
            >
              로그인
            </button>
            <p className="text-center text-white/60 text-sm">
              아직 계정이 없다면?{" "}
              <Link to="/signup" className="text-white underline font-semibold">
                회원가입
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
