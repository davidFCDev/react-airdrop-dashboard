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

  if (loading) return <div>{t("favorites.loading")}</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      {favorites.length === 0 ? (
        <p>{t("airdrop.no_favorites")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {favorites.map((airdrop) => (
            <AirdropCard key={airdrop.id} {...airdrop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteAirdrops;
