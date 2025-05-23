import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useUserAuth } from "@/context/AuthContext";
import { chatService } from "@/service/chat.service";
import { useChatStore } from "@/store/chatStore";

interface ChatError {
  message: string;
  type: "send" | "edit" | "delete" | "pin";
}

interface ReplyMessage {
  id: string;
  text: string;
  userName: string;
}

export const useChat = () => {
  const { t } = useTranslation();
  const { user } = useUserAuth();
  const { messages, subscribe, setError: setStoreError } = useChatStore();
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState<ChatError | null>(null);
  const [replyMessage, setReplyMessage] = useState<ReplyMessage | null>(null);
  const [contextMessageId, setContextMessageId] = useState<string | null>(null);

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
      await chatService.sendMessage(newMessage, user, replyMessage);
      setNewMessage("");
      setReplyMessage(null);
      setError(null);
      setStoreError(null);
    } catch {
      setError({ message: t("chat.error_sending"), type: "send" });
      setStoreError(t("chat.error_sending"));
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await chatService.deleteMessage(messageId, user);
      setContextMessageId(null);
      setError(null);
      setStoreError(null);
    } catch {
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
      setContextMessageId(null);
      setError(null);
      setStoreError(null);
    } catch {
      setError({ message: t("chat.error_updating"), type: "edit" });
      setStoreError(t("chat.error_updating"));
    }
  };

  const handlePinMessage = async (messageId: string, pinned: boolean) => {
    try {
      await chatService.pinMessage(messageId, user, pinned);
      setContextMessageId(null);
      setError(null);
      setStoreError(null);
    } catch {
      setError({ message: t("chat.error_pinning"), type: "pin" });
      setStoreError(t("chat.error_pinning"));
    }
  };

  const startEditing = (messageId: string, text: string) => {
    setEditingMessageId(messageId);
    setEditText(text);
    setContextMessageId(null);
  };

  const startReplying = (messageId: string, text: string, userName: string) => {
    setReplyMessage({ id: messageId, text, userName });
    setContextMessageId(null);
  };

  const cancelReplying = () => {
    setReplyMessage(null);
  };

  const openContextMenu = (messageId: string) => {
    setContextMessageId(messageId);
  };

  const closeContextMenu = () => {
    setContextMessageId(null);
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
    replyMessage,
    contextMessageId,
    error,
    handleSendMessage,
    handleDeleteMessage,
    handleEditMessage,
    handlePinMessage,
    startEditing,
    startReplying,
    cancelReplying,
    openContextMenu,
    closeContextMenu,
    cancelEditing: () => {
      setEditingMessageId(null);
      setContextMessageId(null);
    },
    isNewMessage,
    canEditOrDelete,
  };
};
