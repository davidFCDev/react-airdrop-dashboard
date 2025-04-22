import { Spinner } from "@heroui/spinner";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import AirdropCard from "./AirdropCard";

import { Airdrop } from "@/constants/airdrop.table";
import { airdropService } from "@/service/airdrop.service";

const FavoriteAirdrops = () => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await airdropService.getFavoriteAirdrops();

        setFavorites(data);
      } catch {
        setError(t("favorites.error_favorites"));
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [t]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="mx-auto" size="lg" />
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      {favorites.length === 0 ? (
        <p className="font-light">{t("favorites.no_favorites")}</p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          {favorites.map((airdrop) => (
            <AirdropCard key={airdrop.id} airdrop={airdrop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteAirdrops;
