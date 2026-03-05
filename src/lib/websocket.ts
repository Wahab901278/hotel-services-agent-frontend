import type { ChatMessage } from "./types";

type WSEventHandler = (message: ChatMessage) => void;
type WSStatusHandler = (status: "connecting" | "connected" | "disconnected" | "error") => void;

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/api/v1";

export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private onMessageHandler: WSEventHandler | null = null;
  private onStatusHandler: WSStatusHandler | null = null;
  private conversationId: string | null = null;

  connect(conversationId?: string) {
    this.conversationId = conversationId || null;
    this.updateStatus("connecting");

    const url = conversationId
      ? `${WS_BASE}/chat/ws?conversation_id=${conversationId}`
      : `${WS_BASE}/chat/ws`;

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.updateStatus("connected");
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.onMessageHandler) {
          this.onMessageHandler(data);
        }
      } catch {
        console.error("Failed to parse WebSocket message");
      }
    };

    this.ws.onclose = () => {
      this.updateStatus("disconnected");
      this.attemptReconnect();
    };

    this.ws.onerror = () => {
      this.updateStatus("error");
    };
  }

  send(message: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "message",
          content: message,
          conversation_id: this.conversationId,
        })
      );
    }
  }

  sendAudio(audioBlob: Blob) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(audioBlob);
    }
  }

  onMessage(handler: WSEventHandler) {
    this.onMessageHandler = handler;
  }

  onStatus(handler: WSStatusHandler) {
    this.onStatusHandler = handler;
  }

  disconnect() {
    this.maxReconnectAttempts = 0; // prevent reconnect
    this.ws?.close();
    this.ws = null;
  }

  private updateStatus(status: "connecting" | "connected" | "disconnected" | "error") {
    if (this.onStatusHandler) {
      this.onStatusHandler(status);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      this.connect(this.conversationId || undefined);
    }, delay);
  }
}

// Singleton instance
let chatWsInstance: ChatWebSocket | null = null;

export function getChatWebSocket(): ChatWebSocket {
  if (!chatWsInstance) {
    chatWsInstance = new ChatWebSocket();
  }
  return chatWsInstance;
}
