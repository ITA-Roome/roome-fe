import { useState, useRef, useLayoutEffect } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";

interface DetailDescriptionProps {
  description: string;
}

export default function DetailDescription({
  description,
}: DetailDescriptionProps) {
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (descRef.current) {
      setIsOverflow(
        descRef.current.scrollHeight > descRef.current.clientHeight,
      );
    }
  }, [description]);

  return (
    <section className="mt-6">
      <motion.p
        ref={descRef}
        initial={false}
        animate={{ height: isDescOpen ? "auto" : 50 }}
        transition={{ duration: 0.3 }}
        className={clsx(
          "font-body3 text-primary-700 overflow-hidden",
          !isDescOpen && "line-clamp-2",
        )}
      >
        {description}
      </motion.p>

      {isOverflow && (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setIsDescOpen((prev) => !prev)}
            className="flex items-center gap-x-2 font-caption text-primary-700"
          >
            {isDescOpen ? (
              <>
                <ArrowUpIcon className="w-3 h-3" />
                <span>설명 접기</span>
              </>
            ) : (
              <>
                <ArrowDownIcon className="w-3 h-3" />
                <span>설명 더보기</span>
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
