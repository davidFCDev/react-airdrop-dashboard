import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { DeleteIcon, EditIcon, PinIcon } from "@/components/icons";
import { useUserAuth } from "@/context/AuthContext";
import { useChat } from "@/hooks/useChat";

const GlobalChat = () => {
  const { t } = useTranslation();
  const { user, role } = useUserAuth();
  const {
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
    cancelEditing,
    isNewMessage,
    canEditOrDelete,
  } = useChat();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [pinnedMessageIndex, setPinnedMessageIndex] = useState(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Limpiar referencias obsoletas
    const validIds = new Set(messages.map((msg) => msg.id));

    for (const id of messageRefs.current.keys()) {
      if (!validIds.has(id)) {
        messageRefs.current.delete(id);
      }
    }
  }, [messages]);

  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        duration: 5000,
        style: {
          background: "#fee2e2",
          color: "#dc2626",
          border: "1px solid #dc2626",
        },
      });
    }
  }, [error]);

  const pinnedMessages = messages
    .filter((msg) => msg.pinned)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  const currentPinnedMessage = pinnedMessages[pinnedMessageIndex];

  const handlePinnedMessageClick = () => {
    if (!currentPinnedMessage) return;
    const messageElement = messageRefs.current.get(currentPinnedMessage.id);

    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      setPinnedMessageIndex((prev) => (prev + 1) % pinnedMessages.length || 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Determinar si un mensaje es consecutivo
  const isConsecutiveMessage = (index: number) => {
    if (index === 0) return false;
    const currentMessage = messages[index];
    const previousMessage = messages[index - 1];

    return currentMessage.userId === previousMessage.userId;
  };

  // Determinar si el siguiente mensaje es consecutivo
  const isNextConsecutive = (index: number) => {
    if (index >= messages.length - 1) return false;
    const currentMessage = messages[index];
    const nextMessage = messages[index + 1];

    return currentMessage.userId === nextMessage.userId;
  };

  return (
    <section className="flex flex-col gap-4 py-4 h-full">
      <Card
        className="bg-default-50 border border-default-200 h-[37rem]"
        radius="none"
        shadow="none"
      >
        {currentPinnedMessage && (
          <div>
            <Button
              className="w-full text-left"
              color="default"
              radius="none"
              variant="bordered"
              onPress={handlePinnedMessageClick}
            >
              <span className="text-sm font-semibold truncate">
                <PinIcon
                  className="inline-block mr-2 rotate-45 text-primary"
                  size={16}
                />
                {t("chat.view_pinned")}: {currentPinnedMessage.userName}:{" "}
                {currentPinnedMessage.text.slice(0, 50)}
                {currentPinnedMessage.text.length > 50 ? "..." : ""}
              </span>
            </Button>
          </div>
        )}
        <ScrollShadow className="flex flex-col gap-2 h-full overflow-y-auto overflow-x-hidden">
          <CardBody className="flex flex-col bg-default-100">
            {messages.length === 0 ? (
              <p className="text-sm text-default-500">
                {t("chat.no_messages")}
              </p>
            ) : (
              messages.map((message, index) => {
                const isOwnMessage = user?.uid === message.userId;
                const isAdmin = message.role === "admin";
                const isConsecutive = isConsecutiveMessage(index);
                const isUserAdmin = role === "admin";
                const nextIsConsecutive = isNextConsecutive(index);

                return (
                  <div
                    key={message.id}
                    ref={(el) => {
                      if (el) messageRefs.current.set(message.id, el);
                    }}
                    className={`flex min-w-[60%] max-w-[90%] ${
                      isOwnMessage
                        ? "justify-start mr-auto"
                        : "justify-end ml-auto"
                    } items-start ${nextIsConsecutive ? "mb-1" : "mb-2"} group`}
                    role="listitem"
                  >
                    <div
                      className={`relative flex items-center ${
                        isOwnMessage ? "flex-row" : "flex-row-reverse"
                      } gap-2 p-1 rounded-lg ${
                        message.pinned ? "border border-danger" : ""
                      } ${isOwnMessage ? "bg-default-50" : "bg-neutral-800"} w-full min-h-[2rem] overflow-x-hidden`}
                    >
                      <div className="self-start p-2">
                        <Avatar
                          isBordered
                          color="primary"
                          name={message.userName}
                          radius="md"
                          size="md"
                          src={message.avatar ?? undefined}
                        />
                      </div>
                      <div
                        className={`flex-1 ${isOwnMessage ? "text-left" : "text-right"}`}
                      >
                        {!isConsecutive && (
                          <>
                            <div
                              className={`flex items-center gap-4 ${
                                isOwnMessage ? "justify-start" : "justify-end"
                              } ${isOwnMessage ? "flex-row" : "flex-row"}`}
                            >
                              {!isOwnMessage &&
                                isNewMessage(message.createdAt) && (
                                  <span className="text-xs text-success bg-success-50 rounded-full px-2">
                                    {t("chat.new")}
                                  </span>
                                )}
                              <div
                                className={`${isOwnMessage ? "flex-row" : "flex-row-reverse"} flex items-center gap-2`}
                              >
                                <span
                                  className={`text-lg font-semibold ${
                                    isAdmin ? "text-danger" : "text-primary"
                                  }`}
                                >
                                  {message.userName}
                                  {isAdmin && " (admin)"}
                                </span>
                                <span className="text-[0.6rem] text-default-500">
                                  {new Date(message.createdAt).toLocaleString(
                                    undefined,
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                        {editingMessageId === message.id ? (
                          <div className="mt-2 flex gap-2">
                            <Input
                              aria-label={t("chat.edit_message")}
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                            />
                            <Button
                              color="secondary"
                              size="sm"
                              variant="flat"
                              onPress={() => handleEditMessage(message.id)}
                            >
                              {t("chat.save")}
                            </Button>
                            <Button
                              color="default"
                              size="sm"
                              variant="flat"
                              onPress={cancelEditing}
                            >
                              {t("chat.cancel")}
                            </Button>
                          </div>
                        ) : (
                          <p
                            className={`font-light mt-1 text-base whitespace-pre-wrap overflow-wrap-break-word ${
                              isOwnMessage &&
                              canEditOrDelete(message.createdAt) &&
                              !editingMessageId
                                ? "pb-6"
                                : ""
                            }`}
                          >
                            {message.text}
                          </p>
                        )}
                      </div>
                      {isOwnMessage &&
                        canEditOrDelete(message.createdAt) &&
                        !editingMessageId && (
                          <div className="absolute bottom-1 right-1 flex gap-1">
                            <Button
                              isIconOnly
                              aria-label={t("chat.edit_message")}
                              color="primary"
                              size="sm"
                              variant="light"
                              onPress={() =>
                                startEditing(message.id, message.text)
                              }
                            >
                              <EditIcon size={18} />
                            </Button>
                            <Button
                              isIconOnly
                              aria-label={t("chat.delete_message")}
                              color="danger"
                              size="sm"
                              variant="light"
                              onPress={() => handleDeleteMessage(message.id)}
                            >
                              <DeleteIcon size={18} />
                            </Button>
                          </div>
                        )}
                      {isAdmin && isUserAdmin && (
                        <Button
                          isIconOnly
                          aria-label={
                            message.pinned ? t("chat.unpin") : t("chat.pin")
                          }
                          className={`absolute top-1 ${
                            isUserAdmin ? "right-1" : "left-1"
                          } flex items-center justify-center ${
                            message.pinned
                              ? "block"
                              : "hidden group-hover:block"
                          }`}
                          color="danger"
                          size="sm"
                          variant="light"
                          onPress={() =>
                            handlePinMessage(message.id, !message.pinned)
                          }
                        >
                          <PinIcon size={18} />
                        </Button>
                      )}
                      {isAdmin && !isUserAdmin && message.pinned && (
                        <span
                          aria-label={t("chat.pinned")}
                          className="absolute top-1 left-1 flex items-center justify-center text-danger"
                        >
                          <PinIcon size={18} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </CardBody>
        </ScrollShadow>
        <div className="p-4 border-t border-default-200">
          <div className="flex gap-2 w-full">
            <Input
              aria-label={t("chat.send_message")}
              placeholder={t("chat.send_message")}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              aria-label={t("chat.send")}
              color="primary"
              onPress={handleSendMessage}
            >
              {t("chat.send")}
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default GlobalChat;
