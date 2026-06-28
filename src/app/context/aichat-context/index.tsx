"use client";
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";
import useSWR from "swr";
import { getFetcher, postFetcher } from "@/app/api/global-fetcher";

import {
  ChatAIMessage,
  ChatSession,
} from "@/app/(dashboard)/dashboard/types/apps/ai-chat";

type ChatAIContextType = {
  chatList: ChatAIMessage[];
  setChatList: Dispatch<SetStateAction<ChatAIMessage[]>>;
  loading: boolean;
  error: string;
  sendMessage: (text: string, useGemini: boolean) => Promise<void>;
  typing: boolean;
  chatSessions: ChatSession[];
  saveSession: (userText: string, aiText: string) => void;
  setChatSessions: Dispatch<SetStateAction<ChatSession[]>>;
  setTyping: Dispatch<SetStateAction<boolean>>;
};

// Create context
export const ChatAIContext = createContext<ChatAIContextType | undefined>(
  undefined
);

// Provider
export const ChatAIProvider = ({ children }: { children: ReactNode }) => {
  const [chatList, setChatList] = useState<ChatAIMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typing, setTyping] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const { data, error: swrError, mutate } = useSWR("/api/chat-ai", getFetcher);

  // On fetch success
  useEffect(() => {
    if (data?.data) {
      setChatList(data.data);
      setLoading(false);
    }
    if (swrError) {
      setError("Failed to fetch chat.");
      setLoading(false);
    }
  }, [data, swrError]);

  //for save  history

  const saveSession = (userText: string, aiText: string) => {
    const sessionTimestamp = Date.now();

    const newSession: ChatSession = {
      id: sessionTimestamp.toString(),
      title: userText,
      messages: [
        { id: sessionTimestamp, sender: "user", text: userText },
        { id: sessionTimestamp + 1, sender: "ai", text: aiText },
      ],
      timestamp: sessionTimestamp,
      status: "active",
    };

    setChatSessions((prev) => [...prev, newSession]);
  };

  const sendMessage = async (text: string, useGemini = true) => {
    try {
      setTyping(true);

      // Add user message locally for immediate feedback
      const userMessage: ChatAIMessage = {
        id: Date.now(),
        sender: "user",
        text,
      };
      setChatList((prev) => [...prev, userMessage]);

      const response = await postFetcher("/api/chat-ai", { text, useGemini });

      if (response && response.data) {
        // The API returns [userMsg, aiReply]
        // We already added the user message, so we only need the AI response
        const [, aiReply] = response.data;
        setChatList((prev) => [...prev, aiReply]);
        saveSession(text, aiReply.text);
      }
    } catch (err: unknown) {
      setError("Failed to send message");
      console.error(err);
    } finally {
      setTyping(false);
    }
  };

  return (
    <ChatAIContext.Provider
      value={{
        setTyping,
        setChatSessions,
        saveSession,
        chatSessions,
        chatList,
        setChatList,
        loading,
        error,
        typing,
        sendMessage,
      }}
    >
      {children}
    </ChatAIContext.Provider>
  );
};
