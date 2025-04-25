import { useTranslation } from "react-i18next";

import AirdropTable from "@/components/AirdropTable";
import DefaultLayout from "@/layouts/default";

export default function AirdropsPage() {
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center py-4">
          <h2 className="text-4xl text-neutral-100 font-bold">
            {t("airdrop.title")}
          </h2>
          <p className="text-neutral-400 text-lg mt-2">
            {t("airdrop.subtitle")}
          </p>
        </div>
        <div className="w-full mt-4 px-00">
          <AirdropTable />
        </div>
      </section>
    </DefaultLayout>
  );
}
