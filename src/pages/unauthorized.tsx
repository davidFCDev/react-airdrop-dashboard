import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import DefaultLayout from "@/layouts/default";

export default function UnauthorizedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Card className="max-w-md w-full bg-default-50" shadow="md">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center w-full">
              {t("unauthorized.title")}
            </h2>
          </CardHeader>
          <CardBody className="flex flex-col items-center gap-4">
            <p className="text-center text-default-600">
              {t("unauthorized.message")}
            </p>
            <Button
              color="primary"
              variant="solid"
              onPress={() => navigate("/")}
            >
              {t("unauthorized.back_to_airdrops")}
            </Button>
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  );
}
