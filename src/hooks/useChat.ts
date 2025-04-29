import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useUserAuth } from "@/context/AuthContext";
import { chatService } from "@/service/chat.service";
import { useChatStore } from "@/store/chatStore";

interface ChatError {
  message: string;
  type: "send" | "edit" | "delete" | "pin";
}

export const useChat = () => {
  const { t } = useTranslation();
  const { user } = useUserAuth();
  const { messages, subscribe, setError: setStoreError } = useChatStore();
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState<ChatError | null>(null);

  useEffect(() => {
    const unsubscribe = subscribe();

    return () => unsubscribe();
  }, [subscribe]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await chatService.sendMessage(newMessage, user);
      setNewMessage("");
      setError(null);
      setStoreError(null);
    } catch (err) {
      setError({ message: t("chat.error_sending"), type: "send" });
      setStoreError(t("chat.error_sending"));
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await chatService.deleteMessage(messageId, user);
      setError(null);
      setStoreError(null);
    } catch (err) {
      setError({ message: t("chat.error_deleting"), type: "delete" });
      setStoreError(t("chat.error_deleting"));
    }
  };

  const handleEditMessage = async (messageId: string) => {
    if (!editText.trim()) return;
    try {
      await chatService.updateMessage(messageId, editText, user);
      setEditingMessageId(null);
      setEditText("");
      setError(null);
      setStoreError(null);
    } catch (err) {
      setError({ message: t("chat.error_updating"), type: "edit" });
      setStoreError(t("chat.error_updating"));
    }
  };

  const handlePinMessage = async (messageId: string, pinned: boolean) => {
    try {
      await chatService.pinMessage(messageId, user, pinned);
      setError(null);
      setStoreError(null);
    } catch (err) {
      setError({ message: t("chat.error_pinning"), type: "pin" });
      setStoreError(t("chat.error_pinning"));
    }
  };

  const startEditing = (messageId: string, text: string) => {
    setEditingMessageId(messageId);
    setEditText(text);
  };

  const isNewMessage = (createdAt: string): boolean => {
    const messageTime = new Date(createdAt).getTime();
    const now = new Date().getTime();

    return now - messageTime < 5 * 60 * 1000;
  };

  const canEditOrDelete = (createdAt: string): boolean => {
    const messageTime = new Date(createdAt).getTime();
    const now = new Date().getTime();

    return now - messageTime < 60 * 1000;
  };

  return {
    user,
    messages,
    newMessage,
    setNewMessage,
    editingMessageId,
    editText,
    setEditText,
    error,
    handleSendMessage,
    handleDeleteMessage,
    handleEditMessage,
    handlePinMessage,
    startEditing,
    cancelEditing: () => setEditingMessageId(null),
    isNewMessage,
    canEditOrDelete,
  };
};
