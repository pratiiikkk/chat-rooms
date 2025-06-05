"use client";

import { DotPattern } from "@/components/GridDot";
import { RoomActions } from "@/components/RoomActions";
import { ChatRoom } from "@/components/ChatRoom";
import { useChat } from "@/context/ChatProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";

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
          "mask-[linear-gradient(to_bottom_right,white,transparent,transparent)]",
        )}
      />

      <main className="relative z-10 flex h-screen flex-1 flex-col items-center justify-center py-8 md:py-12 mx-2" >
        {chatState.inRoom ? <ChatRoom /> : <RoomActions />}
      <footer
      className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400"
      >
        <div
        className="flex items-center justify-center gap-2"
        >
          <p>
            Made with ❤️ 
          </p>
          <Button
          size="icon"
          variant={"ghost"}
          className="rounded-full"
          >
            <Link
            href={"https://github.com/pratiiikkk/chat-rooms"}
            >
            <Github />
            </Link>
          </Button>
        </div>

      </footer>
      </main>
    </div>
  );
}
