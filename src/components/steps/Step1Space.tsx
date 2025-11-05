import StepIndicator from "./StepIndicator";

type Step1SpaceProps = {
  value: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
};

const SPACE_OPTIONS = ["원룸", "침실", "화장실", "주방", "현관", "방"];

export default function Step1Space({
  value,
  onSelect,
  onNext,
  currentStep,
  totalSteps,
}: Step1SpaceProps) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold text-[#5D3C28] mb-10">
        인테리어할 공간을 선택해주세요
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {SPACE_OPTIONS.map((space) => (
          <button
            key={space}
            onClick={() => onSelect(space)}
            className={`flex flex-col items-center justify-between p-5 w-32 h-36 rounded-xl text-lg font-medium transition ${
              value === space
                ? "bg-[#5D3C28] text-white scale-105"
                : "bg-[#E5DCC7] text-[#5D3C28]"
            }`}
          >
            {/* 텍스트 — 중앙보다 살짝 위쪽 */}
            <span className="mt-2 mb-1 text-base font-semibold">{space}</span>

            {/* 아래 이미지 (예시용, 실제 경로에 맞게 변경) */}
            <img
              src={`/images/onboarding/${space}.png`}
              alt={space}
              className="w-16 h-16 object-contain"
            />
          </button>
        ))}
      </div>

      <StepIndicator current={currentStep} total={totalSteps} />

      <button
        onClick={onNext}
        disabled={!value}
        className="mt-10 bg-[#5D3C28] text-white px-8 py-2 rounded-lg disabled:opacity-40"
      >
        다음으로
      </button>
    </div>
  );
}
