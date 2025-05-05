import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { useTranslation } from "react-i18next";

import { siteConfig } from "@/config/site";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <section className="h-[90vh] p-4 bg-default-50">
        <div className="inline-block text-left justify-center">
          <h1 className="text-[16rem] font-semibold leading-none tracking-tighter">
            {t("home.title_part_1")}&nbsp;
            <br />
            <span className="text-primary">{t("home.title_part_2")}&nbsp;</span>
            <br />
            {t("home.title_part_3")}
          </h1>
        </div>
      </section>

      <section className="flex items-center px-4 py-16 bg-default-50 ml-20">
        <div className="flex items-start justify-center">
          <h3 className="text-5xl font-light">{t("home.subtitle")}</h3>
          <Link
            isExternal
            href={siteConfig.links.telegram}
            title="Telegram Channel"
          >
            <Button
              className="ml-6 font-semibold"
              color="default"
              radius="lg"
              size="lg"
              variant="ghost"
            >
              {t("home.contact")}
            </Button>
          </Link>
          <Link className="ml-2" href="/login" title="GitHub">
            <Button
              className="text-default-50 font-semibold"
              color="primary"
              radius="lg"
              size="lg"
              variant="solid"
            >
              {t("home.login")}
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-secondary-500 text-secondary-100 flex flex-col items-center justify-center p-20">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start justify-center leading-none">
            <h2 className="text-4xl font-bold">Token coverage</h2>
            <p className="text-[8rem] font-bold">10%</p>
          </div>
          <div className="flex flex-col items-start justify-center leading-none">
            <h2 className="text-4xl font-bold">Total volume</h2>
            <p className="text-[8rem] font-bold">$7bn+</p>
          </div>
          <div className="flex flex-col items-start justify-center leading-none">
            <h2 className="text-4xl font-bold">Liquidity sources</h2>
            <p className="text-[8rem] font-bold">15</p>
          </div>
          <div className="flex flex-col items-start justify-center leading-none">
            <h2 className="text-4xl font-bold">Networks</h2>
            <p className="text-[8rem] font-bold">20+</p>
          </div>
        </div>
      </section>

      <section className="bg-secondary-50 text-left px-4 ">
        <h4 className="text-[14rem] font-bold leading-none">
          Search.
          <br />
          <span className="text-secondary-500">Rebalance.</span>
          <br />
          <span className="text-secondary-200">Dump.</span>
        </h4>
      </section>
    </DefaultLayout>
  );
}
