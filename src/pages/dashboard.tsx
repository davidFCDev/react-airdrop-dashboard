import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import DashboardTitle from "@/components/dashboard/DashboardTitle";
import GlobalChat from "@/components/dashboard/GlobalChat";
import LatestAirdrops from "@/components/dashboard/LatestAirdrops";
import News from "@/components/dashboard/News";
import UserSummary from "@/components/dashboard/UserSummary";
import { AnnounceIcon, ChatIcon, NewIcon } from "@/components/icons";
import { useUserAuth } from "@/context/AuthContext";
import DefaultLayout from "@/layouts/default";
import { useAirdropStore } from "@/store/airdropStore";
import { usePostStore } from "@/store/postStore";

const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useUserAuth();
  const { airdrops, fetchAirdrops, fetchFavorites } = useAirdropStore();
  const { posts, fetchPosts } = usePostStore();

  useEffect(() => {
    const unsubscribeAirdrops = fetchAirdrops();
    const unsubscribePosts = fetchPosts();
    let unsubscribeFavorites: (() => void) | undefined;

    if (user?.uid) {
      unsubscribeFavorites = fetchFavorites(user.uid);
    }

    return () => {
      unsubscribeAirdrops();
      unsubscribePosts();
      if (unsubscribeFavorites) unsubscribeFavorites();
    };
  }, [user, fetchAirdrops, fetchFavorites, fetchPosts]);

  const latestAirdrops = airdrops
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 6); // Mantener 6 airdrops

  const latestPosts = posts
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 10); // Limitar a 10 posts

  return (
    <DefaultLayout>
      <section className="flex flex-col md:flex-row min-h-screen p-4 gap-4 bg-default-100 overflow-hidden">
        <UserSummary />
        <div className="w-full flex flex-col gap-4 bg-default-100">
          <div className="flex flex-col md:flex-row h-full gap-4">
            <div className="w-full md:w-1/2">
              <DashboardTitle
                icon={AnnounceIcon}
                text={t("dashboard.important_news")}
              />
              <News latestPosts={latestPosts} />
            </div>
            <div className="w-full md:w-1/2 min-h-[28rem]">
              <DashboardTitle icon={ChatIcon} text={t("dashboard.chat")} />
              <GlobalChat />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold p-4 bg-default-50 border border-default-300 flex items-center">
              <NewIcon className="inline-block mr-2 text-primary" size={32} />
              {t("dashboard.latest_airdrops")}
            </h2>

            <LatestAirdrops latestAirdrops={latestAirdrops} />
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default DashboardPage;
