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
                  "px-3 py-2 rounded-full border border-primary-200 font-caption text-center transition-all",
                  on
                    ? "bg-primary-700 text-white"
                    : "bg-white text-primary-700",
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
                  "px-4 py-2 rounded-full font-caption text-center transition-all",
                  on
                    ? "bg-primary-700 text-white"
                    : "bg-white text-primary-700 border border-primary-200",
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
