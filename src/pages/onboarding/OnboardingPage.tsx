import { useState } from "react";
import { UserApi } from "@/api/user";
import type { OnboardingPayload } from "@/types/user";
import { useNavigate } from "react-router-dom";
import Step1Space from "@/components/steps/Step1Space";
import Step2Mood from "@/components/steps/Step2Mood";
import Step3Age from "@/components/steps/Step3Age";
import Step4Gender from "@/components/steps/Step4Gender";
import Step5Result from "@/components/steps/Step5Result";
import Step6Explanation from "@/components/steps/Step6Explanation";
import { AGE_MAP, GENDER_MAP, SPACE_MAP, MOOD_MAP } from "@/constants/common";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);

  const [form, setForm] = useState<OnboardingPayload>({
    ageGroup: "",
    gender: "",
    spaceType: "",
    moodType: "",
  });

  const updateField = (key: keyof OnboardingPayload) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      const payload: OnboardingPayload = {
        ageGroup: AGE_MAP[form.ageGroup as keyof typeof AGE_MAP],
        gender: GENDER_MAP[form.gender as keyof typeof GENDER_MAP],
        spaceType: SPACE_MAP[form.spaceType as keyof typeof SPACE_MAP],
        moodType: MOOD_MAP[form.moodType as keyof typeof MOOD_MAP],
      };

      console.log("Onboarding Payload:", payload);
      const token = localStorage.getItem("token");
      console.log("Auth Token exists:", !!token);

      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      await UserApi.onboardingSubmit(payload);
      navigate("/feed", { replace: true });
    } catch (error) {
      console.error("온보딩 저장 실패:", error);
      alert("온보딩 정보 저장에 실패했습니다. (서버 오류)");
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Space
            value={form.spaceType}
            onSelect={updateField("spaceType")}
            onNext={nextStep}
            onPrev={() => navigate(-1)}
            currentStep={step}
            totalSteps={TOTAL_STEPS}
          />
        );
      case 2:
        return (
          <Step2Mood
            value={form.moodType}
            onSelect={updateField("moodType")}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={step}
            totalSteps={TOTAL_STEPS}
          />
        );
      case 3:
        return (
          <Step3Age
            value={form.ageGroup}
            onSelect={updateField("ageGroup")}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={step}
            totalSteps={TOTAL_STEPS}
          />
        );
      case 4:
        return (
          <Step4Gender
            value={form.gender}
            onSelect={updateField("gender")}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={step}
            totalSteps={TOTAL_STEPS}
          />
        );
      case 5:
        return (
          <Step5Result
            moodLabel={form.moodType}
            spaceLabel={form.spaceType}
            onPrev={prevStep}
            onSubmit={nextStep}
            currentStep={step}
            totalSteps={TOTAL_STEPS}
          />
        );
      case 6:
        return <Step6Explanation onPrev={prevStep} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="w-full flex justify-center"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
