"use client";

import { Header } from "@/components/layout/Header";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default function HomePage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Chat" />
      <ChatWindow />
    </div>
  );
}
