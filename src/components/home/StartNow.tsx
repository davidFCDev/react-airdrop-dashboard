import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { useTranslation } from "react-i18next";

import { siteConfig } from "@/config/site";

const StartNow = () => {
  const { t } = useTranslation();

  return (
    <section className="flex items-center px-1 py-4 xs:px-2 xs:py-4 sm:px-2 sm:py-8 md:px-4 md:py-16 ml-2 xs:ml-2 sm:ml-4 md:ml-10 lg:ml-20">
      <div className="flex flex-col items-start justify-center gap-4 sm:flex-row">
        <h3 className="text-3xl xs:text-3xl sm:text-4xl md:text-5xl font-light">
          {t("home.subtitle")}
        </h3>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:mt-0">
          <Link
            isExternal
            href={siteConfig.links.telegram}
            title="Telegram Channel"
          >
            <Button
              className="w-full font-semibold sm:ml-6 sm:w-auto"
              color="default"
              radius="lg"
              size="lg"
              variant="ghost"
            >
              {t("home.contact")}
            </Button>
          </Link>
          <Link
            className="w-full sm:ml-2 sm:w-auto"
            href="/login"
            title="Login"
          >
            <Button
              className="w-full font-semibold text-white sm:w-auto"
              color="primary"
              radius="lg"
              size="lg"
              variant="solid"
            >
              {t("home.login")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StartNow;
