import { useState } from "react";
import { UserApi } from "@/api/user";
import type { OnboardingPayload } from "@/types/user";
import { useNavigate } from "react-router-dom";
import Step1Space from "@/components/steps/Step1Space";
import Step2Mood from "@/components/steps/Step2Mood";
import Step3Age from "@/components/steps/Step3Age";
import Step4Gender from "@/components/steps/Step4Gender";

const TOTAL_STEPS = 4;

const AGE_MAP = {
  "10대": "TEENAGER",
  "20대": "TWENTIES",
  "30대": "THIRTIES",
  "40대": "FORTIES",
  "50대": "FIFTIES",
  "60대": "SIXTIES",
};

const GENDER_MAP = {
  남성: "MALE",
  여성: "FEMALE",
  기타: "OTHER",
};

const SPACE_MAP = {
  원룸: "ONE_ROOM",
  침실: "BEDROOM",
  화장실: "BATHROOM",
  주방: "KITCHEN",
  현관: "ENTRANCE",
  방: "ROOM",
};

const MOOD_MAP = {
  포근한: "COZY",
  심플한: "SIMPLE",
  아늑한: "SNUG",
  깔끔한: "NEAT",
  시크한: "CHIC",
  귀여운: "CUTE",
};

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
    try {
      const payload: OnboardingPayload = {
        ageGroup: AGE_MAP[form.ageGroup as keyof typeof AGE_MAP],
        gender: GENDER_MAP[form.gender as keyof typeof GENDER_MAP],
        spaceType: SPACE_MAP[form.spaceType as keyof typeof SPACE_MAP],
        moodType: MOOD_MAP[form.moodType as keyof typeof MOOD_MAP],
      };

      console.log("보낼 payload:", payload);
      await UserApi.onboardingSubmit(payload);
      navigate("/feed", { replace: true });
    } catch (error) {
      console.error("온보딩 저장 실패:", error);
      alert("온보딩 정보 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
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
