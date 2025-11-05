// 제출부분 API 연동부분 주석처리하고 일단 home으로 넘어가는 것 구현하는중
import { useState } from "react";
// import { OnboardingApi, type OnboardingPayload } from "@/api/user";
import { type OnboardingPayload } from "@/api/user";
import { useNavigate } from "react-router-dom";
import Step1Space from "@/components/steps/Step1Space";
import Step2Mood from "@/components/steps/Step2Mood";
import Step3Age from "@/components/steps/Step3Age";
import Step4Gender from "@/components/steps/Step4Gender";

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<OnboardingPayload>({
    ageGroup: "",
    gender: "",
    spaceType: "",
    moodType: "",
  });

  const updateField = (key: keyof OnboardingPayload) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    // try {
    //   await OnboardingApi.onboardingSubmit(form);
    //   localStorage.setItem("hasCompletedOnboarding", "true");
    // 나중에는 localStorage에 저장하는게 아니라 API연동해서 확인하고 할거라 괜춘
    //   navigate("/home");
    // } catch (error) {
    //   console.error("온보딩 저장 실패:", error);
    // }

    localStorage.setItem("hasCompletedOnboarding", "true");
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF4]">
      {step === 1 && (
        <Step1Space
          value={form.spaceType}
          onSelect={updateField("spaceType")}
          onNext={nextStep}
          currentStep={step}
          totalSteps={TOTAL_STEPS}
        />
      )}
      {step === 2 && (
        <Step2Mood
          value={form.moodType}
          onSelect={updateField("moodType")}
          onNext={nextStep}
          onPrev={prevStep}
          currentStep={step}
          totalSteps={TOTAL_STEPS}
        />
      )}
      {step === 3 && (
        <Step3Age
          value={form.ageGroup}
          onSelect={updateField("ageGroup")}
          onNext={nextStep}
          onPrev={prevStep}
          currentStep={step}
          totalSteps={TOTAL_STEPS}
        />
      )}
      {step === 4 && (
        <Step4Gender
          value={form.gender}
          onSelect={updateField("gender")}
          onPrev={prevStep}
          onSubmit={handleSubmit}
          currentStep={step}
          totalSteps={TOTAL_STEPS}
        />
      )}
    </div>
  );
}
