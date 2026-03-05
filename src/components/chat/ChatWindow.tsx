"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/lib/store";
import { chatApi } from "@/lib/api";
import { MessageBubble } from "./MessageBubble";
import { VoiceButton } from "./VoiceButton";
import type { ChatMessage } from "@/lib/types";

function createMessage(
  role: ChatMessage["role"],
  content: string,
  contentType: ChatMessage["content_type"] = "text",
  data?: unknown
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    content_type: contentType,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function ChatWindow() {
  const [input, setInput] = useState("");
  const {
    messages,
    isLoading,
    conversationId,
    addMessage,
    setLoading,
    setConversationId,
  } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      // Add user message
      addMessage(createMessage("user", trimmed));
      setInput("");
      setLoading(true);

      try {
        const { response, conversation_id } = await chatApi.sendMessage(
          trimmed,
          conversationId || undefined
        );

        if (!conversationId) {
          setConversationId(conversation_id);
        }

        addMessage(createMessage("assistant", response));
      } catch {
        addMessage(
          createMessage(
            "assistant",
            "Sorry, I'm having trouble connecting. Please try again.",
            "error"
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [isLoading, conversationId, addMessage, setLoading, setConversationId]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setInput(text);
    sendMessage(text);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.length === 0 && (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Send className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Hotel Booking Assistant
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Ask me to search hotels, make bookings, or help with RFPs. Try
                &ldquo;Find me hotels in Paris&rdquo; or &ldquo;I need a venue
                for a 50-person retreat.&rdquo;
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="rounded-2xl bg-muted px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t bg-background p-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl items-end gap-2"
        >
          <VoiceButton onTranscript={handleVoiceTranscript} />

          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="min-h-[40px] max-h-[120px] resize-none"
          />

          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
