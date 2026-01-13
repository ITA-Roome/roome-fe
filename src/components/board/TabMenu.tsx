import clsx from "clsx";

type TabType = "product" | "reference";

interface TabMenuProps {
  tab: TabType;
  onChange: (tab: TabType) => void;
}

export default function TabMenu({ tab, onChange }: TabMenuProps) {
  return (
    <div className="w-full flex justify-center my-4">
      {/* 바깥 컨테이너: 위만 둥글고 아래 각지게 */}
      <div
        className="
          flex w-full h-[46px]
          bg-primary-200
          rounded-t-[18px]
          overflow-hidden
        "
      >
        {/* 레퍼런스 */}
        <button
          onClick={() => onChange("reference")}
          className={clsx(
            "flex-1 text-sm font-medium transition-colors",
            "rounded-tl-[18px]",
            tab === "reference"
              ? "bg-white text-[#5D3C28] shadow-[inset_0_0_0_1px_rgba(93,60,40,0.35)]"
              : "bg-[#CBBFB3] text-[#FFFDF4]",
          )}
        >
          레퍼런스
        </button>

        {/* 제품 */}
        <button
          onClick={() => onChange("product")}
          className={clsx(
            "flex-1 text-sm font-medium transition-colors",
            "rounded-tr-[18px]",
            tab === "product"
              ? "bg-white text-[#5D3C28] shadow-[inset_0_0_0_1px_rgba(93,60,40,0.35)]"
              : "bg-[#CBBFB3] text-[#FFFDF4]",
          )}
        >
          제품
        </button>
      </div>
    </div>
  );
}
