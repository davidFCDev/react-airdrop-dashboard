import { Alert } from "@heroui/alert";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { DeleteIcon, EditIcon, PinIcon } from "@/components/icons";
import { useChat } from "@/hooks/useChat";

const GlobalChat = () => {
  const { t } = useTranslation();
  const {
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

  return (
    <section className="flex flex-col gap-4 py-4 h-full">
      {error && (
        <Alert className="mb-4" color="danger">
          {error.message}
        </Alert>
      )}
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
          <CardBody className="flex flex-col gap-2">
            {messages.length === 0 ? (
              <p className="text-sm text-default-500">
                {t("chat.no_messages")}
              </p>
            ) : (
              messages.map((message) => {
                const isOwnMessage = user?.uid === message.userId;
                const isAdmin = message.role === "admin";

                return (
                  <div
                    key={message.id}
                    ref={(el) => {
                      if (el) messageRefs.current.set(message.id, el);
                    }}
                    className={`flex ${
                      isOwnMessage
                        ? "justify-start mr-auto"
                        : "justify-end ml-auto"
                    } items-start w-[80%] group`}
                    role="listitem"
                  >
                    <div
                      className={`relative flex ${
                        isOwnMessage ? "flex-row" : "flex-row-reverse"
                      } gap-2 p-2 rounded-lg border ${
                        isAdmin ? "border-danger" : "border-default-200"
                      } ${isOwnMessage ? "bg-default-50" : "bg-default-100"} w-full min-h-[4rem] overflow-x-hidden`}
                    >
                      <div className="self-start p-2">
                        <Avatar
                          isBordered
                          color="primary"
                          name={message.userName}
                          radius="lg"
                          size="lg"
                          src={message.avatar ?? undefined}
                        />
                      </div>
                      <div
                        className={`flex-1 ${isOwnMessage ? "text-left" : "text-right"}`}
                      >
                        <div
                          className={`flex items-center gap-2 ${
                            isOwnMessage ? "justify-start" : "justify-end"
                          }`}
                        >
                          {!isOwnMessage && isNewMessage(message.createdAt) && (
                            <span className="text-xs text-success">
                              {t("chat.new")}
                            </span>
                          )}
                          <span
                            className={`text-lg font-semibold ${
                              isAdmin
                                ? "text-danger"
                                : isOwnMessage
                                  ? "text-primary"
                                  : "text-white"
                            }`}
                          >
                            {message.userName}
                            {isAdmin && " (admin)"}
                          </span>
                        </div>
                        <span className="text-xs text-default-500 block">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                        {editingMessageId === message.id ? (
                          <div className="mt-2 flex gap-2">
                            <Input
                              aria-label={t("chat.edit_message")}
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                            />
                            <Button
                              color="primary"
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
                      {isAdmin && (
                        <Button
                          isIconOnly
                          aria-label={
                            message.pinned ? t("chat.unpin") : t("chat.pin")
                          }
                          className={`absolute top-1 right-1 flex items-center justify-center ${
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
