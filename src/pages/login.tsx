import { useTranslation } from "react-i18next";

import AuthForm from "@/components/AuthForm";
import { useUser } from "@/hooks/useUser";
import DefaultLayout from "@/layouts/default";

export default function RegisterPage() {
  const { handleAuth, errorMessage } = useUser("login");
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <section className="section">
        <div className="inline-block max-w-lg text-center justify-center">
          <AuthForm
            errorMessage={errorMessage}
            linkHref="/register"
            linkText={t("login.link_text")}
            subtitle={t("login.subtitle")}
            title={t("login.title")}
            onSubmit={handleAuth}
          />
        </div>
      </section>
    </DefaultLayout>
  );
}
