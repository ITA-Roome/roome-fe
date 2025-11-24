import { fetchSuggestMock, getPopularMock, getRecentMock } from "@/api/search";
import useGetInfiniteProductsList, {
  ProductOrder,
} from "@/hooks/useInfiniteScroll";
import { useMemo, useState } from "react";

import InfiniteScrollGrid from "@/components/feed&shop/grid/InfiniteScrollGrid";
import PhotoCard from "@/components/feed&shop/grid/PhotoCard";
import SearchInput from "@/components/feed&shop/search/SearchInput";
import GridSkeleton from "@/components/skeletons/GridSkeleton";
import Dropdown from "@/components/feed&shop/dropdown/Dropdown";
import ShopFilterPanel from "../../components/feed&shop/dropdown/ShopFilterPanel";

import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg?react";
import { useNavigate } from "react-router-dom";

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [order] = useState<ProductOrder>("LATEST");
  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetInfiniteProductsList(21, search, order);
  const flat = useMemo(() => data?.items ?? [], [data]);

  return (
    <div className="relative isolate pt-16 max-w-md mx-auto px-5">
      {/* 검색 */}
      <section className="relative z-30">
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

      {/* 드롭다운 */}
      <section>
        <Dropdown
          wrapperClassName="w-full"
          menuClassname="w-full"
          toggleButton={(open) => (
            <div className="mt-3 flex flex-row items-center gap-x-2 font-caption-strong text-primary-700">
              {open ? (
                <ArrowDownIcon className="w-3 h-3 " />
              ) : (
                <ArrowUpIcon className="w-3 h-3" />
              )}
              <p>필터 적용하기</p>
            </div>
          )}
        >
          <ShopFilterPanel />
        </Dropdown>
      </section>

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
              showInfo
              onClick={() => navigate(`/shop/${it.id}`)}
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
