import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Post } from "@/service/post.service";

interface Props {
  post: Post;
}

const PostCard = ({ post }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card
      className="w-full max-w-[600px] bg-default-100 flex flex-row"
      shadow="sm"
    >
      <Image
        alt={post.title}
        className="w-[150px] h-[100px] object-cover"
        src={post.image}
      />
      <div className="flex flex-col flex-grow">
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-bold">{post.title}</h3>
          <p className="text-sm text-default-500">{post.subtitle}</p>
        </CardHeader>
        <CardBody className="py-2">
          <p className="text-sm line-clamp-2">{post.description}</p>
        </CardBody>
        <CardFooter className="justify-end">
          <Button
            color="primary"
            size="sm"
            variant="flat"
            onPress={() => navigate(`/posts/${post.id}`)}
          >
            {t("post.read_more")}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default PostCard;
