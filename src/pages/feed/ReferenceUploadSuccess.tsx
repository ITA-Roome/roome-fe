import { useEffect } from "react";
import OnboardingResultIcon from "@/assets/onboarding/result/Onboarding_result.svg?react";

interface Props {
  onFinish: () => void;
}

export default function ReferenceUploadSuccess({ onFinish }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col overflow-hidden">
      <div className="relative z-10 w-full h-full flex flex-col">
        <div className="absolute inset-0 pointer-events-none animate-fade-in">
          <div className="absolute left-0 right-0 bottom-0 h-[58%] bg-[#BB854A]" />
          <div className="absolute bottom-[18%] left-[-35%] w-[100%] aspect-square bg-[#BB854A] rounded-full" />
          <div className="absolute bottom-[20%] right-[-35%] w-[110%] aspect-square bg-[#BB854A] rounded-full" />
        </div>
        <div className="h-14 px-4 flex items-center justify-end"></div>
        <div className="flex-1 flex flex-col items-center justify-center -mt-20">
          <h2 className="text-[20px] font-bold text-primary-700 mb-20">
            업로드가 완료되었습니다!
          </h2>
          <div className="w-[60%] max-w-[260px]">
            <OnboardingResultIcon className="w-full h-auto animate-bounce-custom" />
          </div>
        </div>
      </div>
    </div>
  );
}
