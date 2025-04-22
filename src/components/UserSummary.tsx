import { Avatar } from "@heroui/avatar";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { image_avatar } from "@/constants";
import { useUserAuth } from "@/context/AuthContext";
import { useFavoriteAirdropSummaries } from "@/hooks/useDashboard";
import { db } from "@/lib/firebase";
import { useAirdropStore } from "@/store/airdropStore";

interface UserAirdropData {
  invested: number;
  received: number;
}

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

  useEffect(() => {
    if (!user?.uid) return;

    const favoriteAirdropIds = airdrops
      .filter((airdrop) => favorites.has(airdrop.id))
      .map((airdrop) => airdrop.id);
    const unsubscribe = favoriteAirdropIds.map((airdropId) => {
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

    return () => unsubscribe.forEach((unsub) => unsub());
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

  return (
    <Card className="w-full h-full bg-default-100 p-1" radius="none">
      <CardHeader className="flex flex-col items-center w-full">
        <div className="flex flex-col items-center gap-4 border border-default-200 bg-default-50 px-4 py-16 w-full">
          <Avatar
            isBordered
            aria-label={t("user.avatar")}
            className="cursor-pointer"
            color="primary"
            name={user?.email?.charAt(0).toUpperCase() || "?"}
            radius="md"
            size="lg"
            src={image_avatar || user?.photoURL || undefined}
          />
          <h2 className="text-base font-bold">
            {user?.email || t("user.guest")}
          </h2>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-2">
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
          <div className="border border-default-200 bg-default-50 p-4 flex flex-col gap-2 ">
            <p className="font-semibold">{t("user.daily_tasks")}</p>
            <div className="flex items-center gap-2">
              <Progress
                aria-label={t("user.daily_tasks_progress")}
                className="mt-2 flex-grow"
                color="success"
                formatOptions={{ style: "percent" }}
                value={dailyProgress}
              />
              <p className="text-sm text-default-500">{`${dailyProgress}%`}</p>
            </div>
            <p className="text-sm text-default-500 mt-1">{`${completedDailyTasks} / ${totalDailyTasks}`}</p>
          </div>
          <div className="border border-default-200 bg-default-50 p-4 flex flex-col gap-2">
            <p className="font-semibold">{t("user.general_tasks")}</p>
            <div className="flex items-center gap-2">
              <Progress
                aria-label={t("user.general_tasks_progress")}
                className="mt-2 flex-grow"
                color="success"
                formatOptions={{ style: "percent" }}
                value={generalProgress}
              />
              <p className="text-sm text-default-500">{`${generalProgress}%`}</p>
            </div>
            <p className="text-sm text-default-500 mt-1">{`${completedGeneralTasks} / ${totalGeneralTasks}`}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default UserSummary;
