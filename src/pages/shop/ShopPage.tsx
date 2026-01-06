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
import SearchInput from "@/components/search/search/SearchInput";
import ShopFilterPanel, {
  SortOption,
} from "../../components/feed&shop/dropdown/ShopFilterPanel";

import { useNavigate } from "react-router-dom";
import { useToggleProductLike } from "@/hooks/useToggleProductLike";

export default function ShopPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("인기순");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const navigate = useNavigate();
  const limit = 21;

  const order: ProductOrder = useMemo(() => {
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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetInfiniteProductsList(limit, searchQuery, selectedKeywords, order);

  const flat = useMemo(() => data?.items ?? [], [data]);

  const { mutate: toggleLike } = useToggleProductLike();

  const handleSearchSubmit = (val: string) => {
    setSearchQuery(val);
    setInputValue(val);
  };

  return (
    <div className="relative isolate pt-16 max-w-md mx-auto px-5">
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
        onSort={setSortOption}
      />

      <div className="mt-4 pb-20">
        {flat.length === 0 && !isFetchingNextPage ? (
          <div className="py-20 text-center text-gray-500">
            조건에 맞는 상품이 없습니다.
          </div>
        ) : (
          <InfiniteScrollGrid
            items={flat}
            keySelector={(item) => item.id}
            renderItem={(item) => (
              <PhotoCard
                key={item.id}
                id={item.id}
                imageUrl={item.thumbnailUrl}
                title={item.name}
                price={item.price}
                subtitle={item.shop.name}
                isLiked={item.isLiked}
                onLike={() => toggleLike(item.id)}
                onClick={() => navigate(`/shop/${item.id}`)}
              />
            )}
            loadMore={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </div>
    </div>
  );
}
