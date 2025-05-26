import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Post } from "@/types";

interface Props {
  post: Post;
}

const PostCard = ({ post }: Props) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const title = i18n.language === "es" ? post.title.es : post.title.en;
  const subtitle = i18n.language === "es" ? post.subtitle.es : post.subtitle.en;
  const isNew =
    new Date().getTime() - new Date(post.created_at).getTime() < 60 * 60 * 1000;

  return (
    <Card
      className="w-full bg-default-50 flex flex-col border border-default-200"
      radius="none"
      shadow="sm"
    >
      <img
        alt={title}
        className="w-full h-52 object-cover object-center"
        src={post.image}
      />
      <CardBody className="flex flex-row items-center justify-between gap-4 py-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{title}</h3>
            {isNew && (
              <Chip color="success" size="sm" variant="flat">
                {t("post.new")}
              </Chip>
            )}
          </div>
          <p className="text-sm text-neutral-400">{subtitle}</p>
        </div>
        <Button
          color="secondary"
          radius="none"
          size="sm"
          variant="light"
          onPress={() => navigate(`/posts/${post.id}`)}
        >
          {t("post.read_more")}
        </Button>
      </CardBody>
    </Card>
  );
};

export default PostCard;
