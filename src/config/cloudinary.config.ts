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




import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import httpStatus from "http-status";
import AppError from "../errors/AppError"; 
import config from "../config/index"; // 🌱 আপনার প্রজেক্টের সঠিক config/env পাথ দিন

// Cloudinary কনফিগারেশন
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name, 
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const uploadFileToCloudinary = async (
  buffer: Buffer,
  fileName: string
): Promise<UploadApiResponse> => {
  if (!buffer || !fileName) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "File buffer and file name are required"
    );
  }

  const extension = fileName.split(".").pop()?.toLowerCase();

  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  if (!allowedExtensions.includes(extension || "")) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid file type. Only image files (jpg, jpeg, png, webp, svg, gif) are allowed!"
    );
  }

  const fileNameWithoutExtension = fileName
    .split(".")
    .slice(0, -1)
    .join(".")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const uniqueName = `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileNameWithoutExtension}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image", 
          folder: "ecospark/images", 
          public_id: uniqueName,
        },
        (error, result) => {
          if (error) {
            return reject(
              new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "Failed to upload image to Cloudinary"
              )
            );
          }
          resolve(result as UploadApiResponse);
        }
      )
      .end(buffer);
  });
};

export const deleteFileFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);

    if (match?.[1]) {
      const publicId = match[1];

      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });

      console.log(`Deleted from Cloudinary: ${publicId}`);
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete file from Cloudinary"
    );
  }
};

// 💡 আমরা ২টি নামই এক্সপোর্ট করে দিচ্ছি যেন আপনার অন্য কোনো ফাইলে যে নামেই ডাকা হোক না কেন, কোনো এরর না আসে!
export const cloudinaryUpload = cloudinary;
