
export const deleteFileFromCloudinary = async (url: string) => {
  if (!url) return;
  try {
    // Attempt to extract a public id from a typical Cloudinary URL
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    const publicId = match?.[1];
    if (!publicId) return;

    // If cloudinary is configured, attempt destruction. If not, no-op.
    if ((cloudinary as any)?.uploader?.destroy) {
      // resource_type may vary; use image as default
      // ignore result intentionally
      // @ts-ignore
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    }
  } catch (err) {
    // swallow to avoid throwing from cleanup
    console.error("deleteFileFromCloudinary failed:", err);
  }
};




import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import crypto from "crypto"; 

dotenv.config({ path: path.join(process.cwd(), ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});






export const uploadFileToCloudinary = async (
  buffer: Buffer,
  fileName: string
): Promise<UploadApiResponse> => {
  // Validation
  if (!buffer || buffer.length === 0) {
    throw new Error("File buffer is empty");
  }

  if (!fileName) {
    throw new Error("File name is required");
  }

  // Extension validation
  const extension = fileName.split(".").pop()?.toLowerCase();
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error(`Only ${allowedExtensions.join(", ")} files are allowed`);
  }

  // Clean filename
  const cleanName = fileName
    .split(".")
    .slice(0, -1)
    .join(".")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${cleanName}`;
  const folder = "ecospark/images";

  console.log(`📤 Uploading: ${uniqueName} (${(buffer.length / 1024).toFixed(2)} KB)`);

  return new Promise((resolve, reject) => {
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: folder,
        public_id: uniqueName,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Error:", error);
          return reject(
            new Error(`Cloudinary upload failed: ${error.message}`)
          );
        }

        if (!result) {
          return reject(new Error("Cloudinary returned empty result"));
        }

        console.log("✅ Upload successful:", result.secure_url);
        resolve(result);
      }
    );

 
    uploadStream.end(buffer);
  });
};

export default cloudinary;