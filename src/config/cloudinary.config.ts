// // import cloudinary from "cloudinary";
// // import streamifier from "streamifier";
// // import { envVars } from "./env";

// // cloudinary.v2.config({
// // 	cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
// // 	api_key: envVars.CLOUDINARY.API_KEY,
// // 	api_secret: envVars.CLOUDINARY.API_SECRET,
// // });

// // export type CloudinaryUploadResult = {
// // 	public_id: string;
// // 	secure_url: string;
// // 	[key: string]: any;
// // };

// // export const uploadBuffer = (
// // 	buffer: Buffer,
// // 	folder?: string,
// // 	options: Record<string, any> = {}
// // ): Promise<CloudinaryUploadResult> => {
// // 	return new Promise((resolve, reject) => {
// // 		const uploadOptions: Record<string, any> = { folder, ...options };

// // 		const stream = cloudinary.v2.uploader.upload_stream(
// // 			uploadOptions,
// // 			(error: any, result: any) => {
// // 				if (error) return reject(error);
// // 				resolve(result as CloudinaryUploadResult);
// // 			}
// // 		);

// // 		streamifier.createReadStream(buffer).pipe(stream);
// // 	});
// // };

// // export const uploadFromPath = (
// // 	path: string,
// // 	options: Record<string, any> = {}
// // ): Promise<CloudinaryUploadResult> => {
// // 	return cloudinary.v2.uploader.upload(path, options) as Promise<CloudinaryUploadResult>;
// // };

// // export const deleteResource = (publicId: string): Promise<any> => {
// // 	return cloudinary.v2.uploader.destroy(publicId);
// // };

// // export default cloudinary.v2;



// import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import status from "http-status";
// import AppError from "../errors/AppError";
// import { envVars } from "./env";

// cloudinary.config({
//   cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
//   api_key: envVars.CLOUDINARY.API_KEY,
//   api_secret: envVars.CLOUDINARY.API_SECRET,
// });

// export const uploadFileToCloudinary = async (
//   buffer: Buffer,
//   fileName: string
// ): Promise<UploadApiResponse> => {
//   if (!buffer || !fileName) {
//     throw new AppError(
//       status.BAD_REQUEST,
//       "File buffer and file name are required"
//     );
//   }

//   const fileNameWithoutExtension = fileName
//     .split(".")
//     .slice(0, -1)
//     .join(".")
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "");

//   const uniqueName =
//     Math.random().toString(36).substring(2) +
//     "-" +
//     Date.now() +
//     "-" +
//     fileNameWithoutExtension;

//   return new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           resource_type: "auto",
//           folder: "ecospark/ideas",
//           public_id: uniqueName,
//         },
//         (error, result) => {
//           if (error) {
//             return reject(
//               new AppError(
//                 status.INTERNAL_SERVER_ERROR,
//                 "Failed to upload file to Cloudinary"
//               )
//             );
//           }

//           resolve(result as UploadApiResponse);
//         }
//       )
//       .end(buffer);
//   });
// };

// export const deleteFileFromCloudinary = async (
//   imageUrl: string
// ) => {
//   try {
//     const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
//     const match = imageUrl.match(regex);

//     if (match && match[1]) {
//       await cloudinary.uploader.destroy(match[1]);
//     }
//   } catch {
//     throw new AppError(
//       status.INTERNAL_SERVER_ERROR,
//       "Failed to delete image from Cloudinary"
//     );
//   }
// };

// export const cloudinaryUpload = cloudinary;





// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { v2 as cloudinary } from "cloudinary";
// import { envVars } from "./env";

// // Cloudinary config
// cloudinary.config({
//   cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
//   api_key: envVars.CLOUDINARY.API_KEY,
//   api_secret: envVars.CLOUDINARY.API_SECRET,
// });

// // Storage
// const storage = new CloudinaryStorage({
//   cloudinary,

//   params: async (req, file) => {
//     const originalName = file.originalname;

//     const fileNameWithoutExtension = originalName
//       .split(".")
//       .slice(0, -1)
//       .join(".")
//       .toLowerCase()
//       .replace(/\s+/g, "-")
//       .replace(/[^a-z0-9-]/g, "");

//     const uniqueName =
//       Math.random().toString(36).substring(2) +
//       "-" +
//       Date.now() +
//       "-" +
//       fileNameWithoutExtension;

//     return {
//       folder: "ecospark/ideas",
//       public_id: uniqueName,
//       resource_type: "image",
//     };
//   },
// });

// // File filter
// const fileFilter: multer.Options["fileFilter"] = (
//   req,
//   file,
//   cb
// ) => {
//   const allowedTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/webp",
//   ];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only JPG, PNG and WEBP images are allowed"));
//   }
// };

// // Multer export
// export const multerUpload = multer({
//   storage,

//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },

//   fileFilter,
// });



import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";

// Configure Cloudinary
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
  api_key: envVars.CLOUDINARY.API_KEY,
  api_secret: envVars.CLOUDINARY.API_SECRET,
});

export const cloudinaryUpload = cloudinary;

// Storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const originalName = file.originalname;
    const fileNameWithoutExtension = originalName
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const uniqueName =
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now() +
      "-" +
      fileNameWithoutExtension;

    return {
      folder: "ecospark/ideas",
      public_id: uniqueName,
      resource_type: "image" as const,
    };
  },
});

// Export single multer instance
export const multerUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and WEBP images are allowed"));
    }
  },
});