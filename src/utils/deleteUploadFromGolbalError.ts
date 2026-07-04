import { Request } from "express";
import { deleteFileFromCloudinary } from "../config/cloudinary.config";


export const deleteUploadedFilesFromGlobalErrorHandler = async (
  req: Request
) => {
  try {
    if (req.file?.path) {
      await deleteFileFromCloudinary(req.file.path);
      console.log("Uploaded image deleted from Cloudinary.");
    }
  } catch (error) {
    console.error("Failed to delete uploaded image:", error);
  }
};