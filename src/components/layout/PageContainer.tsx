import clsx from "clsx";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  topPadding?: boolean;
  bottomPadding?: boolean;
}

export default function PageContainer({
  children,
  className,
  topPadding = true,
  bottomPadding = true,
}: PageContainerProps) {
  return (
    <div
      className={clsx(
        "relative isolate max-w-md mx-auto px-5",
        topPadding && "pt-16",
        bottomPadding && "pb-24",
        className,
      )}
    >
      {children}
    </div>
  );
}
