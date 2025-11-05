import StepIndicator from "./StepIndicator";

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
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold text-[#5D3C28] mb-10">
        현재 나이대를 선택해주세요
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-2 gap-6">
        {AGE_OPTIONS.map((age) => (
          <button
            key={age}
            onClick={() => onSelect(age)}
            className={`flex flex-col items-center justify-center p-5 w-20 h-20 rounded-xl text-lg font-medium transition ${
              value === age
                ? "bg-[#5D3C28] text-white scale-105"
                : "bg-[#E5DCC7] text-[#5D3C28]"
            }`}
          >
            {age}
          </button>
        ))}
      </div>

      <StepIndicator current={currentStep} total={totalSteps} />

      <div className="mt-50 flex gap-4">
        <button
          onClick={onPrev}
          className="px-6 py-2 rounded-lg bg-[#E5DCC7] text-[#5D3C28]"
        >
          이전으로
        </button>
        <button
          onClick={onNext}
          disabled={!value}
          className="px-6 py-2 rounded-lg bg-[#5D3C28] text-white disabled:opacity-40"
        >
          다음으로
        </button>
      </div>
    </div>
  );
}
