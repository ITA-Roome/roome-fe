import Bathroom from "@/assets/onboarding/space/Bathroom.svg?react";
import Bedroom from "@/assets/onboarding/space/Bedroom.svg?react";
import Kitchen from "@/assets/onboarding/space/Kitchen.svg?react";
import LivingRoom from "@/assets/onboarding/space/LivingRoom.svg?react";
import SleepingRoom from "@/assets/onboarding/space/SleepingRoom.svg?react";
import Studio from "@/assets/onboarding/space/Studio.svg?react";
import OnboardingLayout from "./OnboardingLayout";

type Step1SpaceProps = {
  value: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
  totalSteps: number;
};

const SPACE_OPTIONS = [
  { label: "방", Icon: Bedroom },
  { label: "원룸", Icon: Studio },
  { label: "거실", Icon: LivingRoom },
  { label: "주방", Icon: Kitchen },
  { label: "화장실", Icon: Bathroom },
  { label: "침실", Icon: SleepingRoom },
];

export default function Step1Space({
  value,
  onSelect,
  onNext,
  onPrev,
  currentStep,
  totalSteps,
}: Step1SpaceProps) {
  return (
    <OnboardingLayout
      title={"인테리어할 공간을\n선택해주세요"}
      onNext={onNext}
      onPrev={onPrev}
      nextDisabled={!value}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className="grid grid-cols-3 gap-4 w-full">
        {SPACE_OPTIONS.map(({ label, Icon }) => (
          <button
            key={label}
            onClick={() => onSelect(label)}
            className={`flex flex-col items-center justify-center gap-2 w-full aspect-[24/28] rounded-lg transition-all ${
              value === label
                ? "bg-primary-700 text-white"
                : "bg-[#BB854A] text-white opacity-90 hover:opacity-100"
            }`}
          >
            <Icon className="w-15 h-15" />
            <span className="font-body2">{label}</span>
          </button>
        ))}
      </div>
    </OnboardingLayout>
  );
}
