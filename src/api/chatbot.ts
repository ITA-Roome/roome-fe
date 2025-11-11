import axios from "axios";

export const ChatBotApi = {
  sendMessage: async (message: string) => {
    const res = await axios.post("/api/chatbot", { message });
    return res.data;
  },
};
