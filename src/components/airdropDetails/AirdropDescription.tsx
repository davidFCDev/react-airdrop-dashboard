import { useTranslation } from "react-i18next";

import { InfoIcon } from "../icons";

import { Airdrop } from "@/types";

interface Props {
  airdrop: Airdrop;
}

const AirdropDescription = ({ airdrop }: Props) => {
  const { t, i18n } = useTranslation();
  const description =
    i18n.language === "es" ? airdrop.description.es : airdrop.description.en;

  return (
    <div className="flex flex-col gap-4 bg-default-50 border border-default-200 p-6 w-full">
      <h3 className="text-xl font-semibold flex items-center gap-1">
        <InfoIcon className="inline-block mr-1 text-primary" />
        {t("airdrop.description")}
        <span className="text-primary font-semibold">{airdrop.name}</span> ?
      </h3>
      <p className="text-neutral-200">{description}</p>
    </div>
  );
};

export default AirdropDescription;
