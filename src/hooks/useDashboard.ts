import { useMemo } from "react";

import { useAirdropStore } from "@/store/airdropStore";

interface AirdropSummary {
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

        const totalTasks =
          airdrop.user.daily_tasks.length + airdrop.user.general_tasks.length;
        const completedTasks =
          data.daily_tasks.filter((t) => t.completed).length +
          data.general_tasks.filter((t) => t.completed).length;

        return {
          totalTasks: acc.totalTasks + totalTasks,
          completedTasks: acc.completedTasks + completedTasks,
        };
      },
      { totalTasks: 0, completedTasks: 0 },
    );
  }, [airdrops, favorites, userAirdropData]);
};
