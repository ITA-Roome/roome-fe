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

// 단일 상품 정보 타입
export type ProductItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  productUrl: string;
  thumbnailUrl: string;
  shopId: number;
  shopName: string;
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
