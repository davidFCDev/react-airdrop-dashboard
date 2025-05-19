import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { useUserAuth } from "./context/AuthContext";
import AirdropDetailsPage from "./pages/airdropDetails";
import CreatePage from "./pages/create";
import CreatePostPage from "./pages/createPost";
import DashboardPage from "./pages/dashboard";
import EditPage from "./pages/edit";
import EditPostPage from "./pages/editPost";
import FavoritesPage from "./pages/favorites";
import LoginPage from "./pages/login";
import PostDetailsPage from "./pages/postDetails";
import ProfilePage from "./pages/profile";
import RegisterPage from "./pages/register";
import TermsPrivacyPage from "./pages/terms";
import TrackerPage from "./pages/tracker";
import UnauthorizedPage from "./pages/unauthorized";
import { useAirdropStore } from "./store/airdropStore";

import { RouteGuard } from "@/hoc/RouteGuard";
import AirdropsPage from "@/pages/airdrops";
import HelpFeedbackPage from "@/pages/help";
import IndexPage from "@/pages/index";

function App() {
  const { user } = useUserAuth();
  const { fetchAirdrops, fetchFavorites } = useAirdropStore();

  useEffect(() => {
    const unsubscribeAirdrops = fetchAirdrops();
    let unsubscribeFavorites: (() => void) | undefined;

    if (user?.uid) {
      unsubscribeFavorites = fetchFavorites(user.uid);
    }

    return () => {
      unsubscribeAirdrops();
      unsubscribeFavorites?.();
    };
  }, [user, fetchAirdrops, fetchFavorites]);

  return (
    <>
      <Routes>
        {/* Rutas públicas (sin autenticación) */}
        <Route element={<IndexPage />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
        <Route element={<HelpFeedbackPage />} path="/help-feedback" />
        <Route element={<UnauthorizedPage />} path="/unauthorized" />
        <Route element={<TermsPrivacyPage />} path="/terms" />
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
        <Route
          element={
            <RouteGuard>
              <TrackerPage />
            </RouteGuard>
          }
          path="/tracker"
        />
        {/* Rutas protegidas solo para admin */}
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
        <Route
          element={
            <RouteGuard requiredRole="admin">
              <EditPostPage />
            </RouteGuard>
          }
          path="/edit-post/:id"
        />
      </Routes>
    </>
  );
}

export default App;
