/* eslint-disable no-console */
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import { useFavoriteAirdropSummaries } from "@/hooks/useFavoriteAirdropSummaries";
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

interface UserSummaryData {
  userAirdropData: Map<string, UserAirdropData>;
  userData: UserData;
  favoriteAirdrops: Array<{ id: string }>;
  totalAirdrops: number;
  totalFavorites: number;
  totalInvested: number;
  totalReceived: number;
  totalProfit: number;
  dailyProgress: number;
  generalProgress: number;
}

export const useUserSummaryData = (
  userId: string | undefined,
): UserSummaryData => {
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

  useEffect(() => {
    if (!userId) {
      if (process.env.NODE_ENV === "development") {
        console.log("useUserSummaryData: No user ID provided");
      }

      return;
    }

    // Fetch airdrop data
    const favoriteAirdropIds = airdrops
      .filter((airdrop) => favorites.has(airdrop.id))
      .map((airdrop) => airdrop.id);
    const unsubscribeAirdrops = favoriteAirdropIds.map((airdropId) => {
      const userAirdropRef = doc(
        db,
        "user_airdrops",
        userId,
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

    // Fetch user data
    const userRef = doc(db, "users", userId);
    const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      } else {
        console.warn(
          `useUserSummaryData: Document users/${userId} does not exist`,
        );
      }
    });

    return () => {
      unsubscribeAirdrops.forEach((unsub) => unsub());
      unsubscribeUser();
    };
  }, [userId, airdrops, favorites]);

  const favoriteAirdrops = airdrops.filter((airdrop) =>
    favorites.has(airdrop.id),
  );
  const totalAirdrops = airdrops.length;
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

  return {
    userAirdropData,
    userData,
    favoriteAirdrops,
    totalAirdrops,
    totalFavorites,
    totalInvested,
    totalReceived,
    totalProfit,
    dailyProgress,
    generalProgress,
  };
};
