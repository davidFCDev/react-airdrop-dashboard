import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useUserAuth } from "@/context/AuthContext";
import { useImageUpload } from "@/hooks/useImageUpload";
import DefaultLayout from "@/layouts/default";
import { postService } from "@/service/post.service";

interface Link {
  key: string;
  value: string;
}

const CreatePostPage = () => {
  const { t } = useTranslation();
  const { role } = useUserAuth();
  const navigate = useNavigate();
  const { uploadFileToS3, uploading, error: uploadError } = useImageUpload();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
  });
  const [image, setImage] = useState<{
    file: File | null;
    preview: string | null;
  }>({
    file: null,
    preview: null,
  });
  const [links, setLinks] = useState<Link[]>([]);
  const [linkInput, setLinkInput] = useState<Link>({ key: "", value: "" });
  const [error, setError] = useState<string | null>(null);

  if (role !== "admin") {
    navigate("/unauthorized");

    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleLinkChange = (field: "key" | "value", value: string) => {
    setLinkInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddLink = () => {
    if (linkInput.key.trim() && linkInput.value.trim()) {
      setLinks((prev) => [
        ...prev,
        { key: linkInput.key.trim(), value: linkInput.value.trim() },
      ]);
      setLinkInput({ key: "", value: "" });
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.subtitle ||
      !formData.description ||
      !image.file
    ) {
      setError(t("post.fill_all_fields"));

      return;
    }

    try {
      setError(null);
      const imageUrl = await uploadFileToS3(image.file, "image");

      await postService.createPost({
        image: imageUrl,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        links,
      });
      navigate("/dashboard");
    } catch {
      setError(t("post.create_error"));
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <h1 className="text-2xl font-bold">{t("post.create_title")}</h1>
          </CardHeader>
          <CardBody>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                isRequired
                label={t("post.title")}
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              <Input
                isRequired
                label={t("post.subtitle")}
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
              />
              <Textarea
                isRequired
                label={t("post.description")}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">{t("post.image")}</label>
                <input
                  accept="image/*"
                  className="border rounded p-2"
                  type="file"
                  onChange={handleFileChange}
                />
                {image.preview && (
                  <img
                    alt="Preview"
                    className="w-32 h-32 object-cover mt-2"
                    src={image.preview}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">{t("post.links")}</label>
                <div className="flex gap-2">
                  <Input
                    placeholder={t("post.link_key")}
                    value={linkInput.key}
                    onChange={(e) => handleLinkChange("key", e.target.value)}
                  />
                  <Input
                    placeholder={t("post.link_value")}
                    value={linkInput.value}
                    onChange={(e) => handleLinkChange("value", e.target.value)}
                  />
                  <Button
                    isDisabled={!linkInput.key || !linkInput.value}
                    onPress={handleAddLink}
                  >
                    {t("post.add_link")}
                  </Button>
                </div>
                {links.map((link, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span>{`${link.key}: ${link.value}`}</span>
                    <Button
                      color="danger"
                      size="sm"
                      onPress={() => handleRemoveLink(index)}
                    >
                      {t("post.remove_link")}
                    </Button>
                  </div>
                ))}
              </div>
              {error && <p className="text-red-500">{error}</p>}
              {uploadError && <p className="text-red-500">{uploadError}</p>}
              <Button color="primary" isLoading={uploading} type="submit">
                {t("post.create_button")}
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  );
};

export default CreatePostPage;
