// 상품 목록 조회 파라미터
export type ProductListParams = {
  shopId?: number;
  category?: string;
  color?: string[];
  match?: "any" | "all";
  keyWord?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string[];
};

// 상품 이미지 정보 타입
export type ProductImage = {
  objectKey: string;
  sortOrder: number;
  url: string;
};

// 상품 태그
export type ProductTag = {
  id: number;
  tagType: string;
  name: string;
};

// 상품에 연결된 가게 정보
export type ProductShop = {
  id: number;
  name: string;
  logoUrl: string;
};

// 단일 상품 정보 타입
export type ProductItem = {
  id: number;
  name: string;
  price: number;
  liked: boolean;

  category: string;
  description: string;

  productUrl: string;
  thumbnailUrl: string;

  images: ProductImage[];
  tags: ProductTag[];
  shop: ProductShop;

  relatedProductList?: RelatedProductList[];
};

export type RelatedProductList = {
  id?: number;
  productId?: number;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
};

// 상품 목록 조회 시 응답 데이터 구조
export type ProductListResponse = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: ProductItem[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
};

// 상품 좋아요 토글 응답 타입
export type ToggleLikeResponse = {
  liked: boolean;
};
