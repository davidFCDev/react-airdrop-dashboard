import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { addToast } from "@heroui/toast";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { CancelIcon, CheckIcon, PinIcon, SendIcon } from "@/components/icons";
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
    replyMessage,
    error,
    handleSendMessage: originalHandleSendMessage,
    handleDeleteMessage,
    handleEditMessage,
    handlePinMessage,
    startEditing,
    startReplying,
    cancelReplying,
    cancelEditing,
    canEditOrDelete,
  } = useChat();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [pinnedMessageIndex, setPinnedMessageIndex] = useState(0);
  const [contextMessageId, setContextMessageId] = useState<string | null>(null);

  useEffect(() => {
    if (chatEndRef.current && scrollRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
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
      addToast({
        title: t("chat.error"),
        description: t("chat.error_description"),
        color: "danger",
      });
    }
  }, [error]);

  useEffect(() => {
    // Cerrar context menu al hacer clic fuera
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contextMessageId &&
        e.target instanceof Element &&
        !e.target.closest(".context-menu")
      ) {
        setContextMessageId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [contextMessageId]);

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

  const handleContextKeyDown = (
    e: React.KeyboardEvent,
    messageId: string,
    text: string,
    userName: string,
    action: string,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (action === "reply") {
        startReplying(messageId, text, userName);
      } else if (action === "edit") {
        startEditing(messageId, text);
      } else if (action === "delete") {
        handleDeleteMessage(messageId);
      } else if (action === "pin") {
        handlePinMessage(
          messageId,
          !messages.find((m) => m.id === messageId)!.pinned,
        );
      }
      setContextMessageId(null);
    }
  };

  // Manejar envío de mensaje con scroll al último mensaje
  const handleSendMessage = async () => {
    await originalHandleSendMessage();
    if (chatEndRef.current && scrollRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
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

  // Determinar si debe mostrarse el nickname
  const showNickname = (index: number) => {
    if (index === 0) return true;
    const currentMessage = messages[index];
    const previousMessage = messages[index - 1];

    return currentMessage.userId !== previousMessage.userId;
  };

  // Determinar la posición del modal
  const getModalPosition = (messageId: string) => {
    const messageElement = messageRefs.current.get(messageId);

    if (!messageElement || !scrollRef.current)
      return { top: "2rem", bottom: "auto" };
    const rect = messageElement.getBoundingClientRect();
    const scrollRect = scrollRef.current.getBoundingClientRect();
    const isNearBottom = rect.bottom > scrollRect.bottom - 100;

    return isNearBottom
      ? { top: "auto", bottom: "2rem" }
      : { top: "2rem", bottom: "auto" };
  };

  return (
    <section className="flex flex-col gap-4 py-4 h-full">
      <Card
        className="bg-default-50 border border-default-200 h-[29rem] relative"
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
                  className="inline-block mr-2 rotate-45 text-danger"
                  size={14}
                />
                {t("chat.view_pinned")}:{" "}
                <span className="font-light ml-1">
                  {currentPinnedMessage.text.slice(0, 50)}
                  {currentPinnedMessage.text.length > 50 ? "..." : ""}
                </span>
              </span>
            </Button>
          </div>
        )}
        <ScrollShadow
          ref={scrollRef}
          className="flex flex-col h-full overflow-y-auto overflow-x-hidden"
        >
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
                const showAvatar = !nextIsConsecutive && !isOwnMessage;
                const modalPosition =
                  contextMessageId === message.id
                    ? getModalPosition(message.id)
                    : {};

                return (
                  <div
                    key={message.id}
                    ref={(el) => {
                      if (el) messageRefs.current.set(message.id, el);
                    }}
                    className={`grid grid-cols-[auto_1fr] items-start gap-2 w-full relative group ${
                      isConsecutive ? "mt-1" : "mt-4"
                    } ${isOwnMessage ? "ml-auto justify-self-end" : ""}`}
                    role="listitem"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMessageId(message.id);
                    }}
                  >
                    <div className="w-8 h-8 flex items-end">
                      {showAvatar && (
                        <Avatar
                          name={message.userName}
                          radius="md"
                          size="sm"
                          src={message.avatar ?? undefined}
                        />
                      )}
                    </div>
                    <div
                      className={`relative flex flex-col px-2 py-1 rounded-lg ${
                        isOwnMessage ? "bg-secondary-300" : "bg-default-200"
                      } inline-block min-h-[2rem] overflow-x-hidden`}
                    >
                      {!isOwnMessage && showNickname(index) && (
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-semibold ${isAdmin ? "text-danger" : "text-primary"}`}
                          >
                            {message.userName}
                            {isAdmin && " (admin)"}
                          </span>
                        </div>
                      )}
                      {message.replyTo && (
                        <div className="border-l-2 border-primary pl-2 mb-1 text-sm text-neutral-300 bg-default-50 rounded-r-lg">
                          <span className="font-semibold text-success">
                            {message.replyTo.userName}
                          </span>
                          <p className="truncate">{message.replyTo.text}</p>
                        </div>
                      )}
                      {editingMessageId === message.id ? (
                        <div className=" mr-10 items-center flex gap-2">
                          <Input
                            aria-label={t("chat.edit_message")}
                            className="bg-default-200 rounded-lg"
                            value={editText}
                            variant="bordered"
                            onChange={(e) => setEditText(e.target.value)}
                          />
                          <Button
                            isIconOnly
                            color="default"
                            size="sm"
                            variant="light"
                            onPress={() => handleEditMessage(message.id)}
                          >
                            <CheckIcon size={14} />
                          </Button>
                          <Button
                            isIconOnly
                            color="default"
                            size="sm"
                            variant="light"
                            onPress={cancelEditing}
                          >
                            <CancelIcon size={14} />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <p className="font-light mt-1 text-base whitespace-pre-wrap overflow-wrap-break-word max-w-[calc(100%-4rem)]">
                            {message.text}
                          </p>
                          <span className="absolute bottom-0 right-2 text-[0.6rem] text-white/70">
                            {new Date(message.createdAt).toLocaleString(
                              undefined,
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      )}
                      {(isUserAdmin || message.pinned) && (
                        <div className="absolute top-1 right-1">
                          {isUserAdmin ? (
                            <Button
                              isIconOnly
                              aria-label={
                                message.pinned ? t("chat.unpin") : t("chat.pin")
                              }
                              className={`flex items-center justify-center ${
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
                              <div className="flex items-center justify-center">
                                <PinIcon className="rotate-45" size={14} />
                              </div>
                            </Button>
                          ) : (
                            message.pinned && (
                              <span
                                aria-label={t("chat.pinned")}
                                className="flex items-center justify-center text-danger"
                              >
                                <PinIcon className="rotate-45" size={14} />
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                    {contextMessageId === message.id && (
                      <div
                        className="context-menu absolute z-10 bg-default-100 border border-default-200 rounded-lg p-2 flex flex-col gap-1"
                        style={{ ...modalPosition, right: "2rem" }}
                      >
                        <Button
                          aria-label={t("chat.reply")}
                          className="text-xs justify-start"
                          color="primary"
                          role="button"
                          size="sm"
                          tabIndex={0}
                          variant="light"
                          onKeyDown={(e) =>
                            handleContextKeyDown(
                              e,
                              message.id,
                              message.text,
                              message.userName,
                              "reply",
                            )
                          }
                          onPress={() => {
                            startReplying(
                              message.id,
                              message.text,
                              message.userName,
                            );
                            setContextMessageId(null);
                          }}
                        >
                          {t("chat.reply")}
                        </Button>
                        {isOwnMessage && canEditOrDelete(message.createdAt) && (
                          <>
                            <Button
                              aria-label={t("chat.edit_message")}
                              className="text-xs justify-start"
                              color="primary"
                              role="button"
                              size="sm"
                              tabIndex={0}
                              variant="light"
                              onKeyDown={(e) =>
                                handleContextKeyDown(
                                  e,
                                  message.id,
                                  message.text,
                                  message.userName,
                                  "edit",
                                )
                              }
                              onPress={() => {
                                startEditing(message.id, message.text);
                                setContextMessageId(null);
                              }}
                            >
                              {t("chat.edit_message")}
                            </Button>
                            <Button
                              aria-label={t("chat.delete_message")}
                              className="text-xs justify-start"
                              color="danger"
                              role="button"
                              size="sm"
                              tabIndex={0}
                              variant="light"
                              onKeyDown={(e) =>
                                handleContextKeyDown(
                                  e,
                                  message.id,
                                  message.text,
                                  message.userName,
                                  "delete",
                                )
                              }
                              onPress={() => {
                                handleDeleteMessage(message.id);
                                setContextMessageId(null);
                              }}
                            >
                              {t("chat.delete_message")}
                            </Button>
                          </>
                        )}
                        {isAdmin && isUserAdmin && (
                          <Button
                            aria-label={
                              message.pinned ? t("chat.unpin") : t("chat.pin")
                            }
                            className="text-xs justify-start"
                            color="danger"
                            role="button"
                            size="sm"
                            tabIndex={0}
                            variant="light"
                            onKeyDown={(e) =>
                              handleContextKeyDown(
                                e,
                                message.id,
                                message.text,
                                message.userName,
                                "pin",
                              )
                            }
                            onPress={() => {
                              handlePinMessage(message.id, !message.pinned);
                              setContextMessageId(null);
                            }}
                          >
                            {message.pinned ? t("chat.unpin") : t("chat.pin")}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </CardBody>
        </ScrollShadow>
        <div className="p-2 border-2 border-default-200 text-sm">
          {replyMessage && (
            <div className="mb-2 p-2 bg-default-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-semibold text-primary">
                  {t("chat.replying_to")} {replyMessage.userName}
                </span>
                <p className="text-xs text-neutral-300 truncate">
                  {replyMessage.text}
                </p>
              </div>
              <Button
                isIconOnly
                aria-label={t("chat.cancel_reply")}
                color="danger"
                size="sm"
                variant="light"
                onPress={cancelReplying}
              >
                <CancelIcon size={16} />
              </Button>
            </div>
          )}
          <div className="flex gap-1 w-full">
            <Input
              aria-label={t("chat.send_message")}
              placeholder={t("chat.send_message")}
              value={newMessage}
              variant="bordered"
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              isIconOnly
              aria-label={t("chat.send")}
              className="text-sm"
              color="primary"
              onPress={handleSendMessage}
            >
              <SendIcon size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default GlobalChat;
