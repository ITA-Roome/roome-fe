import {
  fetchPopularSearch,
  fetchRecentSearch,
  deleteRecentSearch,
} from "@/api/search";
import useGetInfiniteProductsList, {
  ProductOrder,
} from "@/hooks/useInfiniteScroll";
import { useMemo, useState } from "react";

import InfiniteScrollGrid from "@/components/feed&shop/grid/InfiniteScrollGrid";
import PhotoCard from "@/components/feed&shop/grid/PhotoCard";
import SearchInput from "@/components/search/SearchInput";
import ShopFilterPanel, {
  SortOption,
} from "../../components/feed&shop/dropdown/ShopFilterPanel";
import SearchEmptyState from "@/components/search/SearchEmptyState";
import EmptyListState from "@/components/common/EmptyListState";

import { useNavigate } from "react-router-dom";
import { useToggleProductLike } from "@/hooks/useToggleProductLike";

import PageContainer from "@/components/layout/PageContainer";
import FadeIn from "@/components/common/FadeIn";

export default function ShopPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const navigate = useNavigate();
  const limit = 21;

  const order: ProductOrder = useMemo(() => {
    if (!sortOption) return "RECOMMENDED";
    switch (sortOption) {
      case "인기순":
        return "POPULAR";
      case "최신순":
        return "LATEST";
      case "가격순":
        return "PRICE_ASC";
      default:
        return "POPULAR";
    }
  }, [sortOption]);

  const handleSort = (option: SortOption) => {
    setSortOption((prev) => (prev === option ? null : option));
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetInfiniteProductsList(limit, searchQuery, selectedKeywords, order);

  const flat = useMemo(() => data?.items ?? [], [data]);

  const { mutate: toggleLike } = useToggleProductLike();

  const handleSearchSubmit = (val: string) => {
    setSearchQuery(val);
    setInputValue(val);
  };

  return (
    <PageContainer bottomPadding={false}>
      <section className="relative z-30">
        <SearchInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSearchSubmit}
          getRecent={fetchRecentSearch}
          getPopular={fetchPopularSearch}
          removeRecent={deleteRecentSearch}
          minLength={2}
          debounceMs={250}
          maxItems={10}
        />
      </section>

      <ShopFilterPanel
        selected={selectedKeywords}
        onSelect={setSelectedKeywords}
        sort={sortOption}
        onSort={handleSort}
      />

      <div className="mt-4 pb-20">
        {flat.length === 0 && !isFetchingNextPage && !isLoading ? (
          searchQuery ? (
            <SearchEmptyState />
          ) : (
            <EmptyListState message="등록된 상품이 없습니다." />
          )
        ) : (
          <InfiniteScrollGrid
            items={flat}
            keySelector={(item) => item.id}
            renderItem={(item) => (
              <FadeIn key={item.id}>
                <PhotoCard
                  id={item.id}
                  imageUrl={item.thumbnailUrl}
                  title={item.name}
                  price={item.price}
                  subtitle={item.shop.name}
                  isLiked={item.isLiked}
                  onLike={() => toggleLike(item.id)}
                  onClick={() => navigate(`/shop/${item.id}`)}
                />
              </FadeIn>
            )}
            loadMore={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage || isLoading}
          />
        )}
      </div>
    </PageContainer>
  );
}
