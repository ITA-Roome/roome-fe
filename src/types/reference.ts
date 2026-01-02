export type ReferenceListParams = {
  keyWord?: string;
  page?: number;
  size?: number;
  sort?: string[];
};

export type ReferenceListItem = {
  referenceId: number;
  nickname: string;
  userId: number;
  imageUrlList: (string | null)[];
  scrapCount: number;
  isLiked: boolean;
  isScrapped: boolean;
};

export type ReferenceListResponse = {
  referenceList: ReferenceListItem[];
};

export type ReferenceDetailReferenceItem = {
  productId: number;
  productName: string;
  productPrice: number;
  productUrl: string;
  thumbnailUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tagList: any[];
};

export type ReferenceDetail = {
  referenceId: number;
  name: string;
  description: string;
  imageUrls: string[];
  referenceItems: ReferenceDetailReferenceItem[];
  scrapCount: number;
  likeCount: number;
  isScrapped: boolean;
  isLiked: boolean;
  userName: string;
  userProfileUrl: string;
  referenceUrl: string;
};
