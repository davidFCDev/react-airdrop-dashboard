import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import AirdropCard from "./AirdropCard";

import { useUserAuth } from "@/context/AuthContext";
import { useAirdropStore } from "@/store/airdropStore";

const FavoriteAirdropsList = () => {
  const { t } = useTranslation();
  const { user } = useUserAuth();
  const {
    airdrops,
    favorites,
    loading: storeLoading,
    error: storeError,
  } = useAirdropStore();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || storeLoading) {
      setLocalLoading(true);

      return;
    }

    // Verificar si todos los favoritos tienen datos en airdrops
    const favoriteAirdropIds = Array.from(favorites);
    const allDataLoaded =
      favoriteAirdropIds.length === 0 ||
      favoriteAirdropIds.every((id) =>
        airdrops.some((airdrop) => airdrop.id === id),
      );

    setLocalLoading(!allDataLoaded);

    // Timeout de respaldo
    const timeout = setTimeout(() => setLocalLoading(false), 2000);

    return () => clearTimeout(timeout);
  }, [user, airdrops, favorites, storeLoading]);

  // Calcular favoriteAirdrops
  const favoriteAirdrops = useMemo(
    () => airdrops.filter((airdrop) => favorites.has(airdrop.id)),
    [airdrops, favorites],
  );

  // Manejo de errores
  if (storeError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 text-xl">
            {t("favorites.error")}: {storeError}
          </p>
          <Button
            className="mt-4"
            color="primary"
            onPress={() => window.location.reload()}
          >
            {t("favorites.retry")}
          </Button>
        </div>
      </div>
    );
  }

  // Mostrar spinner durante carga
  if (localLoading || storeLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="mx-auto" size="lg" />
      </div>
    );
  }

  // Renderizado principal
  return (
    <div className="flex items-center justify-center">
      {favoriteAirdrops.length === 0 ? (
        <div className="text-center text-neutral-100 text-xl font-light flex flex-col items-center gap-4">
          {t("favorites.no_favorites")}
          <Button as={Link} color="primary" to="/airdrops">
            {t("favorites.explore_airdrops")}
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          {favoriteAirdrops.map((airdrop) => (
            <AirdropCard key={airdrop.id} airdrop={airdrop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteAirdropsList;
