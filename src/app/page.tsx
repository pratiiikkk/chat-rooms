"use client";

import { DotPattern } from "@/components/GridDot";
import { RoomActions } from "@/components/RoomActions";
import { ChatRoom } from "@/components/ChatRoom";
import { useChat } from "@/context/ChatProvider";
import { cn } from "@/lib/utils";

export default function Home() {
  const { chatState } = useChat();

  return (
    <div className="min-h-screen">
      <DotPattern
        width={30}
        height={30}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
        )}
      />

      <main className="relative z-10 flex h-screen flex-1 flex-col items-center justify-center py-8 md:py-12">
        {chatState.inRoom ? <ChatRoom /> : <RoomActions />}
      </main>
    </div>
  );
}
