import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { useTranslation } from "react-i18next";

import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-10 py-8 md:py-24">
        <div className="inline-block text-center justify-center">
          <h1 className="text-[5rem] font-bold leading-none">
            {t("home.title_part_1")}&nbsp;
            <span className="text-primary">{t("home.title_part_2")}&nbsp;</span>
            <br />
            {t("home.title_part_3")}
          </h1>
        </div>

        <h4 className="text-neutral-300 uppercase font-light">
          {t("home.subtitle")}
        </h4>

        <div className="flex gap-3">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "solid",
            })}
            href={"/register"}
          >
            {t("home.register")}
          </Link>
          <Link
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={"/login"}
          >
            {t("home.login")}
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}
