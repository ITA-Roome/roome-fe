import { apiClient } from "@/lib/apiClient";
import type { ChatMessageRequest, ChatMessageResponse } from "@/types/chatbot";

export const ChatApi = {
  sendRecommendation: async (
    payload: ChatMessageRequest,
  ): Promise<ChatMessageResponse> => {
    const { data } = await apiClient.post<ChatMessageResponse>(
      "/api/chat/message",
      payload,
    );
    return data;
  },
};
