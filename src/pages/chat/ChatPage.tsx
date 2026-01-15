import { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MessageList from "@/components/chatbot/MessageList";
import ChatInput from "@/components/chatbot/ChatInput";
import { ChatApi } from "@/api/chatbot";
import {
  ChatInputType,
  ChatResponseType,
  ChatResultData,
  ChatProductResult,
  ChatMoodResult,
} from "@/types/chatbot";
import PageContainer from "@/components/layout/PageContainer";

export type Message = {
  role: "user" | "bot";
  content: string;
  resultData?: ChatResultData;
};

const STORAGE_KEY = "chatMessages";
const SESSION_ID_KEY = "chatSessionId";
const DEFAULT_OPTIONS = ["인테리어 추천", "제품 추천"];

export default function ChatPage() {
  const navigate = useNavigate();

  const userId = sessionStorage.getItem("userId") ?? "guest";
  const nickname = sessionStorage.getItem("nickname") ?? "guest";
  const storageKey = `${STORAGE_KEY}:${userId}`;
  const sessionKey = `${SESSION_ID_KEY}:${userId}`;

  const defaultBotMessages = useMemo(() => {
    return [
      {
        role: "bot" as const,
        content: `안녕 ${nickname}!\n나는 ${nickname}의 인테리어를 도와줄 ROOME라고 해!\n만나서 반가워 :)`,
      },
      {
        role: "bot" as const,
        content: `${nickname}가 원하는 인테리어를 알려줘!\n[예시) 6평 원룸 꾸미기를 하고 싶은데, 어떤 제품들로 구성하면 좋을지 추천받고싶어! 화이트 톤을 이용한 깔끔한 인테리어로!]`,
      },
    ];
  }, [nickname]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 1) 세션 저장소에서 복원. 없으면 기본 봇 인사.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages(defaultBotMessages);
      }
      const savedSessionId = sessionStorage.getItem(sessionKey);
      if (savedSessionId) {
        setSessionId(savedSessionId);
      }
    } catch (err) {
      console.error("대화 복원 실패:", err);
      setMessages(defaultBotMessages);
    } finally {
      setIsHydrated(true);
    }
  }, [storageKey, defaultBotMessages, sessionKey]);

  useEffect(() => {
    // 대화가 복원된 뒤 옵션이 비어 있으면 기본 질문 두 개를 노출
    if (isHydrated && options.length === 0) {
      setOptions(DEFAULT_OPTIONS);
    }
  }, [isHydrated, options.length]);

  // 2) 복원 후에만 저장 (Strict Mode 중복 실행 방지)
  useEffect(() => {
    if (!isHydrated) return; // 초기 빈 상태로 덮어쓰는 것 방지
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (err) {
      console.error("대화 저장 실패:", err);
    }
  }, [messages, isHydrated, storageKey]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (sessionId) {
        sessionStorage.setItem(sessionKey, sessionId);
      } else {
        sessionStorage.removeItem(sessionKey);
      }
    } catch (err) {
      console.error("세션 저장 실패:", err);
    }
  }, [isHydrated, sessionId, sessionKey]);

  // 제품 추천인지 체크
  const isProductResult = (data: unknown): data is ChatProductResult => {
    return (
      typeof data === "object" &&
      data !== null &&
      "products" in data &&
      Array.isArray((data as ChatProductResult).products)
    );
  };

  // 인테리어 추천인지 체크
  const isMoodResult = (data: unknown): data is ChatMoodResult => {
    return (
      typeof data === "object" &&
      data !== null &&
      ("title" in data || "imageUrlList" in data)
    );
  };

  const sendToBot = useCallback(
    async (
      UserMessage: string,
      inputType: ChatInputType,
      options?: { silentUser?: boolean },
    ) => {
      const trimmed = UserMessage.trim();
      if (!trimmed) return;

      if (!options?.silentUser) {
        setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      }
      setLoading(true);

      try {
        const res = await ChatApi.chatMessage({
          sessionId,
          inputType,
          message: trimmed,
        });

        const botContent =
          res.data?.type === ChatResponseType.RESULT && res.data.data
            ? (res.data.message ?? "추천 결과입니다.")
            : (res.data?.message ?? "답변을 가져오지 못했습니다.");

        let resultData: ChatResultData | undefined;

        if (isProductResult(res.data?.data)) {
          resultData = res.data.data;
        } else if (isMoodResult(res.data?.data)) {
          resultData = res.data.data;
        }

        setSessionId(res.data?.sessionId ?? null);
        setOptions(
          res.data?.type === ChatResponseType.RESULT
            ? []
            : (res.data?.options ?? []),
        );

        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: botContent,
            resultData,
          },
        ]);
      } catch (error) {
        console.error("챗봇 호출 실패:", error);
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "죄송해요. 잠시 후 다시 시도해 주세요." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [sessionId],
  );

  const handleSend = (userMessage: string) => {
    void sendToBot(userMessage, ChatInputType.TEXT);
  };

  const handleOptionClick = (option: string) => {
    void sendToBot(option, ChatInputType.BUTTON);
  };

  const handleSaveSuccess = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
      sessionStorage.removeItem(sessionKey);
    } catch (err) {
      console.error("대화 삭제 실패:", err);
    }
    setSessionId(null);
    setMessages(defaultBotMessages);
    setOptions(DEFAULT_OPTIONS);
    navigate("/board/chat");
  }, [defaultBotMessages, navigate, storageKey, sessionKey]);

  return (
    <PageContainer className="h-dvh">
      <div className="h-full flex flex-col overflow-hidden">
        {/* 채팅 영역 */}
        <div className="flex-1 min-h-0 overflow-y-auto whitespace-pre-line">
          <MessageList
            messages={messages}
            className="h-full"
            isLoading={loading}
            sessionId={sessionId}
            onSaveSuccess={handleSaveSuccess}
          />
        </div>

        <div className="shrink-0">
          {/* 옵션 버튼 */}
          {options.length > 0 && (
            <div className="pt-2 pb-2 flex flex-wrap gap-2">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleOptionClick(opt)}
                  className="px-3 py-2 rounded-full border border-primary-50 font-semibold text-sm text-primary-700 bg-white active:bg-primary-50"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* 입력창 */}
          <div className="py-1">
            <ChatInput onSend={handleSend} disabled={loading} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
