import type { ProductOrder } from "@/hooks/useInfiniteScroll";

export type ProductListKeyParams = {
  search: string;
  order: ProductOrder;
  limit: number;
};

export const productKeys = {
  all: ["products"] as const,

  list: (p: ProductListKeyParams) =>
    ["products", "list", p.search, p.order, p.limit] as const,

  detail: (id: number) => ["products", "detail", id] as const,
};

export const commentKeys = {
  all: ["comments"] as const,
  list: (type: string, commentableId: number) =>
    ["comments", "list", type, commentableId] as const,
};
