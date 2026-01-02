import clsx from "clsx";

type TabType = "product" | "reference";

interface TabMenuProps {
  tab: TabType;
  onChange: (tab: TabType) => void;
}

export default function TabMenu({ tab, onChange }: TabMenuProps) {
  return (
    <div className="w-full flex justify-center my-4">
      <div className="flex bg-primary-200 rounded-full p-1 w-[200px]">
        <button
          className={clsx(
            "flex-1 py-2 rounded-full text-sm font-medium transition-all",
            tab === "reference"
              ? "bg-primary-700 text-white"
              : "text-primary-700",
          )}
          onClick={() => onChange("reference")}
        >
          레퍼런스
        </button>

        <button
          className={clsx(
            "flex-1 py-2 rounded-full text-sm font-medium transition-all",
            tab === "product"
              ? "bg-primary-700 text-white"
              : "text-primary-700",
          )}
          onClick={() => onChange("product")}
        >
          제품
        </button>
      </div>
    </div>
  );
}
