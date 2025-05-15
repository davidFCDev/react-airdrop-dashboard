import { useEffect, useMemo, useState } from "react";

import { useUserAuth } from "@/context/AuthContext";
import { useAirdropStore } from "@/store/airdropStore";

interface AirdropData {
  id: string;
  name: string;
  invested: number;
  received: number;
}

interface InvestmentData {
  favoriteAirdrops: AirdropData[];
  totalProfit: number;
  totalInvested: number;
  hasInvestments: boolean;
  profitImage: string;
  loading: boolean;
  error: string | null;
}

export const useInvestmentData = (): InvestmentData => {
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

    const favoriteAirdropIds = airdrops
      .filter((airdrop) => favorites.has(airdrop.id))
      .map((airdrop) => airdrop.id);

    // Verificar si todos los favoriteAirdropIds tienen datos
    const allDataLoaded =
      favoriteAirdropIds.length === 0 ||
      favoriteAirdropIds.every((id) => userAirdropData.has(id));

    setLocalLoading(!allDataLoaded);

    // Timeout de respaldo
    const timeout = setTimeout(() => setLocalLoading(false), 5000);

    return () => clearTimeout(timeout);
  }, [user, airdrops, favorites, userAirdropData, storeLoading]);

  // Calcular favoriteAirdrops con invested y received
  const favoriteAirdrops = useMemo(() => {
    return airdrops
      .filter((airdrop) => favorites.has(airdrop.id))
      .map((airdrop) => {
        const data = userAirdropData.get(airdrop.id);
        const invested =
          data && typeof data.invested === "number" && !isNaN(data.invested)
            ? data.invested
            : 0;
        const received =
          data && typeof data.received === "number" && !isNaN(data.received)
            ? data.received
            : 0;

        return {
          id: airdrop.id,
          name: airdrop.name,
          invested,
          received,
        };
      });
  }, [airdrops, favorites, userAirdropData]);

  const totalProfit = useMemo(() => {
    const profit = favoriteAirdrops.reduce((sum, airdrop) => {
      return sum + (airdrop.received - airdrop.invested);
    }, 0);

    return isNaN(profit) ? 0 : profit;
  }, [favoriteAirdrops]);

  const totalInvested = useMemo(() => {
    const invested = favoriteAirdrops.reduce((sum, airdrop) => {
      return sum + airdrop.invested;
    }, 0);

    return isNaN(invested) ? 0 : invested;
  }, [favoriteAirdrops]);

  // Verificar si hay airdrops con inversión
  const hasInvestments = useMemo(() => {
    return favoriteAirdrops.some((airdrop) => airdrop.invested > 0);
  }, [favoriteAirdrops]);

  // Determinar la imagen según totalProfit y totalInvested
  const profitImage = useMemo(() => {
    if (totalProfit < 0) return "/images/bad.png";
    if (totalProfit <= 2 * totalInvested) return "/images/decent.png";

    return "/images/good.png";
  }, [totalProfit, totalInvested]);

  return {
    favoriteAirdrops,
    totalProfit,
    totalInvested,
    hasInvestments,
    profitImage,
    loading: localLoading || storeLoading,
    error: storeError,
  };
};
