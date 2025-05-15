import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link as HeroUILink } from "@heroui/link";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { prices } from "@/constants";

const HelpContent: FC = () => {
  const { t } = useTranslation();

  const formatSaveText = (percent?: number) => {
    if (!percent) return "";

    return t("help.subscriptions.save").replace(
      "{percent}",
      percent.toString(),
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 px-4">
      {/* Sobre Airdrops */}
      <Card
        className="bg-default-50 border border-default-200"
        radius="none"
        shadow="none"
      >
        <CardHeader>
          <h3 className="text-xl font-bold text-neutral-100">
            {t("help.airdrops.title")}
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-neutral-300 text-base">
            {t("help.airdrops.description")}
          </p>
        </CardBody>
      </Card>

      {/* Contacto y Cuenta */}
      <Card
        className="bg-default-50 border border-default-200"
        radius="none"
        shadow="none"
      >
        <CardHeader>
          <h3 className="text-xl font-bold text-neutral-100">
            {t("help.contact.title")}
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-neutral-300 text-base">
            {t("help.contact.description")}
          </p>
          <Button
            isExternal
            as={HeroUILink}
            className="mt-4"
            color="primary"
            href="https://t.me/your_telegram_link"
          >
            {t("help.contact.button")}
          </Button>
        </CardBody>
      </Card>

      {/* Suscripciones */}
      <Card
        className="bg-default-50 border border-default-200"
        radius="none"
        shadow="none"
      >
        <CardHeader>
          <h3 className="text-xl font-bold text-neutral-100">
            {t("help.subscriptions.title")}
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-neutral-300 text-base">
            {t("help.subscriptions.description")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {prices.map((plan) => (
              <Card
                key={plan.type || plan.id}
                className={`bg-default-100 border ${
                  plan.save ? "border-primary" : "border-default-200"
                } min-w-[200px]`}
                radius="none"
                shadow="none"
              >
                <CardBody className="flex flex-col items-center text-center p-4">
                  <h4 className="text-lg font-semibold text-neutral-100">
                    {t(`home.prices.${plan.type || plan.id}`)}
                  </h4>
                  <p className="text-neutral-100 text-lg font-bold mt-2">
                    ${plan.total_price.toFixed(2)}
                  </p>
                  {plan.price && (
                    <p className="text-neutral-300 text-sm mt-1">
                      {plan.price}
                    </p>
                  )}
                  {plan.save && (
                    <p className="text-success text-sm font-medium mt-1">
                      {formatSaveText(plan.save)}
                    </p>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Preguntas Frecuentes */}
      <Card
        className="bg-default-50 border border-default-200"
        radius="none"
        shadow="none"
      >
        <CardHeader>
          <h3 className="text-xl font-bold text-neutral-100">
            {t("home.faq.title")}
          </h3>
        </CardHeader>
        <CardBody>
          <ul className="list-none pl-0 mt-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <li key={i}>
                <p className="text-neutral-100 text-lg font-semibold">
                  {t(`home.faq.q${i + 1}`)}
                </p>
                <p className="text-neutral-300 text-base mt-1">
                  {t(`home.faq.a${i + 1}`)}
                </p>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      {/* Comunidad y Recursos */}
      <Card
        className="bg-default-50 border border-default-200"
        radius="none"
        shadow="none"
      >
        <CardHeader>
          <h3 className="text-xl font-bold text-neutral-100">
            {t("help.community.title")}
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-neutral-300 text-base">
            {t("help.community.description")}
          </p>
          <div className="flex gap-4 mt-4">
            <Button
              isExternal
              as={HeroUILink}
              className="mt-4"
              color="primary"
              href="https://t.me/your_telegram_community"
            >
              {t("help.community.telegram")}
            </Button>
            <Button
              isExternal
              as={HeroUILink}
              className="mt-4"
              color="primary"
              href="https://discord.gg/your_discord"
            >
              {t("help.community.discord")}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Feedback */}
      <Card
        className="bg-default-50 border border-default-200"
        radius="none"
        shadow="none"
      >
        <CardHeader>
          <h3 className="text-xl font-bold text-neutral-100">
            {t("help.feedback.title")}
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-neutral-300 text-base">
            {t("help.feedback.description")}
          </p>
          <Button
            isExternal
            as={HeroUILink}
            className="mt-4"
            color="primary"
            href="mailto:support@yourdomain.com"
          >
            {t("help.feedback.button")}
          </Button>
        </CardBody>
      </Card>

      {/* Términos y Privacidad */}
      <Card
        className="bg-default-50 border border-default-200"
        radius="none"
        shadow="none"
      >
        <CardHeader>
          <h3 className="text-xl font-bold text-neutral-100">
            {t("help.terms.title")}
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-neutral-300 text-base">
            {t("help.terms.description")}
          </p>
          <div className="flex gap-4 mt-4">
            <Button
              as={HeroUILink}
              className="mt-4"
              color="primary"
              href="/terms"
            >
              {t("help.terms.terms")}
            </Button>
            <Button
              as={HeroUILink}
              className="mt-4"
              color="primary"
              href="/privacy"
            >
              {t("help.terms.privacy")}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default HelpContent;
