// 사용자 입력 타입
export enum ChatInputType {
  BUTTON = "BUTTON",
  TEXT = "TEXT",
}

// 챗봇 응답 타입
export enum ChatResponseType {
  QUESTION = "QUESTION",
  RESULT = "RESULT",
}

// 제품 추천 결과 타입
export type ChatProduct = {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  reason?: string;
  advantage?: string;
  mood?: string;
  recommendedPlace?: string;
};

export type ChatProductResult = {
  chatMode?: "PRODUCT";
  products: ChatProduct[];
};

// 인테리어(무드) 추천 결과 타입
export type ChatMoodResult = {
  title: string;
  referenceIdList: number[];
  imageUrlList: string[];
  moodDescription: string;
  moodKeywords: string[];
  summary: string;
};

export type ChatResultData = ChatProductResult | ChatMoodResult;

export type ChatMessageRequest = {
  sessionId: string | null;
  inputType: ChatInputType;
  message: string;
};

export type ChatMessageResponse = {
  sessionId: string;
  type: ChatResponseType;
  message: string;
  options?: string[];
  data?: ChatProductResult | ChatMoodResult;
};

export type SaveChatRecommendationRequest = {
  sessionId: string;
};

export type BoardListRequest = {
  page: number;
  size: number;
  sort?: string[];
};

export type BoardItem = {
  boardId: number;
  userId: number;
  title: string;
  description: string;
  keywords: string[];
  imageUrls: string[];
  productNames: string[];
  category: "REFERENCE";
  createdAt: string;
};

export type PageResponse<T> = {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
};
