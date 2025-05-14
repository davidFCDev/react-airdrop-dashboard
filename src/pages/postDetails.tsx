import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { useUserAuth } from "@/context/AuthContext";
import DefaultLayout from "@/layouts/default";
import { db } from "@/lib/firebase";
import { postService } from "@/service/post.service";
import { Post } from "@/types";

const PostDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { role } = useUserAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!id || !window.confirm(t("post.confirm_delete"))) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "posts", id));
      navigate("/dashboard");
    } catch {
      setError(t("post.delete_error"));
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center py-12 min-h-screen">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </section>
      </DefaultLayout>
    );
  }

  if (error || !post) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-start justify-start py-12 min-h-screen">
          <h1 className="text-2xl font-bold">{error || t("post.not_found")}</h1>
        </section>
      </DefaultLayout>
    );
  }

  const title = i18n.language === "es" ? post.title.es : post.title.en;
  const subtitle = i18n.language === "es" ? post.subtitle.es : post.subtitle.en;
  const description =
    i18n.language === "es" ? post.description.es : post.description.en;

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center py-12">
        <Card
          className="w-full max-w-3xl bg-default-50 p-4 border border-default-200"
          radius="none"
          shadow="none"
        >
          <CardHeader>
            <h1 className="text-4xl font-bold">{title}</h1>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Image
              alt={title}
              className="w-full h-64 object-cover"
              src={post.image}
            />
            <h2 className="text-xl font-semibold text-primary">{subtitle}</h2>
            <p className="text-neutral-300">{description}</p>
            {post.links.length > 0 && (
              <div className="flex flex-col gap-2 underline text-primary">
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
            <div className="flex items-center gap-2">
              <p className="text-sm text-default-500">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
              {role === "admin" && (
                <div className="flex gap-2">
                  <Button
                    color="primary"
                    size="sm"
                    onPress={() => navigate(`/edit-post/${post.id}`)}
                  >
                    {t("post.edit")}
                  </Button>
                  <Button
                    color="danger"
                    isLoading={isDeleting}
                    size="sm"
                    onPress={handleDelete}
                  >
                    {t("post.delete")}
                  </Button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  );
};

export default PostDetailsPage;
