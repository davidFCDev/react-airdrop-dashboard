import { Spinner } from "@heroui/spinner";
import { Navigate } from "react-router-dom";

import { useUserAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

export const RouteGuard = ({ children, requiredRole }: Props) => {
  const { user, role, loading } = useUserAuth();

  if (loading) {
    return (
      <Spinner
        classNames={{ label: "text-foreground mt-4" }}
        color="primary"
        label="Cargando..."
        size="lg"
        variant="gradient"
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si se requiere un rol y el usuario no tiene ese rol, lo redirigimos a la página de "no autorizado".
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};
