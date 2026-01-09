import {
  fetchPopularSearch,
  fetchRecentSearch,
  deleteRecentSearch,
} from "@/api/search";
import SearchEmptyState from "@/components/search/SearchEmptyState";

import MasonryInfiniteGrid from "@/components/feed&shop/grid/MasonryInfiniteGrid";
import PhotoCard from "@/components/feed&shop/grid/PhotoCard";
import SearchInput from "@/components/search/SearchInput";
import GridSkeleton from "@/components/skeletons/GridSkeleton";
import useGetInfiniteReferences from "@/hooks/useInfiniteReferences";
import { useToggleReferenceLike } from "@/hooks/useToggleReferenceLike";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReferenceWriteIcon from "@/assets/icons/reference_write.svg?react";

import { motion } from "framer-motion";

function getAspectRatio(id: number) {
  const ratios = ["aspect-[3/4]", "aspect-[1/1]", "aspect-[4/5]"];
  return ratios[id % ratios.length];
}

export default function FeedPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetInfiniteReferences(search || undefined);

  const flat = useMemo(() => data?.items ?? [], [data]);

  const { mutate: toggleLike } = useToggleReferenceLike();

  return (
    <div className="relative isolate pt-16 max-w-md mx-auto px-5">
      <section className="relative z-30">
        <SearchInput
          onSubmit={setSearch}
          getRecent={fetchRecentSearch}
          getPopular={fetchPopularSearch}
          removeRecent={deleteRecentSearch}
          minLength={2}
          debounceMs={250}
          maxItems={10}
        />
      </section>

      <section className="mt-3">
        {flat.length === 0 && !isFetchingNextPage && !isLoading && search ? (
          <SearchEmptyState />
        ) : (
          <MasonryInfiniteGrid
            items={flat}
            keySelector={(it) => String(it.referenceId)}
            renderItem={(it) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <PhotoCard
                  id={it.referenceId}
                  title={it.nickname}
                  imageUrl={it.imageUrlList?.[0] ?? ""}
                  price={0}
                  showInfo={false}
                  isLiked={it.isLiked}
                  onLike={() => toggleLike(it.referenceId)}
                  onClick={() => navigate(`/feed/${it.referenceId}`)}
                  ratio="auto"
                  className={getAspectRatio(it.referenceId)}
                />
              </motion.div>
            )}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage || isLoading}
            loadMore={() => fetchNextPage()}
            gap="gap-4"
            Skeletons={<GridSkeleton />}
          />
        )}
      </section>

      <button
        onClick={() => navigate("/feed/upload")}
        className="fixed bottom-[100px] right-5 z-50 drop-shadow-lg active:scale-95 transition-transform"
        style={{
          marginRight: "calc((100vw - min(100vw, 448px)) / 2)",
        }}
      >
        <ReferenceWriteIcon className="w-15 h-auto" />
      </button>
    </div>
  );
}
