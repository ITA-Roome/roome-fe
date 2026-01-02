import OnboardingLayout from "./OnboardingLayout";

type Step4GenderProps = {
  value: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
  totalSteps: number;
};

const GENDER_OPTIONS = ["여성", "남성", "기타"];

export default function Step4Gender({
  value,
  onSelect,
  onPrev,
  onNext,
  currentStep,
  totalSteps,
}: Step4GenderProps) {
  return (
    <OnboardingLayout
      title="성별을 선택해주세요"
      onNext={onNext}
      onPrev={onPrev}
      nextDisabled={!value}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className="grid grid-cols-3 gap-6 w-full mb-10">
        {GENDER_OPTIONS.map((gender) => (
          <button
            key={gender}
            onClick={() => onSelect(gender)}
            className={`flex items-center justify-center p-5 w-full h-13 rounded-lg font-body2 transition ${
              value === gender
                ? "bg-primary-700 text-white"
                : "bg-[#BB854A] text-white"
            }`}
          >
            {gender}
          </button>
        ))}
      </div>
    </OnboardingLayout>
  );
}
