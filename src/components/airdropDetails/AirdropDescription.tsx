import { useTranslation } from "react-i18next";

import { Airdrop } from "@/constants/airdrop.table";

interface Props {
  airdrop: Airdrop;
}

const AirdropDescription = ({ airdrop }: Props) => {
  const { i18n } = useTranslation();
  const description =
    i18n.language === "es" ? airdrop.description.es : airdrop.description.en;

  return <p className="text-lg p-6 bg-default-100 rounded-lg">{description}</p>;
};

export default AirdropDescription;
