import { apiClient } from "@/lib/apiClient";
import { CommonResponse } from "@/types/auth";
import type { ChatMessageRequest, ChatMessageResponse } from "@/types/chatbot";

export const ChatApi = {
  chatMessage: async (
    payload: ChatMessageRequest,
  ): Promise<CommonResponse<ChatMessageResponse>> => {
    const { data } = await apiClient.post<CommonResponse<ChatMessageResponse>>(
      "/api/chat/message",
      payload,
    );
    return data;
  },
};
