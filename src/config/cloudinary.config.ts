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



// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { v2 as cloudinary } from "cloudinary";
// import { envVars } from "./env";

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
//   api_key: envVars.CLOUDINARY.API_KEY,
//   api_secret: envVars.CLOUDINARY.API_SECRET,
// });

// export const cloudinaryUpload = cloudinary;

// // Storage configuration
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
//       resource_type: "image" as const,
//     };
//   },
// });

// // Export single multer instance
// export const multerUpload = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only JPG, PNG and WEBP images are allowed"));
//     }
//   },
// });





// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { v2 as cloudinary } from "cloudinary";
// import config from "../config"; // 👈 আপনার নতুন আপডেট করা config ফাইলটি ইমপোর্ট করুন

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: config.cloudinary_cloud_name,
//   api_key: config.cloudinary_api_key,
//   api_secret: config.cloudinary_api_secret,
// });

// export const cloudinaryUpload = cloudinary;

// // Storage configuration
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinaryUpload,
//   params: async (req, file) => {
//     const originalName = file.originalname || "image";
//     const fileNameWithoutExtension = originalName
//       .split(".")
//       .slice(0, -1)
//       .join(".")
//       .toLowerCase()
//       .replace(/\s+/g, "-")
//       .replace(/[^a-z0-9-]/g, "");

//     const uniqueName = `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileNameWithoutExtension}`;

//     return {
//       folder: "ecospark/ideas",
//       public_id: uniqueName,
//       format: "jpg", 
//       resource_type: "image",
//     };
//   },
// });

// export const multerUpload = multer({
//   storage,
// });


// // ph health  care copy 

// // import multer from "multer";
// // import { CloudinaryStorage } from "multer-storage-cloudinary";
// // import { cloudinaryUpload } from "./cloudinary.config";

// // const storage = new CloudinaryStorage({
// //   cloudinary: cloudinaryUpload,

// //   params: async (req, file) => {
// //     const originalName = file.originalname;

// //     const fileNameWithoutExtension = originalName
// //       .split(".")
// //       .slice(0, -1)
// //       .join(".")
// //       .toLowerCase()
// //       .replace(/\s+/g, "-")
// //       .replace(/[^a-z0-9-]/g, "");

// //     const uniqueName =
// //       `${Math.random().toString(36).substring(2)}-${
// //         Date.now()
// //       }-${fileNameWithoutExtension}`;

// //     return {
// //       folder: "ecospark-hub/ideas",
// //       public_id: uniqueName,
// //     };
// //   },
// // });

// // export const multerUpload = multer({ storage });





// import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import status from "http-status";
// // import AppError from "../errorHelpers/AppError"; // আপনার প্রজেক্টের পাথ অনুযায়ী মিলিয়ে নেবেন
// import { envVars } from "./env"; // আপনার এনভায়রনমেন্ট ভ্যারিয়েবল ফাইল
// import AppError from "../errors/AppError";

// cloudinary.config({
//     cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
//     api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
//     api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
// });

// export const uploadFileToCloudinary = async (
//     buffer: Buffer,
//     fileName: string,
// ): Promise<UploadApiResponse> => {

//     if (!buffer || !fileName) {
//         throw new AppError(status.BAD_REQUEST, "File buffer and file name are required for upload");
//     }

//     // ফাইলের নাম ক্লিন করা (স্পেস বদলে ড্যাশ করা এবং স্পেশাল ক্যারেক্টার বাদ দেওয়া)
//     const fileNameWithoutExtension = fileName
//         .split(".")
//         .slice(0, -1)
//         .join(".")
//         .toLowerCase()
//         .replace(/\s+/g, "-")
//         .replace(/[^a-z0-9\-]/g, "");

//     // ইউনিক নাম তৈরি করা
//     const uniqueName = `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileNameWithoutExtension}`;

//     return new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//             {
//                 resource_type: "image", // 👈 শুধুমাত্র ইমেজ বাউন্ড করা হলো
//                 public_id: uniqueName,
//                 folder: "ecospark/images", // 👈 আপনার প্রজেক্টের নাম অনুযায়ী ফোল্ডার নাম
//             },
//             (error, result) => {
//                 if (error) {
//                     return reject(new AppError(status.INTERNAL_SERVER_ERROR, "Failed to upload file to Cloudinary"));
//                 }
//                 resolve(result as UploadApiResponse);
//             }
//         ).end(buffer);
//     });
// };

// export const deleteFileFromCloudinary = async (url: string) => {
//     try {
//         const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
//         const match = url.match(regex);

//         if (match && match[1]) {
//             const publicId = match[1];

//             await cloudinary.uploader.destroy(publicId, {
//                 resource_type: "image"
//             });

//             console.log(`File ${publicId} deleted from Cloudinary`);
//         }
//     } catch (error) {
//         console.error("Error deleting file from Cloudinary:", error);
//         throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
//     }
// };

// export const cloudinaryUpload = cloudinary;




// import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import httpStatus from "http-status";
// import AppError from "../errors/AppError"; // আপনার প্রজেক্টের সঠিক পাথ অনুযায়ী
// import config from "./index"; // অথবা যেখানে আপনার envVars বা config ডিক্লেয়ার করা আছে

// // Cloudinary কনফিগারেশন
// cloudinary.config({
//   cloud_name: config.cloudinary_cloud_name, // আপনার কনফিগ ফাইলের প্রোপার্টি নাম মিলিয়ে নেবেন
//   api_key: config.cloudinary_api_key,
//   api_secret: config.cloudinary_api_secret,
// });

// export const uploadFileToCloudinary = async (
//   buffer: Buffer,
//   fileName: string
// ): Promise<UploadApiResponse> => {
//   if (!buffer || !fileName) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "File buffer and file name are required"
//     );
//   }

//   const extension = fileName.split(".").pop()?.toLowerCase();

//   // ইমেজের এক্সটেনশন ভ্যালিডেশন (অন্য কোনো ফাইল টাইপ যেন পাস না করতে পারে)
//   const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
//   if (!allowedExtensions.includes(extension || "")) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "Invalid file type. Only image files (jpg, jpeg, png, webp, svg, gif) are allowed!"
//     );
//   }

//   // ফাইলের নাম ক্লিন করা
//   const fileNameWithoutExtension = fileName
//     .split(".")
//     .slice(0, -1)
//     .join(".")
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "");

//   // ইউনিক নাম জেনারেট করা
//   const uniqueName = `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileNameWithoutExtension}`;

//   return new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           resource_type: "image", // 👈 'auto' বদলে 'image' করে দেওয়া হলো যেন শুধু ইমেজ আপলোড হয়
//           folder: "ecospark/images", // 👈 সরাসরি ecospark/images ফোল্ডারে যাবে
//           public_id: uniqueName,
//         },
//         (error, result) => {
//           if (error) {
//             return reject(
//               new AppError(
//                 httpStatus.INTERNAL_SERVER_ERROR,
//                 "Failed to upload image to Cloudinary"
//               )
//             );
//           }
//           resolve(result as UploadApiResponse);
//         }
//       )
//       .end(buffer);
//   });
// };

// export const deleteFileFromCloudinary = async (url: string) => {
//   try {
//     const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
//     const match = url.match(regex);

//     if (match?.[1]) {
//       const publicId = match[1];

//       await cloudinary.uploader.destroy(publicId, {
//         resource_type: "image",
//       });

//       console.log(`Deleted from Cloudinary: ${publicId}`);
//     }
//   } catch (error) {
//     console.error("Cloudinary delete error:", error);
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to delete file from Cloudinary"
//     );
//   }
// };

// export const cloudinaryUploader = cloudinary;




// import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import httpStatus from "http-status";
// import AppError from "../errors/AppError"; 
// import config from "../config/index"; // 🌱 আপনার প্রজেক্টের সঠিক config/env পাথ দিন

// // Cloudinary কনফিগারেশন
// cloudinary.config({
//   cloud_name: config.cloudinary_cloud_name, 
//   api_key: config.cloudinary_api_key,
//   api_secret: config.cloudinary_api_secret,
// });

// export const uploadFileToCloudinary = async (
//   buffer: Buffer,
//   fileName: string
// ): Promise<UploadApiResponse> => {
//   if (!buffer || !fileName) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "File buffer and file name are required"
//     );
//   }

//   const extension = fileName.split(".").pop()?.toLowerCase();

//   const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
//   if (!allowedExtensions.includes(extension || "")) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "Invalid file type. Only image files (jpg, jpeg, png, webp, svg, gif) are allowed!"
//     );
//   }

//   const fileNameWithoutExtension = fileName
//     .split(".")
//     .slice(0, -1)
//     .join(".")
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "");

//   const uniqueName = `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileNameWithoutExtension}`;

//   return new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           resource_type: "image", 
//           folder: "ecospark/images", 
//           public_id: uniqueName,
//         },
//         (error, result) => {
//            console.log("Cloudinary Error:", error);
//           if (error) {
//             return reject(
//               new AppError(
//                 httpStatus.INTERNAL_SERVER_ERROR,
//                 "Failed to upload image to Cloudinary"
//               )
//             );
//           }
//           resolve(result as UploadApiResponse);
//         }
//       )
//       .end(buffer);
//   });
// };

// export const deleteFileFromCloudinary = async (url: string) => {
//   try {
//     const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
//     const match = url.match(regex);

//     if (match?.[1]) {
//       const publicId = match[1];

//       await cloudinary.uploader.destroy(publicId, {
//         resource_type: "image",
//       });

//       console.log(`Deleted from Cloudinary: ${publicId}`);
//     }
//   } catch (error) {
//     console.error("Cloudinary delete error:", error);
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to delete file from Cloudinary"
//     );
//   }
// };

// // 💡 আমরা ২টি নামই এক্সপোর্ট করে দিচ্ছি যেন আপনার অন্য কোনো ফাইলে যে নামেই ডাকা হোক না কেন, কোনো এরর না আসে!
// export const cloudinaryUpload = cloudinary;


// import { v2 as cloudinary } from "cloudinary";
// import config from "../config";

// cloudinary.config({
//   cloud_name: config.cloudinary_cloud_name,
//   api_key: config.cloudinary_api_key,
//   api_secret: config.cloudinary_api_secret,
// });

// export default cloudinary;





// import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import httpStatus from "http-status";

// // 🔐 সরাসরি কনফিগারেশন নিশ্চিত করা হলো
// cloudinary.config({
//   cloud_name: "dmni9du1l",
//   api_key: "246187762724262",
//   api_secret: "B4Kp5BCZVkjA0WE7KrmEbFVk5Po",
// });

// export const uploadFileToCloudinary = async (
//   buffer: Buffer,
//   fileName: string
// ): Promise<UploadApiResponse> => {
//   if (!buffer || !fileName) {
//     throw new Error("File buffer and file name are required");
//   }

//   const uniqueName = `${Math.random().toString(36).substring(2)}-${Date.now()}`;

//   return new Promise((resolve, reject) => {
//     // ✅ এখানে সরাসরি মডিউলের 'cloudinary' অবজেক্ট ব্যবহার করা হচ্ছে
//     cloudinary.uploader
//       .upload_stream(
//         {
//           resource_type: "image",
//           folder: "ecospark/images",
//           public_id: uniqueName,
//         },
//         (error, result) => {
//           if (error) {
//             console.error("Cloudinary Upload Error:", error);
//             return reject(error);
//           }
//           resolve(result as UploadApiResponse);
//         }
//       )
//       .end(buffer);
//   });
// };

// export const deleteFileFromCloudinary = async (url: string) => {
//   try {
//     const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
//     const match = url.match(regex);

//     if (match?.[1]) {
//       const publicId = match[1];
//       await cloudinary.uploader.destroy(publicId, {
//         resource_type: "image",
//       });
//       console.log(`Deleted from Cloudinary: ${publicId}`);
//     }
//   } catch (error) {
//     console.error("Cloudinary delete error:", error);
//   }
// };




// import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import httpStatus from "http-status";
// import AppError from "../errors/AppError";
// import config from "../config/index";

// // =======================
// // Cloudinary Config
// // =======================

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // =======================
// // Upload File
// // =======================
// export const uploadFileToCloudinary = async (
//   buffer: Buffer,
//   fileName: string
// ): Promise<UploadApiResponse> => {
//   if (!buffer || !fileName) {
//     throw new AppError(httpStatus.BAD_REQUEST, "File is required");
//   }

//   const extension = fileName.split(".").pop()?.toLowerCase();

//   const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

//   if (!allowedExtensions.includes(extension || "")) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "Only image files are allowed"
//     );
//   }

//   const cleanName = fileName
//     .split(".")
//     .slice(0, -1)
//     .join(".")
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "");

//   const uniqueName = `${Date.now()}-${Math.random()
//     .toString(36)
//     .substring(2)}-${cleanName}`;

//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: "image",
//         folder: "ecospark/images",
//         public_id: uniqueName,
//       },
//       (error, result) => {
//         if (error || !result) {
//           return reject(
//             new AppError(
//               httpStatus.INTERNAL_SERVER_ERROR,
//               "Failed to upload image to Cloudinary"
//             )
//           );
//         }

//         resolve(result);
//       }
//     );

//     stream.end(buffer);
//   });
// };

// // =======================
// // Delete File
// // =======================
// export const deleteFileFromCloudinary = async (url: string) => {
//   try {
//     if (!url) return;

//     const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
//     const match = url.match(regex);

//     if (!match?.[1]) return;

//     const publicId = match[1];

//     await cloudinary.uploader.destroy(publicId, {
//       resource_type: "image",
//     });

//     console.log(`Deleted from Cloudinary: ${publicId}`);
//   } catch (error) {
//     console.error("Cloudinary delete error:", error);
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to delete file from Cloudinary"
//     );
//   }
// };

// // =======================
// // Export (clean)
// // =======================
// export { cloudinary };





// import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import httpStatus from "http-status";
// import AppError from "../errors/AppError";

// // =======================
// // Cloudinary Config with Validation
// // =======================
// const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
// const API_KEY = process.env.CLOUDINARY_API_KEY;
// const API_SECRET = process.env.CLOUDINARY_API_SECRET;
// const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || "ecospark_preset"; // .env এ যোগ করুন

// // Credentials validate করুন
// if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
//   console.error("❌ Cloudinary credentials missing!");
//   console.error("CLOUD_NAME:", CLOUD_NAME ? "✅" : "❌");
//   console.error("API_KEY:", API_KEY ? "✅" : "❌");
//   console.error("API_SECRET:", API_SECRET ? "✅" : "❌");
//   throw new Error("Cloudinary credentials are missing in environment variables");
// }

// cloudinary.config({
//   cloud_name: CLOUD_NAME,
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
//   api_key: API_KEY,
//   api_secret: API_SECRET,
//   secure: true,
// });

// console.log("✅ Cloudinary configured successfully");

// // =======================
// // Upload File
// // =======================
// export const uploadFileToCloudinary = async (
//   buffer: Buffer,
//   fileName: string
// ): Promise<UploadApiResponse> => {
//   // File validation
//   if (!buffer || buffer.length === 0) {
//     throw new AppError(httpStatus.BAD_REQUEST, "File buffer is empty");
//   }

//   if (!fileName) {
//     throw new AppError(httpStatus.BAD_REQUEST, "File name is required");
//   }

//   // Extension validation
//   const extension = fileName.split(".").pop()?.toLowerCase();
//   const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  
//   if (!extension || !allowedExtensions.includes(extension)) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       `Only ${allowedExtensions.join(", ")} files are allowed`
//     );
//   }

//   // Clean filename
//   const cleanName = fileName
//     .split(".")
//     .slice(0, -1)
//     .join(".")
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "");

//   const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${cleanName}`;

//   console.log(`📤 Uploading: ${uniqueName} (${(buffer.length / 1024).toFixed(2)} KB)`);

//   return new Promise((resolve, reject) => {
//     const uploadOptions: any = {
//       resource_type: "auto",
//       folder: "ecospark/images",
//       public_id: uniqueName,
//       timeout: 60000,
//     };

//     // Upload Preset ব্যবহার করলে API Key/Secret প্রয়োজন হয় না
//     if (UPLOAD_PRESET) {
//       uploadOptions.upload_preset = UPLOAD_PRESET;
//       console.log("📌 Using upload preset:", UPLOAD_PRESET);
//     }

//     const uploadStream = cloudinary.uploader.upload_stream(
//       uploadOptions,
//       (error, result) => {
//         if (error) {
//           console.error("❌ Cloudinary Error Details:", {
//             message: error.message,
//             http_code: error.http_code,
//             error: error,
//           });
          
//           // বিশেষ করে 403 error এর জন্য বিস্তারিত message
//           if (error.http_code === 403) {
//             return reject(
//               new AppError(
//                 httpStatus.FORBIDDEN,
//                 `Cloudinary authentication failed! Please check your API credentials or upload preset. Error: ${error.message}`
//               )
//             );
//           }
          
//           return reject(
//             new AppError(
//               error.http_code || httpStatus.INTERNAL_SERVER_ERROR,
//               `Cloudinary upload failed: ${error.message}`
//             )
//           );
//         }

//         if (!result) {
//           return reject(
//             new AppError(
//               httpStatus.INTERNAL_SERVER_ERROR,
//               "Cloudinary returned empty result"
//             )
//           );
//         }

//         console.log("✅ Upload successful:", result.secure_url);
//         resolve(result);
//       }
//     );

//     uploadStream.end(buffer);
//   });
// };

// // =======================
// // Delete File
// // =======================
// export const deleteFileFromCloudinary = async (url: string) => {
//   if (!url) return;

//   try {
//     const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/;
//     const match = url.match(regex);

//     if (!match?.[1]) {
//       console.warn("⚠️ Could not extract public ID from URL:", url);
//       return;
//     }

//     const publicId = match[1];
//     console.log(`🗑️ Deleting: ${publicId}`);

//     const result = await cloudinary.uploader.destroy(publicId, {
//       resource_type: "image",
//     });

//     console.log("Delete result:", result);
//   } catch (error) {
//     console.error("Cloudinary delete error:", error);
//   }
// };

// export { cloudinary };



// import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import httpStatus from "http-status";
// import AppError from "../errors/AppError";
// import crypto from "crypto";

// =======================
// Cloudinary Config
// =======================
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });


// import { v2 as cloudinary } from 'cloudinary';

// এখন সরাসরি 'cloudinary' ব্যবহার করুন, '.v2' দেওয়ার দরকার নেই



// ১. সিগনেচার জেনারেশনের এই ম্যানুয়াল ফাংশনটি সম্পূর্ণ রিমুভ/মুছে দিন, এটির আর প্রয়োজন নেই।
// const generateSignature = ... (REMOVE THIS)

// =======================
// Upload File (Cloudinary SDK স্বয়ংক্রিয়ভাবে Signature হ্যান্ডেল করবে)
// =======================
// export const uploadFileToCloudinary = async (
//   buffer: Buffer,
//   fileName: string
// ): Promise<UploadApiResponse> => {
//   // Validation
//   if (!buffer || buffer.length === 0) {
//     throw new AppError(httpStatus.BAD_REQUEST, "File buffer is empty");
//   }

//   if (!fileName) {
//     throw new AppError(httpStatus.BAD_REQUEST, "File name is required");
//   }

//   // Extension validation
//   const extension = fileName.split(".").pop()?.toLowerCase();
//   const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  
//   if (!extension || !allowedExtensions.includes(extension)) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       `Only ${allowedExtensions.join(", ")} files are allowed`
//     );
//   }

//   // Clean filename
//   const cleanName = fileName
//     .split(".")
//     .slice(0, -1)
//     .join(".")
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "");

//   const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${cleanName}`;
//   const folder = "ecospark/images";

//   console.log(`📤 Uploading: ${uniqueName} (${(buffer.length / 1024).toFixed(2)} KB)`);

//   return new Promise((resolve, reject) => {
//     // Cloudinary SDK-র নিজস্ব upload_stream ব্যবহার করছি
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: "auto",
//         folder: folder,
//         public_id: uniqueName,
//         // এখানে আলাদা করে signature, timestamp বা api_key দেওয়ার কোনো প্রয়োজন নেই।
//         // cloudinary.config() অলরেডি এগুলো ব্যাকগ্রাউন্ডে ম্যানেজ করছে।
//       },
//       (error, result) => {
//         if (error) {
//           console.error("❌ Cloudinary Error:", error);
//           return reject(
//             new AppError(
//               error.http_code || httpStatus.INTERNAL_SERVER_ERROR,
//               `Cloudinary upload failed: ${error.message}`
//             )
//           );
//         }

//         if (!result) {
//           return reject(
//             new AppError(
//               httpStatus.INTERNAL_SERVER_ERROR,
//               "Cloudinary returned empty result"
//             )
//           );
//         }

//         console.log("✅ Upload successful:", result.secure_url);
//         resolve(result);
//       }
//     );

//     uploadStream.end(buffer);
//   });
// };





import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import crypto from "crypto"; // যদি অন্য কোথাও প্রয়োজন হয়

// ১. নিশ্চিত করা হচ্ছে যেন .env ফাইলটি সবার আগে সঠিকভাবে লোড হয়
dotenv.config({ path: path.join(process.cwd(), ".env") });

// ২. ক্লাউডিনারি গ্লোবাল কনফিগারেশন
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



console.log("Check Env:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET ? "FOUND" : "NOT FOUND"
});

// =======================
// Upload File (Fix করা সংস্করণ)
// =======================
export const uploadFileToCloudinary = async (
  buffer: Buffer,
  fileName: string
): Promise<UploadApiResponse> => {
  // Validation
  if (!buffer || buffer.length === 0) {
    throw new Error("File buffer is empty"); // আপনার AppError ক্লাসের নাম অনুযায়ী পরিবর্তন করতে পারেন
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
    // এখানে অপশনের ভেতর সরাসরি এনভায়রনমেন্ট ভ্যারিয়েবলগুলো দেওয়া হলো
    // এর ফলে "Must supply api_key" এররটি আর কখনোই আসবে না।
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

    // বাফার ডেটা স্ট্রিমে পুশ করা হচ্ছে
    uploadStream.end(buffer);
  });
};

export default cloudinary;