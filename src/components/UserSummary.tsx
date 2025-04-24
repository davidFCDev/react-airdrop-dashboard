import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
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
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import AvatarModal from "./dashboard/AvatarModal";
import { EditIcon } from "./icons";

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
import { useFavoriteAirdropSummaries } from "@/hooks/useDashboard";
import { db } from "@/lib/firebase";
import { useAirdropStore } from "@/store/airdropStore";

interface UserAirdropData {
  invested: number;
  received: number;
}

interface UserData {
  avatar?: string;
  nickname?: string;
}

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
  const { airdrops, favorites } = useAirdropStore();
  const {
    totalDailyTasks,
    completedDailyTasks,
    totalGeneralTasks,
    completedGeneralTasks,
  } = useFavoriteAirdropSummaries();
  const [userAirdropData, setUserAirdropData] = useState<
    Map<string, UserAirdropData>
  >(new Map());
  const [userData, setUserData] = useState<UserData>({});
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState("");

  useEffect(() => {
    if (!user?.uid) return;

    // Fetch airdrop data
    const favoriteAirdropIds = airdrops
      .filter((airdrop) => favorites.has(airdrop.id))
      .map((airdrop) => airdrop.id);
    const unsubscribeAirdrops = favoriteAirdropIds.map((airdropId) => {
      const userAirdropRef = doc(
        db,
        "user_airdrops",
        user.uid,
        "airdrops",
        airdropId,
      );

      return onSnapshot(userAirdropRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserAirdropData((prev) =>
            new Map(prev).set(airdropId, docSnap.data() as UserAirdropData),
          );
        }
      });
    });

    // Fetch user data (avatar, nickname)
    const userRef = doc(db, "users", user.uid);
    const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      }
    });

    return () => {
      unsubscribeAirdrops.forEach((unsub) => unsub());
      unsubscribeUser();
    };
  }, [user, airdrops, favorites]);

  const favoriteAirdrops = airdrops.filter((airdrop) =>
    favorites.has(airdrop.id),
  );
  const totalFavorites = favoriteAirdrops.length;
  const totalInvested = favoriteAirdrops.reduce((sum, airdrop) => {
    const data = userAirdropData.get(airdrop.id);

    return sum + (data?.invested || 0);
  }, 0);
  const totalReceived = favoriteAirdrops.reduce((sum, airdrop) => {
    const data = userAirdropData.get(airdrop.id);

    return sum + (data?.received || 0);
  }, 0);
  const totalProfit = totalReceived - totalInvested;

  const dailyProgress =
    totalDailyTasks > 0
      ? Math.round((completedDailyTasks / totalDailyTasks) * 100)
      : 0;
  const generalProgress =
    totalGeneralTasks > 0
      ? Math.round((completedGeneralTasks / totalGeneralTasks) * 100)
      : 0;

  const handleAvatarChange = async (avatar: string) => {
    if (!user?.uid) return;
    try {
      await updateDoc(doc(db, "users", user.uid), { avatar });
      setIsAvatarModalOpen(false);
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  const handleNicknameSubmit = async () => {
    if (!user?.uid || !newNickname.trim()) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        nickname: newNickname.trim(),
      });
      setIsNicknameModalOpen(false);
      setNewNickname("");
    } catch (error) {
      console.error("Error updating nickname:", error);
    }
  };

  return (
    <Card className="w-full h-full bg-default-100 p-0" radius="none">
      <CardHeader className="flex flex-col items-center w-full px-4 pb-4 pt-0">
        <div className="flex flex-col items-center gap-4 border border-default-200 bg-default-50 px-4 py-10 w-full">
          <div className="border-3 border-primary bg-default-50 rounded-2xl relative">
            <Image
              alt={t("user.avatar")}
              className="w-32 h-32 border-2 border-black"
              src={userData.avatar || avatars[0]}
            />
            <Button
              isIconOnly
              aria-label={t("user.change_avatar")}
              className="absolute bottom-0 right-0 z-20 "
              size="sm"
              variant="light"
              onPress={() => setIsAvatarModalOpen(true)}
            >
              <EditIcon className="text-black" size={20} />
            </Button>
          </div>
          <div className="flex flex-col items-center">
            {userData.nickname ? (
              <h3 className="text-xl font-bold">{userData.nickname}</h3>
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
            <h2 className="text-sm font-light text-default-600">
              {user?.email || t("user.guest")}
            </h2>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-2 py-0 px-4">
        <div className="flex flex-col gap-2 border border-default-200 bg-default-50 p-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Invested:</p>
            <p className="text-success">{totalInvested.toFixed(2)}$</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-semibold">Received:</p>
            <p className="text-success">{totalReceived.toFixed(2)}$</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-semibold">Profit:</p>
            <p className={totalProfit >= 0 ? "text-success" : "text-danger"}>
              {totalProfit.toFixed(2)}$
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 border border-default-200 bg-default-50 p-4">
          <p className="font-semibold">{t("user.started_airdrops")}:</p>
          <p className="text-success">{totalFavorites}</p>
        </div>
        <div className="flex flex-col gap-2 h-full">
          <div className="border border-default-200 bg-default-50 p-4 flex flex-col">
            <p className="font-semibold">{t("user.daily_tasks")}</p>
            <div className="flex items-center gap-2">
              <Progress
                aria-label={t("user.daily_tasks_progress")}
                className="mt-2 flex-grow"
                color="success"
                formatOptions={{ style: "percent" }}
                size="sm"
                value={dailyProgress}
              />
              <p className="text-xs text-default-500">{`${dailyProgress}%`}</p>
            </div>
            <p className="text-xs text-default-500 mt-1">{`${completedDailyTasks} / ${totalDailyTasks}`}</p>
          </div>
          <div className="border border-default-200 bg-default-50 p-4 flex flex-col">
            <p className="font-semibold">{t("user.general_tasks")}</p>
            <div className="flex items-center gap-2">
              <Progress
                aria-label={t("user.general_tasks_progress")}
                className="mt-2 flex-grow"
                color="success"
                formatOptions={{ style: "percent" }}
                size="sm"
                value={generalProgress}
              />
              <p className="text-xs text-default-500">{`${generalProgress}%`}</p>
            </div>
            <p className="text-xs text-default-500 mt-1">{`${completedGeneralTasks} / ${totalGeneralTasks}`}</p>
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
