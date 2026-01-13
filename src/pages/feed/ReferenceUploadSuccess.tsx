import { useEffect } from "react";
import OnboardingResultIcon from "@/assets/onboarding/result/Onboarding_result.svg?react";
import { motion } from "framer-motion";

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
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute left-0 right-0 bottom-0 h-[58%] bg-[#BB854A]"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="absolute bottom-[18%] left-[-35%] w-[100%] aspect-square bg-[#BB854A] rounded-full"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="absolute bottom-[20%] right-[-35%] w-[110%] aspect-square bg-[#BB854A] rounded-full"
          />
        </div>

        <div className="h-14 px-4 flex items-center justify-end"></div>

        <div className="flex-1 flex flex-col items-center justify-center -mt-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[20px] font-bold text-primary-700 mb-20 relative z-20"
          >
            업로드가 완료되었습니다!
          </motion.h2>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.5,
            }}
            className="w-[60%] max-w-[260px] relative z-20"
          >
            <OnboardingResultIcon className="w-full h-auto max-h-full object-contain" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
