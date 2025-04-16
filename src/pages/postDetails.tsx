import { Card, CardBody, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import DefaultLayout from "@/layouts/default";
import { Post, postService } from "@/service/post.service";

const PostDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError(t("post.invalid_id"));
        setLoading(false);

        return;
      }

      try {
        const postData = await postService.getPost(id);

        if (!postData) {
          setError(t("post.not_found"));
        } else {
          setPost(postData);
        }
      } catch {
        setError(t("post.error_fetching"));
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, t]);

  if (loading) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center p-10 min-h-screen">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </section>
      </DefaultLayout>
    );
  }

  if (error || !post) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-start justify-start p-10">
          <h1 className="text-2xl font-bold">{error || t("post.not_found")}</h1>
        </section>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <h1 className="text-3xl font-bold">{post.title}</h1>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Image
              alt={post.title}
              className="w-full h-64 object-cover"
              src={post.image}
            />
            <h2 className="text-xl font-semibold">{post.subtitle}</h2>
            <p className="text-default-600">{post.description}</p>
            {post.links.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">{t("post.links")}</h3>
                {post.links.map((link, index) => (
                  <Link
                    key={index}
                    isExternal
                    color="primary"
                    href={link.value}
                  >
                    {link.key}
                  </Link>
                ))}
              </div>
            )}
            <p className="text-sm text-default-500">
              {t("post.created_at")}:{" "}
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  );
};

export default PostDetailsPage;
