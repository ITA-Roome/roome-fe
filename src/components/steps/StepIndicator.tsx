type StepIndicatorProps = {
  current: number;
  total: number;
};

export default function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      {Array.from({ length: total }, (_, index) => {
        const isActive = current === index + 1;
        return (
          <span
            key={index}
            className={`h-2.5 w-2.5 rounded-full border border-primary-700 ${
              isActive ? "bg-primary-700" : "bg-white"
            }`}
          />
        );
      })}
    </div>
  );
}
