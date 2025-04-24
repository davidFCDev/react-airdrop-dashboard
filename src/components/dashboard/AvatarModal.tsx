import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { t } from "i18next";

interface AvatarModalProps {
  isAvatarModalOpen: boolean;
  setIsAvatarModalOpen: (isOpen: boolean) => void;
  avatars: string[];
  handleAvatarChange: (avatar: string) => void;
}

const AvatarModal = ({
  isAvatarModalOpen,
  setIsAvatarModalOpen,
  avatars,
  handleAvatarChange,
}: AvatarModalProps) => {
  return (
    <Modal
      className="bg-default-100"
      isOpen={isAvatarModalOpen}
      size="xl"
      onOpenChange={setIsAvatarModalOpen}
    >
      <ModalContent>
        <ModalHeader>{t("user.select_avatar")}</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-4 gap-2">
            {avatars.map((avatar, index) => (
              <Button
                key={index}
                aria-label={`${t("user.avatar")} ${index + 1}`}
                className="flex justify-center items-center w-32 h-32 overflow-hidden p-0 hover:scale-105 transition-transform duration-200 ease-in-out"
                variant="light"
                onPress={() => handleAvatarChange(avatar)}
              >
                <Image
                  alt={`${t("user.avatar")} ${index + 1}`}
                  className="w-48 object-contain"
                  src={avatar}
                />
              </Button>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={() => setIsAvatarModalOpen(false)}
          >
            {t("common.cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AvatarModal;
