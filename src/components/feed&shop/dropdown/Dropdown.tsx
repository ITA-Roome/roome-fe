import { useRef, useState } from "react";
import clsx from "clsx";

type DropdownProps = {
  toggleButton: (open: boolean) => React.ReactNode;
  children: React.ReactNode;
  menuClassname?: string;
  wrapperClassName?: string;
  isOpen?: boolean;
};

export default function Dropdown({
  toggleButton,
  children,
  menuClassname,
  wrapperClassName,
  isOpen = false,
}: DropdownProps) {
  const [open, setOpen] = useState(isOpen);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <div className={clsx("w-full", wrapperClassName)} ref={dropdownRef}>
      <button type="button" onClick={handleToggle}>
        {toggleButton(open)}
      </button>

      {open && <div className={clsx("mt-2", menuClassname)}>{children}</div>}
    </div>
  );
}
