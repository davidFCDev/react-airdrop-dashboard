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
            linkHref="/login"
            linkText={t("register.linkText")} // Traducción del texto del enlace
            subtitle={t("register.subtitle")} // Traducción del subtítulo
            title={t("register.title")}
            onSubmit={handleAuth}
          />
        </div>
      </section>
    </DefaultLayout>
  );
}
