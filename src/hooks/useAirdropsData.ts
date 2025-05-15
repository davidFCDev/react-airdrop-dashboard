import { useEffect, useMemo, useState } from "react";

import { useUserAuth } from "@/context/AuthContext";
import { useAirdropStore } from "@/store/airdropStore";
import { Airdrop } from "@/types";

interface FavoriteAirdropsData {
  favoriteAirdrops: Airdrop[];
  loading: boolean;
  error: string | null;
}

export const useFavoriteAirdropsData = (): FavoriteAirdropsData => {
  const { user } = useUserAuth();
  const {
    airdrops,
    favorites,
    userAirdropData,
    loading: storeLoading,
    error: storeError,
  } = useAirdropStore();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || storeLoading) {
      setLocalLoading(true);

      return;
    }

    // Verificar si los datos necesarios están disponibles
    const hasData = airdrops.length > 0 && favorites.size > 0;

    setLocalLoading(!hasData);
  }, [user, airdrops, favorites, storeLoading]);

  // Filtrar airdrops favoritos con tareas pendientes
  const favoriteAirdrops = useMemo(() => {
    return airdrops.filter((airdrop) => {
      if (!favorites.has(airdrop.id)) return false;
      const data = userAirdropData.get(airdrop.id);

      return (
        data &&
        (data.daily_tasks.some((task) => !task.completed) ||
          data.general_tasks.some((task) => !task.completed))
      );
    });
  }, [airdrops, favorites, userAirdropData]);

  return {
    favoriteAirdrops,
    loading: localLoading || storeLoading,
    error: storeError,
  };
};
