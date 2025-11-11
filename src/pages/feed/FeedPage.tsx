/* eslint-disable @typescript-eslint/no-unused-vars */

import { fetchSuggestMock, getPopularMock, getRecentMock } from "@/api/search";
import InfiniteScrollGrid from "@/components/feed/grid/InfiniteScrollGrid";
import PhotoCard from "@/components/feed/grid/PhotoCard";
import SearchInput from "@/components/feed/search/SearchInput";
import GridSkeleton from "@/components/skeletons/GridSkeleton";
import useGetInfiniteProductsList, {
  ProductOrder,
} from "@/hooks/useInfiniteScroll";
import { useMemo, useState } from "react";

export default function FeedPage() {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<ProductOrder>("LATEST");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetInfiniteProductsList(21, search, order);

  const flat = useMemo(() => data?.items ?? [], [data]);

  return (
    <div className="relative isolate pt-16 max-w-md mx-auto px-5">
      <section className="relative z-30">
        <SearchInput
          onSubmit={(q) => console.log("submit:", q)}
          fetchSuggest={fetchSuggestMock}
          getRecent={getRecentMock}
          getPopular={getPopularMock}
          minLength={2}
          debounceMs={250}
          maxItems={10}
        />
      </section>

      <section className="mt-5 px-4 relative -z-10">
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
              showInfo={false}
              // onClick={() => navigate(`/products/${it.id}`)} 추후 상세 페이지 연결 예정임
            />
          )}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          loadMore={() => fetchNextPage()}
          columns="grid-cols-3"
          gap="gap-4"
          Skeletons={<GridSkeleton />}
        />
      </section>
    </div>
  );
}
