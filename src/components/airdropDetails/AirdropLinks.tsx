import { Link } from "@heroui/link";
import { useTranslation } from "react-i18next";

import { Airdrop } from "@/types";

interface AirdropLinksProps {
  airdrop: Airdrop;
  isDrawer?: boolean;
}

const AirdropLinks = ({ airdrop, isDrawer = false }: AirdropLinksProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col ${isDrawer ? "" : "bg-default-50 border border-default-200 p-6"} w-full`}
    >
      <h2
        className={`font-semibold ${isDrawer ? "text-base mb-2" : "text-xl mb-2"}`}
      >
        {t("airdrop.important_links")}
      </h2>
      <ul className="list-disc pl-5">
        {airdrop.important_links.map((link, index) => (
          <li key={index} className={isDrawer ? "text-sm" : ""}>
            <span className={isDrawer ? "text-sm font-medium" : "font-medium"}>
              {link.key}:{" "}
            </span>
            <Link
              isExternal
              color="primary"
              href={link.value}
              size={isDrawer ? "sm" : "md"}
            >
              {link.value}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AirdropLinks;
