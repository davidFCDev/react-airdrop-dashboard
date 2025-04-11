import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
        toast.success(t("auth.login_success"));
      } else {
        await authService.register(email, password);
        toast.success(t("auth.register_success"));
      }
      navigate("/");
    } catch (error: any) {
      const errorCode = error.code || "unknown";
      const message = t(`auth.errors.${errorCode}`, {
        defaultValue: t("auth.errors.generic"),
      });

      setErrorMessage(message);
      toast.error(message);
    }
  };

  return { handleAuth, errorMessage };
}
