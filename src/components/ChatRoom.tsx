"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/context/ChatProvider";
import { Send, Users, LogOut, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ChatRoom() {
  const { chatState, sendMessage, disconnect } = useChat();
  const [message, setMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
    
      scrollAreaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [chatState.messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendMessage(message.trim());
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyRoomId = () => {
    if (chatState.roomId) {
      navigator.clipboard.writeText(chatState.roomId);
      toast.success("Room ID copied to clipboard!");
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLeave = () => {
    disconnect();
  };

  if (!chatState.roomId) {
    return null;
  }

  return (
    <div className="flex h-[600px] w-full max-w-2xl flex-col mx-2">
      <Card className="flex h-full flex-col mx-2">
        <CardHeader className="flex-shrink-0 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-xl">
              <Users className="h-5 w-5" />
              Room: {chatState.roomId}
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyRoomId}>
                <Copy className="mr-1 h-4 w-4" />
                Copy ID
              </Button>
              <Button variant="outline" size="sm" onClick={handleLeave}>
                <LogOut className="mr-1 h-4 w-4" />
                Leave
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {chatState.userCount} {chatState.userCount === 1 ? "user" : "users"}{" "}
            online
          </div>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col p-4 pt-0 ">
          <ScrollArea className="flex-1 ">
            <div className="space-y-3" ref={scrollAreaRef}>
              {chatState.messages.map((msg, index) => (
                <div key={index} className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{msg.name}</span>
                    <span>{formatTimestamp(msg.timestamp)}</span>
                  </div>
                  
                    <div
                        className={cn(
                            "max-w-[80%] rounded-lg p-3 overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40",
                            msg.userId === chatState.currentUserId
                                ? "ml-auto bg-primary text-primary-foreground"
                                : msg.userId === "system"
                                    ? "mx-auto bg-muted text-center text-sm italic text-muted-foreground"
                                    : "bg-muted"
                        )}
                    >
                        {msg.content}
                    </div>
                </div>
              ))}
              {chatState.messages.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No messages yet. Start the conversation!
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyUp={handleKeyPress}
              disabled={!chatState.connected}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || !chatState.connected}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
