import { useState } from "react";
import ArrowLeftIcon from "@/assets/onboarding/onboarding_new/arrow_left.svg?react";
import ArrowRightIcon from "@/assets/onboarding/onboarding_new/arrow_right.svg?react";
import OnboardingNew1 from "@/assets/onboarding/onboarding_new/onboarding_new_1.svg?react";
import OnboardingNew2 from "@/assets/onboarding/onboarding_new/onboarding_new_2.svg?react";
import OnboardingNew3 from "@/assets/onboarding/onboarding_new/onboarding_new_3.svg?react";
import OnboardingNew4 from "@/assets/onboarding/onboarding_new/onboarding_new_4.svg?react";

type Step6ExplanationProps = {
  onPrev: () => void;
  onSubmit: () => void;
};

const STEPS = [
  {
    Icon: OnboardingNew1,
  },
  {
    Icon: OnboardingNew2,
  },
  {
    Icon: OnboardingNew3,
  },
  {
    Icon: OnboardingNew4,
  },
];

export default function Step6Explanation({
  onPrev,
  onSubmit,
}: Step6ExplanationProps) {
  const [subStep, setSubStep] = useState(0);

  const handleNext = () => {
    if (subStep < STEPS.length - 1) {
      setSubStep((prev) => prev + 1);
    } else {
      onSubmit();
    }
  };

  const handlePrev = () => {
    if (subStep > 0) {
      setSubStep((prev) => prev - 1);
    } else {
      onPrev();
    }
  };

  const currentContent = STEPS[subStep];

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-white">
      <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-4 overflow-y-auto no-scrollbar">
        <div className="w-full flex-1 flex items-center justify-center min-h-0">
          <currentContent.Icon className="w-[90%] h-auto max-h-[90%] object-contain" />
        </div>
      </div>

      <div className="w-full px-5 pb-[34px] pt-4">
        {subStep === STEPS.length - 1 ? (
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-2">
              {STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    idx === subStep ? "bg-primary-700" : "bg-[#D9D9D9]"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={onSubmit}
              className="w-[80%] h-[54px] rounded-full bg-[#FFC800] text-primary-700 font-heading1"
            >
              시작하기
            </button>
          </div>
        ) : (
          <div className="relative flex items-center justify-center h-[56px]">
            <button
              onClick={handlePrev}
              className="absolute left-5 flex items-center justify-center"
            >
              <ArrowLeftIcon className="w-10 h-auto" />
            </button>
            <div className="flex gap-2">
              {STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    idx === subStep ? "bg-primary-700" : "bg-[#D9D9D9]"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="absolute right-5 flex items-center justify-center"
            >
              <ArrowRightIcon className="w-10 h-auto" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
