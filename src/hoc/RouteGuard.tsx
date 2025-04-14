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
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate replace to="/unauthorized" />;
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
