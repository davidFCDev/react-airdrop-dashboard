import { useTranslation } from "react-i18next";

import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/hooks/useUser";
import DefaultLayout from "@/layouts/default";

export default function RegisterPage() {
  const { handleAuth, errorMessage } = useAuth("register");
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <section className="section">
        <div className="inline-block max-w-lg text-center justify-center">
          <AuthForm
            errorMessage={errorMessage}
            linkHref="/register"
            linkText={t("login.linkText")}
            subtitle={t("login.subtitle")}
            title={t("login.title")}
            onSubmit={handleAuth}
          />
        </div>
      </section>
    </DefaultLayout>
  );
}
