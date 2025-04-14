import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import cors from "cors";
import * as functions from "firebase-functions";

// Inicializar el middleware CORS
const corsHandler = cors({
  origin: ["http://localhost:5173", "https://react-airdrop-dashboard.web.app"],
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
});

// Definir la interfaz para el cuerpo de la solicitud
interface UploadRequestBody {
  imageData: string; // Imagen en formato base64
  fileName: string; // Nombre del archivo (ej. "image.jpg")
  imageType: "backdrop" | "image"; // Tipo de imagen
}

// Función para subir imágenes a S3
export const uploadImageToS3 = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    // Log inicial para verificar que la función se ejecuta
    functions.logger.info("uploadImageToS3 invoked", { method: req.method });

    // Validar que la solicitud sea POST
    if (req.method !== "POST") {
      functions.logger.error(`Invalid method: ${req.method}`);
      res.status(405).json({ error: "Method not allowed" });

      return;
    }

    // Validar variables de entorno
    const awsRegion = process.env.AWS_REGION;
    const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const s3BucketName = process.env.S3_BUCKET_NAME;

    // Log para verificar las variables de entorno
    functions.logger.info("Environment variables", {
      awsRegion: !!awsRegion,
      awsAccessKeyId: !!awsAccessKeyId,
      awsSecretAccessKey: !!awsSecretAccessKey,
      s3BucketName: !!s3BucketName,
    });

    if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey || !s3BucketName) {
      const missingVars = [
        !awsRegion && "AWS_REGION",
        !awsAccessKeyId && "AWS_ACCESS_KEY_ID",
        !awsSecretAccessKey && "AWS_SECRET_ACCESS_KEY",
        !s3BucketName && "S3_BUCKET_NAME",
      ]
        .filter(Boolean)
        .join(", ");

      functions.logger.error(`Missing environment variables: ${missingVars}`);
      res
        .status(500)
        .json({ error: `Server configuration error: missing ${missingVars}` });

      return;
    }

    // Inicializar el cliente S3
    const s3Client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });

    // Extraer y validar el cuerpo de la solicitud
    const { imageData, fileName, imageType } = req.body as UploadRequestBody;

    if (!imageData || !fileName || !imageType) {
      functions.logger.error("Missing request body fields", {
        imageData: !!imageData,
        fileName: !!fileName,
        imageType: !!imageType,
      });
      res.status(400).json({
        error: "Missing required fields: imageData, fileName, imageType",
      });

      return;
    }

    try {
      // Validar formato base64
      if (!imageData.startsWith("data:image/")) {
        functions.logger.error("Invalid base64 format", {
          imageData: imageData.substring(0, 50),
        });
        res.status(400).json({ error: "Invalid base64 image format" });

        return;
      }

      // Decodificar la imagen base64
      const buffer = Buffer.from(
        imageData.replace(/^data:image\/\w+;base64,/, ""),
        "base64",
      );

      // Generar una clave única para S3
      const key = `airdrops/${imageType}/${Date.now()}-${fileName}`;

      // Configurar el comando para subir a S3
      const command = new PutObjectCommand({
        Bucket: s3BucketName,
        Key: key,
        Body: buffer,
        ContentType: `image/${fileName.split(".").pop()?.toLowerCase() || "jpeg"}`,
        ACL: "public-read", // Hacer la imagen pública
      });

      // Subir la imagen a S3
      functions.logger.info(`Uploading to S3: ${key}`);
      await s3Client.send(command);

      // Generar la URL pública
      const url = `https://${s3BucketName}.s3.${awsRegion}.amazonaws.com/${key}`;

      functions.logger.info(`Upload successful: ${url}`);

      // Responder con la URL
      res.status(200).json({ url });
    } catch (error) {
      functions.logger.error("Error uploading to S3:", error);
      res.status(500).json({ error: "Failed to upload image to S3" });
    }
  });
});
