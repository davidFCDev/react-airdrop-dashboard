import { ScrollShadow } from "@heroui/scroll-shadow";
import { useTranslation } from "react-i18next";

import PostCard from "../PostCard";

import { Post } from "@/types";

interface NewsProps {
  latestPosts: Array<Post>;
}

const News = ({ latestPosts }: NewsProps) => {
  const { t } = useTranslation();

  return (
    <ScrollShadow className="flex flex-col gap-4 py-4 h-[31rem] overflow-y-auto">
      {latestPosts.length === 0 ? (
        <p className="text-sm text-default-500">{t("dashboard.no_posts")}</p>
      ) : (
        latestPosts.map((post) => (
          <div key={post.id} className="w-full">
            <PostCard post={post} />
          </div>
        ))
      )}
    </ScrollShadow>
  );
};

export default News;
