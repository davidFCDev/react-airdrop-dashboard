import axios from "axios";
import { useCallback, useState } from "react";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFileToS3 = useCallback(
    async (file: File, imageType: "backdrop" | "image"): Promise<string> => {
      const functionUrl =
        "https://us-central1-react-airdrop-dashboard.cloudfunctions.net/uploadImageToS3";
      const maxSize = 1024;
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      return new Promise((resolve, reject) => {
        img.onload = () => {
          let { width, height } = img;

          if (width > maxSize) {
            height = (maxSize / width) * height;
            width = maxSize;
          }
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          const base64Data = canvas
            .toDataURL(file.type)
            .replace(/^data:image\/\w+;base64,/, "");

          axios
            .post(functionUrl, {
              imageData: `data:image/${file.type.split("/")[1]};base64,${base64Data}`,
              fileName: file.name,
              imageType,
            })
            .then((response) => resolve(response.data.url))
            .catch(() => reject(new Error("Error al subir la imagen")));
        };
        img.onerror = () => reject(new Error("Error al procesar la imagen"));
        img.src = URL.createObjectURL(file);
      });
    },
    [],
  );

  return { uploadFileToS3, uploading, setUploading, error, setError };
};
