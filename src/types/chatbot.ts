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

export type ChatProduct = {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  reason: string;
};

export type ChatMessageRequest = {
  sessionId: string | null;
  inputType: ChatInputType;
  message: string;
};

export type ChatMessageResponse = {
  type: ChatResponseType;
  message: string;
  options?: string[];
  data?: {
    products?: ChatProduct[];
  };
  sessionId: string;
};
