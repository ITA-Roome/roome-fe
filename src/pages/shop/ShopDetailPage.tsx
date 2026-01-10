import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useToggleProductLike } from "@/hooks/useToggleProductLike";
import { useToggleProductScrap } from "@/hooks/useToggleProductScrap";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useQuery } from "@tanstack/react-query";
import { ProductApi } from "@/api/product";

import PageContainer from "@/components/layout/PageContainer";
import DetailImage from "@/components/detail/DetailImage";
import DetailHeader from "@/components/detail/DetailHeader";
import DetailProfile from "@/components/detail/DetailProfile";
import DetailDescription from "@/components/detail/DetailDescription";
import DetailRelatedGrid from "@/components/detail/DetailRelatedGrid";

export default function ShopDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const id = useMemo(() => {
    const n = Number(productId);
    return Number.isFinite(n) ? n : null;
  }, [productId]);

  const { data: product, isLoading, error } = useProductDetail(id);

  const { mutate: toggleLike, isPending: isTogglingLike } =
    useToggleProductLike();
  const { mutate: toggleScrap, isPending: isTogglingScrap } =
    useToggleProductScrap();

  const { data: relatedReferencesData } = useQuery({
    queryKey: ["relatedReferences", id],
    queryFn: () => (id ? ProductApi.fetchRelatedReferences(id) : []),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <PageContainer className="text-primary-700">
        <p className="font-body2">상품 정보를 불러오는 중입니다...</p>
      </PageContainer>
    );
  }

  if (error || !product) {
    return (
      <PageContainer className="text-primary-700">
        <p className="font-body2">상품 정보를 찾을 수 없습니다.</p>
      </PageContainer>
    );
  }

  const formattedPrice = product.price
    ? `₩${product.price.toLocaleString("ko-KR")}`
    : "가격 정보 없음";
  const relatedProducts = product.relatedProductList || [];

  const relatedReferences =
    relatedReferencesData?.map((ref) => ({
      id: ref.referenceId,
      thumbnailUrl: ref.thumbnailUrl,
    })) || [];

  return (
    <PageContainer>
      <DetailImage
        src={product.thumbnailUrl || ""}
        alt={product.name}
        showBadge={false}
      />

      <DetailHeader
        title={product.name}
        subtitle={formattedPrice}
        isLiked={product.isLiked}
        isScrapped={product.isScrapped}
        isTogglingLike={isTogglingLike}
        isTogglingScrap={isTogglingScrap}
        onToggleLike={() => toggleLike(product.id)}
        onToggleScrap={() => toggleScrap(product.id)}
        onShare={() => {}}
      />

      {product.shop && (
        <DetailProfile
          imageUrl={product.shop.logoUrl}
          name={product.shop.name}
        />
      )}

      <DetailDescription description={product.description} />

      {product.productUrl && (
        <section className="mt-10 px-8">
          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-3 rounded-full border border-primary-600 font-body2 text-primary-700 hover:bg-primary-50 active:bg-primary-100 transition-colors"
          >
            구매처 바로가기
          </a>
        </section>
      )}

      <DetailRelatedGrid
        title="관련 제품들"
        items={relatedProducts
          .filter((item) => item.id !== undefined)
          .map((item) => ({
            id: item.id!,
            imageUrl: item.imageUrl,
            name: item.name,
          }))}
        emptyMessage="관련 상품이 없습니다."
        onItemClick={(id) => navigate(`/shop/${id}`)}
      />

      <DetailRelatedGrid
        title="관련 레퍼런스들"
        items={relatedReferences.map((item) => ({
          id: item.id,
          imageUrl: item.thumbnailUrl,
        }))}
        emptyMessage="관련 레퍼런스가 없습니다."
        onItemClick={(id) => navigate(`/feed/${id}`)}
      />
    </PageContainer>
  );
}
