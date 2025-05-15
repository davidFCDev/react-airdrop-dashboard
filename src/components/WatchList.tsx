import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import AirdropCard from "./AirdropCard";

import { useFavoriteAirdropsData } from "@/hooks/useAirdropsData";

const WatchList = () => {
  const { t } = useTranslation();
  const { favoriteAirdrops, loading, error } = useFavoriteAirdropsData();

  // Manejo de errores
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 text-xl">
            {t("favorites.error")}: {error}
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
  if (loading) {
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
          {t("favorites.no_pending_tasks")}
          <Button as={Link} color="primary" to="/airdrops">
            {t("favorites.explore_airdrops")}
          </Button>
        </div>
      ) : (
        <div className="flex  gap-4 justify-center">
          {favoriteAirdrops.map((airdrop) => (
            <AirdropCard key={airdrop.id} airdrop={airdrop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchList;
