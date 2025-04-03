import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { button as buttonStyles } from "@heroui/theme";
import { useTranslation } from "react-i18next"; // Importamos el hook para traducciones

import { GithubIcon } from "@/components/icons";
import { subtitle, title } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const { t } = useTranslation(); // Usamos el hook de traducciones

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          {/* Titulo dividido en 3 partes */}
          <span className={title()}>{t("greetingStart")}</span>{" "}
          {/* Primera parte del título */}
          <span className={title({ color: "violet" })}>
            {t("greetingHighlight")}
          </span>{" "}
          {/* Segunda parte del título con color */}
          <br />
          <span className={title()}>{t("greetingEnd")}</span>{" "}
          {/* Última parte del título */}
          <div className={subtitle({ class: "mt-4" })}>
            {t("description")} {/* Descripción */}
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.docs}
          >
            {t("docs")} {/* Traducción para el link de documentación */}
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            {t("github")} {/* Traducción para el link de GitHub */}
          </Link>
        </div>

        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              {t("snippet")} {/* Traducción para el snippet */}
            </span>
          </Snippet>
        </div>
      </section>
    </DefaultLayout>
  );
}
