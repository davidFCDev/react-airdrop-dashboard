import { Route, Routes } from "react-router-dom";

import CreatePage from "./pages/create";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";

import { RouteGuard } from "@/hoc/RouteGuard";
import AirdropsPage from "@/pages/airdrops";
import HelpFeedbackPage from "@/pages/help";
import IndexPage from "@/pages/index";
import InfoPage from "@/pages/info";

function App() {
  return (
    <Routes>
      {/* Rutas públicas (sin autenticación) */}
      <Route element={<IndexPage />} path="/" /> {/* Home siempre visible */}
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<HelpFeedbackPage />} path="/help-feedback" />
      {/* Rutas protegidas para usuarios autenticados */}
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
            <AirdropsPage />
          </RouteGuard>
        }
        path="/airdrops/:id"
      />
      <Route
        element={
          <RouteGuard>
            <InfoPage />
          </RouteGuard>
        }
        path="/info"
      />
      <Route
        element={
          <RouteGuard>
            <LoginPage />
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
  );
}

export default App;
