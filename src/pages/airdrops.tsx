import { useTranslation } from "react-i18next";

import AirdropTable from "@/components/AirdropTable";
import DefaultLayout from "@/layouts/default";

export default function AirdropsPage() {
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-start justify-start p-4">
        <h2 className="text-3xl font-bold">{t("airdrop.title")}</h2>
        <div className="w-full mt-4">
          <AirdropTable />
        </div>
      </section>
    </DefaultLayout>
  );
}
