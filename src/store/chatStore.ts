import { create } from "zustand";

import { ChatMessage, chatService } from "@/service/chat.service";

interface ChatState {
  messages: ChatMessage[];
  error: string | null;
  setMessages: (messages: ChatMessage[]) => void;
  setError: (error: string | null) => void;
  subscribe: () => () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  error: null,
  setMessages: (messages) => set({ messages }),
  setError: (error) => set({ error }),
  subscribe: () => {
    const unsubscribe = chatService.subscribeToMessages((fetchedMessages) => {
      set({ messages: fetchedMessages, error: null });
    });

    return unsubscribe;
  },
}));
