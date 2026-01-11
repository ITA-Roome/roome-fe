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

// 결과 data가 올 때 product/reference 분리
export enum ChatMoodType {
  PRODUCT = "PRODUCT",
}

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

export type ChatResultData = {
  chatMode?: string;
  products?: ChatProduct[];
};

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
  data?: {
    chatMode: ChatMoodType;
    products?: ChatProduct[];
  };
};
