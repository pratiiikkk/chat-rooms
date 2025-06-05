"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useChat } from "@/context/ChatProvider";
import { Loader2, Plus, Users, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function RoomActions() {
  const { chatState, createRoom, joinRoom } = useChat();
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (chatState.roomId && isCreating) {
      setCreatedRoomId(chatState.roomId);
      setIsCreating(false);
    }
  }, [chatState.roomId, isCreating]);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setCreatedRoomId(null);
    createRoom();
  };

  const handleJoinRoom = async () => {
    if (!roomId.trim() || !name.trim()) return;

    setIsJoining(true);
    joinRoom(roomId.trim(), name.trim());
    setTimeout(() => setIsJoining(false), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && roomId.trim() && name.trim()) {
      handleJoinRoom();
    }
  };

  const copyRoomId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast.success("Room ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const joinCreatedRoom = () => {
    if (createdRoomId && name.trim()) {
      joinRoom(createdRoomId, name.trim());
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {createdRoomId && (
        <Card className="">
          <CardHeader className="pb-3 text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-neutral-700 dark:text-neutral-400">
              <Check className="h-5 w-5" />
              Room Created!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <code className="flex-1 text-center font-mono text-lg font-bold">
                {createdRoomId}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyRoomId(createdRoomId)}
                disabled={copied}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Enter your name to join"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && name.trim() && joinCreatedRoom()
                }
              />
              <Button
                onClick={joinCreatedRoom}
                disabled={!name.trim()}
                className="w-full"
              >
                Join Your Room
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!createdRoomId && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              Create Room
            </CardTitle>
            <CardDescription>
              Start a new chat room for your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleCreateRoom}
              disabled={isCreating || !chatState.connected}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Room
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

     
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="h-5 w-5" />
              Join Room
            </CardTitle>
            <CardDescription>
              Enter a room ID and your name to join
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Room ID (e.g., abc123)"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!chatState.connected}
              />
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!chatState.connected}
              />
            </div>
            <Button
              onClick={handleJoinRoom}
              disabled={
                !roomId.trim() ||
                !name.trim() ||
                isJoining ||
                !chatState.connected
              }
              className="w-full"
            >
              {isJoining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Join Room
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      

      <div className="text-center">
        <div
          className={`inline-flex items-center gap-2 text-sm ${
            chatState.connected ? "text-green-500" : "text-red-500"
          }`}
        >
          <div
            className={`h-2 w-2 rounded-full ${
              chatState.connected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {chatState.connected ? "Connected" : "Disconnected"}
        </div>
      </div>
    </div>
  );
}
