import { Code } from "@heroui/code";
import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { button as buttonStyles } from "@heroui/theme";
import { useTranslation } from "react-i18next";

import { GithubIcon } from "@/components/icons";
import { subtitle, title } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-2xl text-center justify-center">
          <span
            className={title({
              size: "xl",
            })}
          >
            {t("home.titlePart1")}&nbsp;
          </span>
          <span
            className={`${title({
              size: "xl",
            })} text-primary`}
          >
            {t("home.titlePart2")}&nbsp;
          </span>
          <br />
          <span
            className={title({
              size: "xl",
            })}
          >
            {t("home.titlePart3")}
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            {t("home.subtitle")}
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
            {t("home.buttonDocs")}
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            {t("home.buttonGitHub")}
          </Link>
        </div>

        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              {t("home.snippetText")}{" "}
              <Code color="primary">pages/index.tsx</Code>
            </span>
          </Snippet>
        </div>
      </section>
    </DefaultLayout>
  );
}
