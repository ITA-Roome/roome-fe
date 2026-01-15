import { apiClient } from "@/lib/apiClient";
import { CommonResponse } from "@/types/common";
import type {
  BoardItem,
  BoardListRequest,
  ChatMessageRequest,
  ChatMessageResponse,
  SaveChatRecommendationRequest,
  PageResponse,
} from "@/types/chatbot";

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

  saveRecommendationToBoard: async (
    payload: SaveChatRecommendationRequest,
  ): Promise<CommonResponse<number>> => {
    const { data } = await apiClient.post<CommonResponse<number>>(
      "/api/boards",
      payload,
    );
    return data;
  },

  getBoardList: async (
    params: BoardListRequest,
  ): Promise<CommonResponse<PageResponse<BoardItem>>> => {
    const { data } = await apiClient.get<
      CommonResponse<PageResponse<BoardItem>>
    >("/api/boards", {
      params,
    });
    return data;
  },
};
