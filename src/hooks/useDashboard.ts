import { useMemo } from "react";

import { useAirdropStore } from "@/store/airdropStore";

interface AirdropSummary {
  totalDailyTasks: number;
  completedDailyTasks: number;
  totalGeneralTasks: number;
  completedGeneralTasks: number;
  totalTasks: number;
  completedTasks: number;
}

export const useFavoriteAirdropSummaries = (): AirdropSummary => {
  const { airdrops, favorites, userAirdropData } = useAirdropStore();

  return useMemo(() => {
    const favoriteAirdrops = airdrops.filter((airdrop) =>
      favorites.has(airdrop.id),
    );

    return favoriteAirdrops.reduce(
      (acc, airdrop) => {
        const data = userAirdropData.get(airdrop.id);

        if (!data) return acc;

        const totalDailyTasks = airdrop.user.daily_tasks.length;
        const completedDailyTasks = data.daily_tasks.filter(
          (t) => t.completed,
        ).length;
        const totalGeneralTasks = airdrop.user.general_tasks.length;
        const completedGeneralTasks = data.general_tasks.filter(
          (t) => t.completed,
        ).length;

        return {
          totalDailyTasks: acc.totalDailyTasks + totalDailyTasks,
          completedDailyTasks: acc.completedDailyTasks + completedDailyTasks,
          totalGeneralTasks: acc.totalGeneralTasks + totalGeneralTasks,
          completedGeneralTasks:
            acc.completedGeneralTasks + completedGeneralTasks,
          totalTasks: acc.totalTasks + totalDailyTasks + totalGeneralTasks,
          completedTasks:
            acc.completedTasks + completedDailyTasks + completedGeneralTasks,
        };
      },
      {
        totalDailyTasks: 0,
        completedDailyTasks: 0,
        totalGeneralTasks: 0,
        completedGeneralTasks: 0,
        totalTasks: 0,
        completedTasks: 0,
      },
    );
  }, [airdrops, favorites, userAirdropData]);
};
