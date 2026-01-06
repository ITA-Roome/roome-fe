import { useState } from "react";
import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";

import Cozy from "@/assets/filter/Cozy.svg?react";
import Living from "@/assets/filter/Living.svg?react";
import Room from "@/assets/filter/Room.svg?react";
import Simple from "@/assets/filter/Simple.svg?react";
import Studio from "@/assets/filter/Studio.svg?react";
import Warm from "@/assets/filter/Warm.svg?react";

import Latest from "@/assets/filter/Latest.svg?react";
import Popular from "@/assets/filter/Popular.svg?react";
import Price from "@/assets/filter/Price.svg?react";

const KEYWORDS = ["방 (공간)", "원룸", "거실", "포근한", "심플한", "아늑한"];

export type SortOption = "인기순" | "최신순" | "가격순";

const FILTER_ICONS: Record<
  string,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  "방 (공간)": Room,
  원룸: Studio,
  거실: Living,
  포근한: Cozy,
  심플한: Simple,
  아늑한: Warm,
  인기순: Popular,
  최신순: Latest,
  가격순: Price,
};

interface ShopFilterPanelProps {
  selected: string[];
  onSelect: (selected: string[]) => void;
  sort: SortOption;
  onSort: (sort: SortOption) => void;
}

export default function ShopFilterPanel({
  selected,
  onSelect,
  sort,
  onSort,
}: ShopFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleKeyword = (label: string) => {
    onSelect(
      selected.includes(label)
        ? selected.filter((x) => x !== label)
        : [...selected, label],
    );
  };

  return (
    <div>
      <div className="flex justify-start mb-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 font-caption text-primary-700 mt-2 py-3"
        >
          {isOpen ? (
            <ArrowUpIcon className="w-2 h-2 text-primary-700" />
          ) : (
            <ArrowDownIcon className="w-2 h-2 text-primary-700" />
          )}
          필터 적용하기
        </button>
      </div>

      {isOpen && (
        <div className="animate-fade-in-down">
          <section className="mt-1">
            <div className="grid grid-cols-3 gap-2">
              {KEYWORDS.map((label) => {
                const on = selected.includes(label);
                const Icon = FILTER_ICONS[label];
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleKeyword(label)}
                    className={[
                      "flex items-center justify-center w-full gap-1 px-1 py-2 rounded-full font-caption transition-all",
                      on
                        ? "bg-primary-700 text-white border border-primary-700"
                        : "bg-white text-primary-700 border border-primary-200",
                    ].join(" ")}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {label}
                  </button>
                );
              })}
            </div>
          </section>
          <section className="mt-4 mb-6">
            <div className="flex gap-2 justify-start">
              {(["인기순", "최신순", "가격순"] as SortOption[]).map((label) => {
                const on = sort === label;
                const Icon = FILTER_ICONS[label];
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onSort(label)}
                    className={[
                      "flex items-center justify-center w-[75px] gap-1 px-1 py-2 rounded-full font-caption transition-all",
                      on
                        ? "bg-primary-700 text-white border border-primary-700"
                        : "bg-white text-primary-700 border border-primary-200",
                    ].join(" ")}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {label}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
