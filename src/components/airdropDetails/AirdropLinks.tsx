import { Link } from "@heroui/link";
import { useTranslation } from "react-i18next";

import { Airdrop } from "@/types";

interface AirdropLinksProps {
  airdrop: Airdrop;
}

const AirdropLinks = ({ airdrop }: AirdropLinksProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-default-50 border border-default-200 p-6 w-full">
      <h2 className="text-xl font-semibold mb-2">
        {t("airdrop.important_links")}
      </h2>
      <ul className="list-disc pl-5">
        {airdrop.important_links.map((link, index) => (
          <li key={index}>
            <span className="font-medium">{link.key}: </span>
            <Link isExternal color="primary" href={link.value}>
              {link.value}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AirdropLinks;
