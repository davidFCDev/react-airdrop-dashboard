import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import AirdropDetailsPage from "./pages/airdropDetails";
import CreatePage from "./pages/create";
import CreatePostPage from "./pages/createPost";
import DashboardPage from "./pages/dashboard";
import EditPage from "./pages/edit";
import FavoritesPage from "./pages/favorites";
import LoginPage from "./pages/login";
import PostDetailsPage from "./pages/postDetails";
import ProfilePage from "./pages/profile";
import RegisterPage from "./pages/register";
import UnauthorizedPage from "./pages/unauthorized";

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
        <Route element={<UnauthorizedPage />} path="/unauthorized" />
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
              <PostDetailsPage />
            </RouteGuard>
          }
          path="/posts/:id"
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
        <Route
          element={
            <RouteGuard requiredRole="admin">
              <CreatePostPage />
            </RouteGuard>
          }
          path="/create-post"
        />
        <Route
          element={
            <RouteGuard requiredRole="admin">
              <EditPage />
            </RouteGuard>
          }
          path="/edit/:id"
        />
      </Routes>
    </>
  );
}

export default App;
