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
