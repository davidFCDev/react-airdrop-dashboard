import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as functions from "firebase-functions";

if (
  !process.env.AWS_REGION ||
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY
) {
  throw new Error("Missing AWS configuration environment variables");
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const generatePresignedUrl = functions.https.onRequest(
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });

      return;
    }

    const { fileName, fileType, imageType } = req.body;

    if (!fileName || !fileType || !imageType) {
      res.status(400).json({ error: "Missing required fields" });

      return;
    }

    const key = `airdrops/${imageType}/${Date.now()}-${fileName}`;

    try {
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutos

      res.status(200).json({ url, key });
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      res.status(500).json({ error: "Failed to generate presigned URL" });
    }
  },
);
