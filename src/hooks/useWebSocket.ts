"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

export interface Message {
  content: string;
  userId: string;
  name: string;
  timestamp: number;
}

export interface ChatState {
  connected: boolean;
  userCount: number;
  messages: Message[];
  currentUserId: string | null;
  roomId: string | null;
  inRoom: boolean;
}

interface IncomingMessage {
  type:
    | "room_created"
    | "room_joined"
    | "new_message"
    | "user_joined"
    | "user_left"
    | "error";
  roomId?: string;
  name?: string;
  userCount?: number;
  content?: string;
  userId?: string;
}

interface OutgoingMessage {
  type: "create_room" | "join_room" | "send_message";
  roomId?: string;
  name?: string;
  content?: string;
}

export function useWebSocket() {
  const [chatState, setChatState] = useState<ChatState>({
    connected: false,
    userCount: 0,
    messages: [],
    currentUserId: null,
    roomId: null,
    inRoom: false,
  });

  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const generateUserId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);

  const connect = useCallback(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

    try {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setChatState((prev) => ({
          ...prev,
          connected: true,
          currentUserId: prev.currentUserId || generateUserId(),
        }));
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (event) => {
        try {
          const message: IncomingMessage = JSON.parse(event.data);
          handleIncomingMessage(message);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
        setChatState((prev) => ({ ...prev, connected: false }));

        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(
            `Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`,
          );

          reconnectTimeout.current = setTimeout(
            () => {
              connect();
            },
            Math.pow(2, reconnectAttempts.current) * 1000,
          ); //  backoff
        } else {
          console.log("Max reconnection attempts reached");
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }
  }, [generateUserId]);

  const handleIncomingMessage = useCallback((message: IncomingMessage) => {
    switch (message.type) {
      case "room_created":
        if (message.roomId) {
          setChatState((prev) => ({
            ...prev,
            roomId: message.roomId!,
          }));
          toast.success(
            `Room created successfully! Room ID: ${message.roomId}`,{
              description:"copied to clipboard"
            }
          );
          
          navigator.clipboard.writeText(message.roomId);
        }
        break;

      case "room_joined":
        setChatState((prev) => ({
          ...prev,
          roomId: message.roomId || prev.roomId,
          userCount: message.userCount || prev.userCount,
          inRoom: true,
        }));
        break;

      case "new_message":
        if (message.content && message.userId && message.name) {
          const newMessage: Message = {
            content: message.content,
            userId: message.userId,
            name: message.name,
            timestamp: Date.now(),
          };

          setChatState((prev) => ({
            ...prev,
            messages: [...prev.messages, newMessage],
          }));
        }
        break;

      case "user_joined":
        setChatState((prev) => ({
          ...prev,
          userCount: message.userCount || prev.userCount,
        }));

        // Add system message for user joined
        if (message.name) {
          const systemMessage: Message = {
            content: `${message.name} joined the room`,
            userId: "system",
            name: "System",
            timestamp: Date.now(),
          };

          setChatState((prev) => ({
            ...prev,
            messages: [...prev.messages, systemMessage],
          }));
        }
        break;

      case "user_left":
        setChatState((prev) => ({
          ...prev,
          userCount: message.userCount || prev.userCount,
        }));

      
        if (message.name) {
          const systemMessage: Message = {
            content: `${message.name} left the room`,
            userId: "system",
            name: "System",
            timestamp: Date.now(),
          };

          setChatState((prev) => ({
            ...prev,
            messages: [...prev.messages, systemMessage],
          }));
        }
        break;

      case "error":
        console.error("WebSocket error:", message.content);
        // todo: toast notification here
        break;

      default:
        console.warn("Unknown message type:", message);
    }
  }, []);

  const sendMessage = useCallback((message: OutgoingMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }, []);

  const createRoom = useCallback(() => {
    sendMessage({ type: "create_room" });
  }, [sendMessage]);

  const joinRoom = useCallback(
    (roomId: string, name: string) => {
      setChatState((prev) => ({
        ...prev,
        messages: [], 
      }));
      sendMessage({ type: "join_room", roomId, name });
    },
    [sendMessage],
  );

  const sendChatMessage = useCallback(
    (content: string) => {
      sendMessage({ type: "send_message", content });
    },
    [sendMessage],
  );

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    setChatState({
      connected: false,
      userCount: 0,
      messages: [],
      currentUserId: null,
      roomId: null,
      inRoom: false,
    });
  }, []);

  
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  return {
    chatState,
    createRoom,
    joinRoom,
    sendMessage: sendChatMessage,
    disconnect,
    reconnect: connect,
  };
}
