import { useState } from "react";

const KEYWORDS = [
  "미니멀한",
  "빈티지한",
  "우드톤",
  "모던한",
  "따뜻한",
  "아늑한",
];

type SortOption = "인기순" | "최신순" | "가격순";

export default function ShopFilterPanel() {
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("인기순");

  const toggleKeyword = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  };

  return (
    <div>
      {/* 키워드 */}
      <section className="mt-1">
        <div className="grid grid-cols-3 gap-x-2 gap-y-2">
          {KEYWORDS.map((label) => {
            const on = selected.includes(label);
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleKeyword(label)}
                className={[
                  "px-3 py-1 rounded-sm font-caption text-center transition-all",
                  on
                    ? "bg-primary-400 text-white"
                    : "bg-primary-700 text-primary-50",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 정렬 */}
      <section className="mt-4">
        <div className="flex gap-3 justify-start">
          {(["인기순", "최신순", "가격순"] as SortOption[]).map((label) => {
            const on = sort === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setSort(label)}
                className={[
                  "px-4 py-1 rounded-md font-caption text-center transition-all",
                  on
                    ? "bg-primary-400 text-primary-50"
                    : "bg-primary-700 text-primary-50",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
