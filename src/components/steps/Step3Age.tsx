import OnboardingLayout from "./OnboardingLayout";

type Step3AgeProps = {
  value: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
  totalSteps: number;
};

const AGE_OPTIONS = ["10대", "20대", "30대", "40대", "50대", "60대"];

export default function Step3Age({
  value,
  onSelect,
  onNext,
  onPrev,
  currentStep,
  totalSteps,
}: Step3AgeProps) {
  return (
    <OnboardingLayout
      title="연령대를 선택해주세요"
      onNext={onNext}
      onPrev={onPrev}
      nextDisabled={!value}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className="grid grid-cols-3 gap-6 w-full mb-10">
        {AGE_OPTIONS.map((age) => (
          <button
            key={age}
            onClick={() => onSelect(age)}
            className={`flex items-center justify-center p-5 w-full h-13 rounded-lg font-body2 transition ${
              value === age
                ? "bg-primary-700 text-white"
                : "bg-[#BB854A] text-white"
            }`}
          >
            {age}
          </button>
        ))}
      </div>
    </OnboardingLayout>
  );
}
