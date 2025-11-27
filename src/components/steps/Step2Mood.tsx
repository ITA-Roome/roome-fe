import StepIndicator from "./StepIndicator";

type Step2MoodProps = {
  value: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
  totalSteps: number;
};

const MOOD_OPTIONS = [
  "포근한",
  "심플한",
  "아늑한",
  "깔끔한",
  "시크한",
  "귀여운",
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
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold text-[#5D3C28] mb-10">
        원하시는 분위기를 선택해주세요
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood}
            onClick={() => onSelect(mood)}
            className={`flex flex-col items-center justify-between p-5 w-32 h-36 rounded-xl text-lg font-medium transition ${
              value === mood
                ? "bg-[#5D3C28] text-white scale-105"
                : "bg-[#E5DCC7] text-[#5D3C28]"
            }`}
          >
            <span className="mt-2 mb-1 text-base font-semibold">{mood}</span>

            <img
              src={`/images/onboarding/${mood}.png`}
              alt={mood}
              className="w-16 h-16 object-contain"
            />
          </button>
        ))}
      </div>

      <StepIndicator current={currentStep} total={totalSteps} />

      <div className="mt-10 flex gap-4">
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
