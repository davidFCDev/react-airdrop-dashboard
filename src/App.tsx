import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import AirdropDetailsPage from "./pages/airdropDetails";
import CreatePage from "./pages/create";
import DashboardPage from "./pages/dashboard";
import FavoritesPage from "./pages/favorites";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import RegisterPage from "./pages/register";

import { RouteGuard } from "@/hoc/RouteGuard";
import AirdropsPage from "@/pages/airdrops";
import HelpFeedbackPage from "@/pages/help";
import IndexPage from "@/pages/index";

function App() {
  return (
    <>
      <Toaster richColors position="bottom-right" />
      <Routes>
        {/* Rutas públicas (sin autenticación) */}
        <Route element={<IndexPage />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
        <Route element={<HelpFeedbackPage />} path="/help-feedback" />
        {/* Rutas protegidas para usuarios autenticados */}
        <Route
          element={
            <RouteGuard>
              <DashboardPage />
            </RouteGuard>
          }
          path="/dashboard"
        />
        <Route
          element={
            <RouteGuard>
              <AirdropsPage />
            </RouteGuard>
          }
          path="/airdrops"
        />
        <Route
          element={
            <RouteGuard>
              <AirdropDetailsPage />
            </RouteGuard>
          }
          path="/airdrops/:id"
        />
        <Route
          element={
            <RouteGuard>
              <FavoritesPage />
            </RouteGuard>
          }
          path="/favorites"
        />
        <Route
          element={
            <RouteGuard>
              <ProfilePage />
            </RouteGuard>
          }
          path="/profile"
        />
        {/* Ruta protegida solo para admin */}
        <Route
          element={
            <RouteGuard requiredRole="admin">
              <CreatePage />
            </RouteGuard>
          }
          path="/create"
        />
      </Routes>
    </>
  );
}

export default App;
