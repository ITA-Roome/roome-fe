import { fetchSuggestMock, getPopularMock, getRecentMock } from "@/api/search";
import useGetInfiniteProductsList, {
  ProductOrder,
} from "@/hooks/useInfiniteScroll";
import { useMemo, useState } from "react";

import InfiniteScrollGrid from "@/components/feed/grid/InfiniteScrollGrid";
import PhotoCard from "@/components/feed/grid/PhotoCard";
import SearchInput from "@/components/feed/search/SearchInput";
import GridSkeleton from "@/components/skeletons/GridSkeleton";

import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";

export default function ShopPage() {
  // 임시 키워드
  const KEYWORDS = [
    "미니멀한",
    "빈티지한",
    "우드톤",
    "모던한",
    "따뜻한",
    "아늑한",
  ];

  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [order] = useState<ProductOrder>("LATEST");
  const [sort, setSort] = useState("인기순");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetInfiniteProductsList(21, search, order);
  const flat = useMemo(() => data?.items ?? [], [data]);

  const toggleKeyword = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  };

  return (
    <div className="relative isolate pt-16 max-w-md mx-auto px-7 pb-20">
      {/* 검색 */}
      <section>
        <SearchInput
          value={search}
          onChange={setSearch}
          onSubmit={setSearch}
          fetchSuggest={fetchSuggestMock}
          getRecent={getRecentMock}
          getPopular={getPopularMock}
          minLength={2}
          debounceMs={250}
          maxItems={10}
        />
      </section>

      {/* 키워드 */}
      <section className="mt-4">
        <div className="grid grid-cols-3 gap-x-2 gap-y-2">
          {KEYWORDS.map((label, i) => {
            const key = `${label}-${i}`;
            const on = selected.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleKeyword(label)}
                className={[
                  "px-3 py-1 rounded-[4px] font-caption text-center transition-all",
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

      {/* 제품 정렬 */}
      <section className="flex gap-3 justify-start mt-3">
        {["인기순", "최신순", "가격순"].map((label, i) => {
          const on = sort === label;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSort(label)}
              className={[
                "px-4 py-1 rounded-[6px] font-caption text-center transition-all",
                on
                  ? "bg-primary-400 text-primary-50"
                  : "bg-primary-700 text-primary-50",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </section>
      <button
        type="button"
        className="mt-3 flex flex-row items-center gap-x-1 font-caption-strong text-primary-700"
      >
        <ArrowUpIcon className="w-3 h-3" />
        <span>필터 적용하기</span>
      </button>

      {/* 제품 */}
      <section className="mt-3">
        <InfiniteScrollGrid
          items={flat}
          keySelector={(it) => String(it.id)}
          renderItem={(it) => (
            <PhotoCard
              id={it.id}
              title={it.name}
              imageUrl={it.thumbnailUrl}
              price={it.price}
              subtitle={it.shopName}
              showInfo
              //   onClick={() => Navigate(`/product/${productId}`)}
            />
          )}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          loadMore={fetchNextPage}
          columns="grid-cols-3"
          gap="gap-4"
          Skeletons={<GridSkeleton />}
        />
      </section>
    </div>
  );
}
