import StepIndicator from "./StepIndicator";

type Step4GenderProps = {
  value: string;
  onSelect: (value: string) => void;
  onPrev: () => void;
  onSubmit: () => void;
  currentStep: number;
  totalSteps: number;
};

const GENDER_OPTIONS = ["여성", "남성", "기타"];

export default function Step4Gender({
  value,
  onSelect,
  onPrev,
  onSubmit,
  currentStep,
  totalSteps,
}: Step4GenderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFDF4]">
      <h2 className="text-xl font-semibold text-[#5D3C28] mb-10">
        성별을 선택해주세요
      </h2>

      <div className="grid grid-cols-3 gap-5 justify-items-center">
        {GENDER_OPTIONS.map((gender) => (
          <button
            key={gender}
            onClick={() => onSelect(gender)}
            className={`flex flex-col items-center justify-center w-25 h-25 rounded-xl text-lg font-semibold transition ${
              value === gender
                ? "bg-[#5D3C28] text-white scale-105"
                : "bg-[#E5DCC7] text-[#5D3C28]"
            }`}
          >
            {gender}
          </button>
        ))}
      </div>

      <div className="mt-40">
        <StepIndicator current={currentStep} total={totalSteps} />
      </div>

      <div className="mt-16 flex gap-4">
        <button
          onClick={onPrev}
          className="px-6 py-2 rounded-lg bg-[#E5DCC7] text-[#5D3C28]"
        >
          이전으로
        </button>
        <button
          onClick={onSubmit}
          disabled={!value}
          className="px-6 py-2 rounded-lg bg-[#5D3C28] text-white disabled:opacity-40"
        >
          제출하기
        </button>
      </div>
    </div>
  );
}
