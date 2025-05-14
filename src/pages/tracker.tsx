import { useTranslation } from "react-i18next";

import Investment from "@/components/Investment";
import DefaultLayout from "@/layouts/default";

const TrackerPage = () => {
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center py-4">
          <h2 className="text-6xl text-neutral-100 font-bold">
            <span className="text-primary">{t("tracker.t")}</span>
            {t("tracker.title")}
          </h2>
          <p className="text-neutral-300 text-lg mt-2">
            {t("tracker.subtitle")}
          </p>
        </div>
        <div className="w-full mt-4">
          <Investment />
        </div>
      </section>
    </DefaultLayout>
  );
};

export default TrackerPage;
