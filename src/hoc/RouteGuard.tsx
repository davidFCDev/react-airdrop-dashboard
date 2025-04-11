import { Navigate } from "react-router-dom";

import { useUserAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

export const RouteGuard = ({ children, requiredRole }: Props) => {
  const { user, role, loading } = useUserAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div
      className={`transition-opacity duration-300 ${
        loading ? "opacity-0" : "opacity-100"
      }`}
    >
      {children}
    </div>
  );
};
