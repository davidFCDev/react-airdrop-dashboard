/* eslint-disable no-console */
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Progress } from "@heroui/progress";
import { addToast } from "@heroui/toast";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { EditIcon } from "../icons";

import AvatarModal from "./AvatarModal";

import {
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
} from "@/constants";
import { useUserAuth } from "@/context/AuthContext";
import { useUserSummaryData } from "@/hooks/useUserSummaryData";
import { auth, db } from "@/lib/firebase";

const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
];

const UserSummary = () => {
  const { t } = useTranslation();
  const { user } = useUserAuth();
  const {
    userData,
    totalAirdrops,
    totalFavorites,
    totalInvested,
    totalReceived,
    totalProfit,
    dailyProgress,
    generalProgress,
  } = useUserSummaryData(user?.uid);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState("");

  const handleAvatarChange = async (avatar: string) => {
    if (!user?.uid || !auth.currentUser) {
      addToast({
        title: t("user.auth_error"),
        color: "danger",
      });

      return;
    }
    try {
      await setDoc(doc(db, "users", user.uid), { avatar }, { merge: true });
      setIsAvatarModalOpen(false);
      addToast({
        title: t("user.avatar_updated"),
        color: "success",
      });
    } catch (error: any) {
      console.error("Error updating avatar:", error);
      if (error.code === "permission-denied") {
        addToast({
          title: t("user.permission_denied"),
          color: "danger",
        });
      } else {
        addToast({
          title: t("user.avatar_error"),
          color: "danger",
        });
      }
    }
  };

  const handleNicknameSubmit = async () => {
    if (!user?.uid || !auth.currentUser || !newNickname.trim()) {
      addToast({
        title: t("user.auth_error"),
        color: "danger",
      });

      return;
    }
    try {
      // Verificar si el nickname ya existe
      const q = query(
        collection(db, "users"),
        where("nickname", "==", newNickname.trim()),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        addToast({
          title: t("user.nickname_taken"),
          color: "danger",
        });

        return;
      }

      // Depuración: Registrar la operación
      if (process.env.NODE_ENV === "development") {
        console.log("UserSummary: Attempting to set nickname:", {
          uid: user.uid,
          nickname: newNickname.trim(),
          firebaseAuth: !!auth.currentUser,
        });
      }

      // Asignar el nickname
      await setDoc(
        doc(db, "users", user.uid),
        {
          nickname: newNickname.trim(),
        },
        { merge: true },
      );
      setIsNicknameModalOpen(false);
      setNewNickname("");
      addToast({
        title: t("user.nickname_updated"),
        color: "success",
      });
    } catch (error: any) {
      console.error("Error updating nickname:", error);
      if (error.code === "permission-denied") {
        addToast({
          title: t("user.permission_denied"),
          color: "danger",
        });
      } else if (error.code === "failed-precondition") {
        addToast({
          title: t("user.nickname_error"),
          color: "danger",
        });
      } else {
        addToast({
          title: t("user.nickname_error"),
          color: "danger",
        });
      }
    }
  };

  return (
    <Card
      className="w-full max-w-full md:max-w-72 min-h-full bg-default-50 p-0 flex flex-col border border-default-300"
      radius="none"
    >
      <CardBody className="flex flex-col gap-2 p-0 flex-grow">
        {/* Bloque 1: Avatar, Nickname, Correo */}
        <div className="flex flex-col items-center gap-4 px-4 py-8 border-b border-default-200">
          <div className="relative">
            <Image
              alt={t("user.avatar")}
              className="w-40 h-40 border-2 border-black"
              src={userData.avatar || avatars[0]}
            />
            <Button
              isIconOnly
              aria-label={t("user.change_avatar")}
              className="absolute bottom-0 right-0 z-20"
              size="sm"
              variant="light"
              onPress={() => setIsAvatarModalOpen(true)}
            >
              <EditIcon className="text-black" size={20} />
            </Button>
          </div>
          <div className="flex flex-col items-center">
            {userData.nickname ? (
              <h3 className="text-2xl text-primary font-bold">
                {userData.nickname}
              </h3>
            ) : (
              <Button
                aria-label={t("user.create_nickname")}
                color="primary"
                variant="light"
                onPress={() => setIsNicknameModalOpen(true)}
              >
                {t("user.create_nickname")}
              </Button>
            )}
            <h2 className="text-sm font-light text-neutral-200">
              {user?.email || t("user.guest")}
            </h2>
          </div>
        </div>

        {/* Bloque 2: Invested, Received, Profit/Loss */}
        <div className="flex flex-col gap-2 p-4 border-b border-default-200">
          <div className="flex justify-between items-center">
            <p className="font-semibold">{t("tracker.invested")}</p>
            <p className="text-danger">-{totalInvested.toFixed(2)}$</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-semibold">{t("tracker.received")}</p>
            <p className="text-success">{totalReceived.toFixed(2)}$</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-semibold">{t("tracker.profit")}</p>
            <p className={totalProfit >= 0 ? "text-success" : "text-danger"}>
              {totalProfit.toFixed(2)}$
            </p>
          </div>
        </div>

        {/* Bloque 3: Live Airdrops, Tracked Airdrops */}
        <div className="flex flex-col gap-2 p-4 border-b border-default-200">
          <div className="flex justify-between items-center">
            <p className="font-semibold">{t("user.total_airdrops")}</p>
            <p className="text-success">{totalAirdrops}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-semibold">{t("user.tracked_airdrops")}</p>
            <p className="text-success">{totalFavorites}</p>
          </div>
        </div>

        {/* Bloque 4: Daily Tasks, General Tasks */}
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">{t("user.daily_tasks")}</p>
            <div className="flex items-center gap-2">
              <Progress
                aria-label={t("user.daily_tasks_progress")}
                className="flex-grow"
                color="success"
                formatOptions={{ style: "percent" }}
                size="sm"
                value={dailyProgress}
              />
              <p className="text-xs text-default-500">{`${dailyProgress}%`}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold">{t("user.general_tasks")}</p>
            <div className="flex items-center gap-2">
              <Progress
                aria-label={t("user.general_tasks_progress")}
                className="flex-grow"
                color="success"
                formatOptions={{ style: "percent" }}
                size="sm"
                value={generalProgress}
              />
              <p className="text-xs text-default-500">{`${generalProgress}%`}</p>
            </div>
          </div>
        </div>
      </CardBody>

      {/* Modal para cambiar avatar */}
      <AvatarModal
        avatars={avatars}
        handleAvatarChange={handleAvatarChange}
        isAvatarModalOpen={isAvatarModalOpen}
        setIsAvatarModalOpen={setIsAvatarModalOpen}
      />

      {/* Modal para establecer nickname */}
      <Modal isOpen={isNicknameModalOpen} onOpenChange={setIsNicknameModalOpen}>
        <ModalContent>
          <ModalHeader>{t("user.set_nickname")}</ModalHeader>
          <ModalBody>
            <Input
              aria-label={t("user.nickname")}
              label={t("user.nickname")}
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsNicknameModalOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              color="primary"
              disabled={!newNickname.trim()}
              onPress={handleNicknameSubmit}
            >
              {t("common.save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default UserSummary;
