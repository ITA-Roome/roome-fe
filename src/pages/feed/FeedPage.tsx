import { fetchSuggestMock, getPopularMock, getRecentMock } from "@/api/search";
import InfiniteScrollGrid from "@/components/feed&shop/grid/InfiniteScrollGrid";
import PhotoCard from "@/components/feed&shop/grid/PhotoCard";
import SearchInput from "@/components/feed&shop/search/SearchInput";
import GridSkeleton from "@/components/skeletons/GridSkeleton";
import useGetInfiniteProductsList, {
  ProductOrder,
} from "@/hooks/useInfiniteScroll";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FeedPage() {
  const [search] = useState("");
  const [order] = useState<ProductOrder>("LATEST");
  const navigate = useNavigate();

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
              showInfo={false}
              onClick={() => navigate(`/feed-detail/${it.id}`)}
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
