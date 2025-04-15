import { useCallback, useState } from "react";

import { useImageUpload } from "./useImageUpload";

import { Airdrop } from "@/constants/airdrop.table";
import { airdropService } from "@/service/airdrop.service";

interface Props {
  onSubmit: () => void;
}

interface Task {
  en: string;
  es: string;
}

interface ImageUpload {
  file: File | null;
  preview: string | null;
}

export const useAirdropForm = ({ onSubmit }: Props) => {
  const [formData, setFormData] = useState<Omit<Airdrop, "id">>({
    name: "",
    type: "Play-to-Earn",
    description: { en: "", es: "" },
    status: "Confirmed",
    tier: "S",
    funding: "",
    cost: "FREE",
    stage: "Testnet",
    chain: "",
    tags: [],
    url: "",
    discord: "",
    twitter: "",
    telegram: "",
    backdrop: "",
    image: "",
    created_at: new Date().toISOString(),
    last_edited: new Date().toISOString(),
    important_links: [],
    user: { daily_tasks: [], general_tasks: [], notes: [] },
  });

  const [dailyTask, setDailyTask] = useState<Task>({ en: "", es: "" });
  const [generalTask, setGeneralTask] = useState<Task>({ en: "", es: "" });
  const [backdrop, setBackdrop] = useState<ImageUpload>({
    file: null,
    preview: null,
  });
  const [image, setImage] = useState<ImageUpload>({
    file: null,
    preview: null,
  });
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Nuevo estado para important_links
  const [importantLinkInput, setImportantLinkInput] = useState<{
    key: string;
    value: string;
  }>({ key: "", value: "" });

  const { uploadFileToS3, uploading, setUploading } = useImageUpload();

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;

      if (name.startsWith("description_")) {
        const lang = name.split("_")[1] as "en" | "es";

        setFormData((prev) => ({
          ...prev,
          description: { ...prev.description, [lang]: value },
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    },
    [],
  );

  const handleTaskChange = useCallback(
    (type: "daily" | "general", lang: "en" | "es", value: string) => {
      const setTask = type === "daily" ? setDailyTask : setGeneralTask;

      setTask((prev) => ({ ...prev, [lang]: value }));
    },
    [],
  );

  const handleAddTask = useCallback(
    (type: "daily" | "general") => {
      const task = type === "daily" ? dailyTask : generalTask;

      if (task.en.trim() && task.es.trim()) {
        setFormData((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            [type === "daily" ? "daily_tasks" : "general_tasks"]: [
              ...prev.user[type === "daily" ? "daily_tasks" : "general_tasks"],
              { en: task.en.trim(), es: task.es.trim() },
            ],
          },
        }));
        type === "daily"
          ? setDailyTask({ en: "", es: "" })
          : setGeneralTask({ en: "", es: "" });
      }
    },
    [dailyTask, generalTask],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: "backdrop" | "image") => {
      const file = e.target.files?.[0];

      if (file) {
        const preview = URL.createObjectURL(file);

        type === "backdrop"
          ? setBackdrop({ file, preview })
          : setImage({ file, preview });
      }
    },
    [],
  );

  const handleTagChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTagInput(e.target.value);
    },
    [],
  );

  const handleAddTag = useCallback(() => {
    const trimmedTag = tagInput.trim();

    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setTagInput("");
    }
  }, [tagInput, formData.tags]);

  const handleTagKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag],
  );

  const handleRemoveTag = useCallback((tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  // Nuevas funciones para important_links
  const handleImportantLinkChange = useCallback(
    (field: "key" | "value", value: string) => {
      setImportantLinkInput((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleAddImportantLink = useCallback(() => {
    const trimmedKey = importantLinkInput.key.trim();
    const trimmedValue = importantLinkInput.value.trim();

    if (trimmedKey && trimmedValue) {
      setFormData((prev) => ({
        ...prev,
        important_links: [
          ...prev.important_links,
          { key: trimmedKey, value: trimmedValue },
        ],
      }));
      setImportantLinkInput({ key: "", value: "" });
    }
  }, [importantLinkInput]);

  const handleRemoveImportantLink = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      important_links: prev.important_links.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setUploading(true);
      try {
        let updatedFormData = { ...formData };

        if (backdrop.file) {
          updatedFormData.backdrop = await uploadFileToS3(
            backdrop.file,
            "backdrop",
          );
        }
        if (image.file) {
          updatedFormData.image = await uploadFileToS3(image.file, "image");
        }
        await airdropService.createAirdrop(updatedFormData);
        onSubmit();
      } catch {
        setError("Error al crear el airdrop");
      } finally {
        setUploading(false);
      }
    },
    [
      formData,
      backdrop.file,
      image.file,
      uploadFileToS3,
      onSubmit,
      setUploading,
    ],
  );

  return {
    formData,
    dailyTask,
    generalTask,
    backdrop,
    image,
    tagInput,
    error,
    uploading,
    handleChange,
    handleTaskChange,
    handleAddTask,
    handleFileChange,
    handleTagChange,
    handleAddTag,
    handleTagKeyPress,
    handleRemoveTag,
    importantLinkInput, // Nuevo
    handleImportantLinkChange, // Nuevo
    handleAddImportantLink, // Nuevo
    handleRemoveImportantLink, // Nuevo
    handleSubmit,
  };
};
