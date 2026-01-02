import CozyIcon from "@/assets/onboarding/mood/cozy.svg?react";
import SimpleIcon from "@/assets/onboarding/mood/simple.svg?react";
import SungIcon from "@/assets/onboarding/mood/snug.svg?react";
import ClearIcon from "@/assets/onboarding/mood/clean.svg?react";
import ChicIcon from "@/assets/onboarding/mood/chic.svg?react";
import CuteIcon from "@/assets/onboarding/mood/cute.svg?react";
import OnboardingLayout from "./OnboardingLayout";

type Step2MoodProps = {
  value: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
  totalSteps: number;
};

const MOOD_OPTIONS = [
  { label: "포근한", Icon: CozyIcon },
  { label: "심플한", Icon: SimpleIcon },
  { label: "아늑한", Icon: SungIcon },
  { label: "깔끔한", Icon: ClearIcon },
  { label: "시크한", Icon: ChicIcon },
  { label: "귀여운", Icon: CuteIcon },
];

export default function Step2Mood({
  value,
  onSelect,
  onNext,
  onPrev,
  currentStep,
  totalSteps,
}: Step2MoodProps) {
  return (
    <OnboardingLayout
      title="마음에 드는 키워드를 골라보세요!"
      onNext={onNext}
      onPrev={onPrev}
      nextDisabled={!value}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className="grid grid-cols-3 gap-4 w-full">
        {MOOD_OPTIONS.map(({ label, Icon }) => (
          <button
            key={label}
            onClick={() => onSelect(label)}
            className={`flex flex-col items-center justify-center gap-2 w-full aspect-[24/28] rounded-lg transition-all ${
              value === label
                ? "bg-primary-700 text-white"
                : "bg-[#BB854A] text-white opacity-90 hover:opacity-100"
            }`}
          >
            <Icon className="w-13 h-13" />
            <span className="font-body2">{label}</span>
          </button>
        ))}
      </div>
    </OnboardingLayout>
  );
}
