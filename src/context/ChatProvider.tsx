"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useWebSocket, ChatState } from "@/hooks/useWebSocket";

interface ChatContextType {
  chatState: ChatState;
  createRoom: () => void;
  joinRoom: (roomId: string, name: string) => void;
  sendMessage: (content: string) => void;
  disconnect: () => void;
  reconnect: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const {
    chatState,
    createRoom,
    joinRoom,
    sendMessage,
    disconnect,
    reconnect,
  } = useWebSocket();

  const value: ChatContextType = {
    chatState,
    createRoom,
    joinRoom,
    sendMessage,
    disconnect,
    reconnect,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
}

export { ChatContext };
