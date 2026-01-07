import ArrowLeft from "@/assets/icons/arrow-left.svg?react";
import StepIndicator from "./StepIndicator";
import { ReactNode } from "react";

type OnboardingLayoutProps = {
  title: ReactNode;
  children: ReactNode;
  onPrev?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  currentStep: number;
  totalSteps: number;
  centerTitle?: boolean;
};

export default function OnboardingLayout({
  title,
  children,
  onPrev,
  onNext,
  nextDisabled,
  currentStep,
  totalSteps,
  centerTitle = false,
}: OnboardingLayoutProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full max-w-[320px] relative justify-between py-6">
      <div className="flex flex-col w-full">
        <div className="h-12 w-full flex items-center mb-2">
          {onPrev && (
            <button onClick={onPrev} className="p-2 -ml-2">
              <ArrowLeft className="w-4 h-4 text-primary-700" />
            </button>
          )}
        </div>

        <h2
          className={`text-xl font-semibold text-primary-700 mb-15 whitespace-pre-line min-h-[60px] ${
            centerTitle ? "text-center" : "text-left"
          }`}
        >
          {title}
        </h2>
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-start overflow-y-auto no-scrollbar">
        {children}
      </div>

      <div className="w-full flex flex-col items-center gap-6 mt-4 pt-4">
        <StepIndicator current={currentStep} total={totalSteps} />
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="w-full py-3 rounded-full bg-primary-700 text-white disabled:opacity-40 transition-all font-body2"
        >
          다음으로
        </button>
      </div>
    </div>
  );
}
