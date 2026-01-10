import OnboardingResultIcon from "@/assets/onboarding/result/Onboarding_result.svg?react";
import OnboardingLayout from "./OnboardingLayout";

type Step5ResultProps = {
  moodLabel: string;
  spaceLabel: string;
  onPrev: () => void;
  onSubmit: () => void;
  currentStep: number;
  totalSteps: number;
};

export default function Step5Result({
  moodLabel,
  spaceLabel,
  onPrev,
  onSubmit,
  currentStep,
  totalSteps,
}: Step5ResultProps) {
  const title = `${moodLabel} ${spaceLabel} 루미`;

  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full h-[100dvh] overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none animate-fade-in">
          <div className="absolute left-0 right-0 bottom-0 h-[58%] bg-[#BB854A]" />
          <div className="absolute bottom-[18%] left-[-35%] w-[100%] aspect-square bg-[#BB854A] rounded-full" />
          <div className="absolute bottom-[20%] right-[-35%] w-[110%] aspect-square bg-[#BB854A] rounded-full" />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <OnboardingLayout
            title={<span className="animate-fade-in block">{title}</span>}
            onNext={onSubmit}
            onPrev={onPrev}
            currentStep={currentStep}
            totalSteps={totalSteps}
            centerTitle
          >
            <div className="flex-1 flex items-center justify-center w-full animate-fade-in">
              <OnboardingResultIcon className="w-full max-w-[260px] h-auto animate-bounce-custom" />
            </div>
          </OnboardingLayout>
        </div>
      </div>
    </div>
  );
}
