import { useTranslation } from "react-i18next";

import FavoriteAirdrops from "@/components/FavoritesList";
import DefaultLayout from "@/layouts/default";

export default function FavoritesPage() {
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-start justify-start p-4">
        <h2 className="text-3xl font-bold">{t("favorites.title")}</h2>
        <div className="w-full mt-4">
          <FavoriteAirdrops />
        </div>
      </section>
    </DefaultLayout>
  );
}
