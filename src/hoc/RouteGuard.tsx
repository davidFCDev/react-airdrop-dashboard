import { Spinner } from "@heroui/spinner";
import { Navigate } from "react-router-dom";

import { useUser } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

export const RouteGuard = ({ children, requiredRole }: Props) => {
  const { user, role, loading } = useUser();

  if (loading)
    return (
      <Spinner
        classNames={{ label: "text-foreground mt-4" }}
        color="primary"
        label="gradient"
        size="lg"
        variant="gradient"
      />
    );

  if (!user) return <Navigate to="/login" />;

  if (requiredRole && role !== requiredRole)
    return <Navigate to="/unauthorized" />;

  return <>{children}</>;
};
