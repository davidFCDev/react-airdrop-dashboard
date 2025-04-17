import { Divider } from "@heroui/divider";
import { useEffect } from "react";

import AirdropCard from "@/components/AirdropCard";
import PostCard from "@/components/PostCard";
import UserSummary from "@/components/UserSummary";
import { useUserAuth } from "@/context/AuthContext";
import DefaultLayout from "@/layouts/default";
import { useAirdropStore } from "@/store/airdropStore";
import { usePostStore } from "@/store/postStore";

const DashboardPage = () => {
  const { user } = useUserAuth();
  const { airdrops, fetchAirdrops, favorites, fetchFavorites } =
    useAirdropStore();
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
    .slice(0, 4);
  const latestPosts = posts
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 3);

  return (
    <DefaultLayout>
      <section className="flex flex-col md:flex-row  min-h-screen">
        {/* Columna 1: Resumen del usuario */}
        <div className="w-full md:w-1/6 border-r border-default-300">
          <UserSummary />
        </div>
        {/* Columna 2: Airdrops y Posts */}
        <div className="w-full md:w-5/6 flex flex-col gap-6">
          {/* Fila 1: Últimos Airdrops */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Latest Airdrops</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {latestAirdrops.map((airdrop) => (
                <AirdropCard key={airdrop.id} airdrop={airdrop} />
              ))}
            </div>
          </div>
          <Divider className="w-full" />
          {/* Fila 2: Últimos Posts */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Latest Posts</h2>
            <div className="flex flex-col gap-4">
              {latestPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default DashboardPage;
