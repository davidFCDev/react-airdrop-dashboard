import { siteConfig } from "@/config/site";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link as HeroUILink } from "@heroui/link";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const TermsPrivacyContent: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 px-4">
      {/* Términos de Servicio */}
      <Card
        className="bg-default-50 border border-default-200"
        radius="none"
        shadow="none"
      >
        <CardHeader>
          <h3 className="text-xl font-bold text-neutral-100">
            {t("terms_privacy.terms.title")}
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-neutral-300 text-base">
            {t("terms_privacy.terms.description")}
          </p>
          <ul className="list-none pl-0 mt-4 space-y-4">
            <li>
              <p className="text-neutral-100 text-lg font-semibold">
                {t("terms_privacy.terms.acceptance.title")}
              </p>
              <p className="text-neutral-300 text-base mt-1">
                {t("terms_privacy.terms.acceptance.description")}
              </p>
            </li>
            <li>
              <p className="text-neutral-100 text-lg font-semibold">
                {t("terms_privacy.terms.use.title")}
              </p>
              <p className="text-neutral-300 text-base mt-1">
                {t("terms_privacy.terms.use.description")}
              </p>
            </li>
            <li>
              <p className="text-neutral-100 text-lg font-semibold">
                {t("terms_privacy.terms.liability.title")}
              </p>
              <p className="text-neutral-300 text-base mt-1">
                {t("terms_privacy.terms.liability.description")}
              </p>
            </li>
          </ul>
        </CardBody>
      </Card>

      {/* Política de Privacidad */}
      <Card
        className="bg-default-50 border border-default-200"
        radius="none"
        shadow="none"
      >
        <CardHeader>
          <h3 className="text-xl font-bold text-neutral-100">
            {t("terms_privacy.privacy.title")}
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-neutral-300 text-base">
            {t("terms_privacy.privacy.description")}
          </p>
          <ul className="list-none pl-0 mt-4 space-y-4">
            <li>
              <p className="text-neutral-100 text-lg font-semibold">
                {t("terms_privacy.privacy.data_collection.title")}
              </p>
              <p className="text-neutral-300 text-base mt-1">
                {t("terms_privacy.privacy.data_collection.description")}
              </p>
            </li>
            <li>
              <p className="text-neutral-100 text-lg font-semibold">
                {t("terms_privacy.privacy.data_use.title")}
              </p>
              <p className="text-neutral-300 text-base mt-1">
                {t("terms_privacy.privacy.data_use.description")}
              </p>
            </li>
            <li>
              <p className="text-neutral-100 text-lg font-semibold">
                {t("terms_privacy.privacy.user_rights.title")}
              </p>
              <p className="text-neutral-300 text-base mt-1">
                {t("terms_privacy.privacy.user_rights.description")}
              </p>
            </li>
          </ul>
        </CardBody>
      </Card>

      {/* Contacto */}
      <Card
        className="bg-default-50 border border-default-200"
        radius="none"
        shadow="none"
      >
        <CardHeader>
          <h3 className="text-xl font-bold text-neutral-100">
            {t("terms_privacy.contact.title")}
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-neutral-300 text-base">
            {t("terms_privacy.contact.description")}
          </p>
          <Button
            isExternal
            as={HeroUILink}
            className="mt-4"
            color="primary"
            href={siteConfig.links.telegram}
          >
            {t("help.feedback.button")}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default TermsPrivacyContent;
