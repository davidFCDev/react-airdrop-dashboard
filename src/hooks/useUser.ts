import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { authService } from "@/service/auth.service";

export function useAuth(action: "login" | "register") {
  const router = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setErrorMessage(null);

    const result =
      action === "login"
        ? await authService.login(email, password)
        : await authService.register(email, password);

    if (typeof result === "string") {
      setErrorMessage(result);
    } else {
      toast.success(
        action === "login" ? "Login successful" : "Registration successful",
      );
      setTimeout(() => router("/"), 100);
    }
  };

  return { handleAuth, errorMessage };
}
