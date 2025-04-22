import axios from "axios";
import { useCallback, useState } from "react";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFileToS3 = useCallback(
    async (file: File, imageType: "backdrop" | "image"): Promise<string> => {
      const functionUrl =
        "https://us-central1-react-airdrop-dashboard.cloudfunctions.net/uploadImageToS3";
      const maxSize = 2048; // Aumentado de 1024 a 2048 para mejor calidad
      const quality = 0.9; // Calidad para JPEG (0.0 a 1.0)
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      return new Promise((resolve, reject) => {
        img.onload = () => {
          let { width, height } = img;

          // Solo redimensionar si la imagen es más grande que maxSize
          if (width > maxSize || height > maxSize) {
            const scale = Math.min(maxSize / width, maxSize / height);

            width = width * scale;
            height = height * scale;
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          // Usar calidad alta para JPEG, sin compresión para PNG
          const mimeType =
            file.type === "image/jpeg" ? "image/jpeg" : file.type;
          const base64Data = canvas
            .toDataURL(
              mimeType,
              mimeType === "image/jpeg" ? quality : undefined,
            )
            .replace(/^data:image\/\w+;base64,/, "");

          setUploading(true);
          axios
            .post(functionUrl, {
              imageData: `data:image/${file.type.split("/")[1]};base64,${base64Data}`,
              fileName: file.name,
              imageType,
            })
            .then((response) => {
              setUploading(false);
              resolve(response.data.url);
            })
            .catch(() => {
              setUploading(false);
              setError("Error al subir la imagen");
              reject(new Error("Error al subir la imagen"));
            });
        };
        img.onerror = () => {
          setError("Error al procesar la imagen");
          reject(new Error("Error al procesar la imagen"));
        };
        img.src = URL.createObjectURL(file);
      });
    },
    [],
  );

  return { uploadFileToS3, uploading, setUploading, error, setError };
};
