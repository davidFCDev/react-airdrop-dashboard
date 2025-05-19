import { addToast } from "@heroui/toast";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { authService } from "@/service/auth.service";

export function useUser(action: "login" | "register") {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setErrorMessage(null);

    try {
      if (action === "login") {
        await authService.login(email, password);
        addToast({
          title: t("auth.login_success"),
          color: "success",
        });
      } else {
        await authService.register(email, password);
        addToast({
          title: t("auth.register_success"),
          color: "success",
        });
      }
      navigate("/");
    } catch (error: any) {
      const errorCode = error.code || "unknown";
      const message = t(`auth.errors.${errorCode}`, {
        defaultValue: t("auth.errors.generic"),
      });

      setErrorMessage(message);
      addToast({
        title: message,
        color: "danger",
      });
    }
  };

  return { handleAuth, errorMessage };
}
