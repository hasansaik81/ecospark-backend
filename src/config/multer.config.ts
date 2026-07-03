// // import multer from "multer";
// // import status from "http-status";
// // import AppError from "../errors/AppError";

// // // Use memory storage so files are available as buffers
// // const storage = multer.memoryStorage();

// // // const fileFilter: multer.FileFilterCallback = (req, file, cb) => {
// // // 	if (file.mimetype && file.mimetype.startsWith("image/")) {
// // // 		cb(null, true);
// // // 	} else {
// // // 		cb(new AppError(status.UNSUPPORTED_MEDIA_TYPE, "Only image files are allowed"));
// // // 	}
// // // };


// // const fileFilter = (
// //     req: any,
// //     file: any,
// //     cb: (error: Error | null, accepted: boolean) => void
// // ) => {
// //     // Your filter logic
// //     const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];

// //     if (allowedMimes.includes(file.mimetype)) {
// //         cb(null, true);
// //     } else {
// //         cb(new Error('Invalid file type'), false);
// //     }
// // };

// // export const upload = multer({
// //     storage: cloudinaryStorage,
// //     fileFilter: fileFilter
// // });

// // const DEFAULT_LIMITS = { fileSize: 5 * 1024 * 1024 }; // 5 MB

// // const uploader = multer({ storage, fileFilter, limits: DEFAULT_LIMITS });

// // export const uploadSingle = (fieldName = "image") => uploader.single(fieldName);

// // export const uploadArray = (fieldName = "images", maxCount = 5) => uploader.array(fieldName, maxCount);

// // export const uploadFields = (fields: { name: string; maxCount?: number }[]) => uploader.fields(fields);

// // export default uploader;




// import multer from "multer";
// import status from "http-status";
// import AppError from "../errors/AppError";

// const storage = multer.memoryStorage();

// const fileFilter: multer.Options["fileFilter"] = (
//   req,
//   file,
//   cb
// ) => {
//   const allowedMimes = [
//     "image/jpeg",
//     "image/png",
//     "image/webp",
//   ];

//   if (allowedMimes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new AppError(
//         status.UNSUPPORTED_MEDIA_TYPE,
//         "Only JPG, PNG and WEBP images are allowed"
//       )
//     );
//   }
// };

// const uploader = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },
// });

// export default uploader;





// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { cloudinaryUpload } from "./cloudinary.config";


// const storage = new CloudinaryStorage({
//   cloudinary: cloudinaryUpload,

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

// export const multerUpload = multer({
//   storage,

//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },

//   fileFilter: (req, file, cb) => {
//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/webp",
//     ];

//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only JPG, PNG and WEBP images are allowed"));
//     }
//   },
// });


// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { cloudinaryUpload } from "./cloudinary.config";

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinaryUpload,
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

// export const multerUpload = multer({
//   storage,
//   limits: {
//     fileSize: 25 * 1024 * 1024, // 25 মেগাবাইট লিমিট
//     // 🛠️ এই নিচের ৩টি লাইন যোগ করা হয়েছে `Unexpected end of form` এররটি আটকানোর জন্য:
//     fields: 50,         // সর্বোচ্চ ৫০টি টেক্সট ফিল্ড এলাউ করবে
//     parts: 100,         // টোটাল পার্টস লিমিট বাড়িয়ে দেওয়া হলো
//     headerPairs: 2000,  // হেডার পেয়ার প্রসেসিং বাউন্ডারি বাড়ানো হলো
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/webp",
//     ];

//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only JPG, PNG and WEBP images are allowed"));
//     }
//   },
// });




// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { cloudinaryUpload } from "./cloudinary.config";

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinaryUpload,
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
//       // 🛠️ 'image' as const এর জায়গায় সরাসরি স্ট্রিং "image" ব্যবহার করুন 
//       // এবং ফরম্যাটটি নির্দিষ্ট করে দিন যেন ক্লাউডিনারি সহজে চিনতে পারে
//       resource_type: "image", 
//       format: file.mimetype.split("/")[1], // যেমন: jpeg, png
//     };
//   },
// });





// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";
// import path from "path";

// // 💡 নিশ্চিত হওয়া যে এই ফাইলে সরাসরি .env লোড হচ্ছে
// dotenv.config({ path: path.join(process.cwd(), ".env") });

// // 🎯 সরাসরি process.env ব্যবহার করে ক্লাউডিনারি কনফিগারেশন
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const cloudinaryUpload = cloudinary;

// // স্টোরেজ ইঞ্জিন তৈরি
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




// import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import httpStatus from "http-status";
// // import AppError from "../errorHelpers/AppError";
// import { envVars } from "./env";
// import AppError from "../errors/AppError";

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
//       httpStatus.BAD_REQUEST,
//       "File buffer and file name are required"
//     );
//   }

//   const extension = fileName.split(".").pop()?.toLowerCase();

//   const fileNameWithoutExtension = fileName
//     .split(".")
//     .slice(0, -1)
//     .join(".")
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "");

//   const uniqueName = `${Math.random()
//     .toString(36)
//     .substring(2)}-${Date.now()}-${fileNameWithoutExtension}`;

//   // EcoSpark folders
//   let folder = "uploads";

//   if (
//     ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
//       extension || ""
//     )
//   ) {
//     folder = "images";
//   } else if (extension === "pdf") {
//     folder = "documents";
//   }

//   return new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           resource_type: "auto",
//           folder: `ecospark/${folder}`,
//           public_id: uniqueName,
//         },
//         (error, result) => {
//           if (error) {
//             return reject(
//               new AppError(
//                 httpStatus.INTERNAL_SERVER_ERROR,
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





// // import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { cloudinaryUpload } from "./cloudinary.config"; // স্পেলিং চেক করুন

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinaryUpload,
//   params: async (req: any, file: any) => {
//     const originalName = file.originalname;

//     // ফাইলের নাম ক্লিন করা
//     const fileNameWithoutExtension = originalName
//       .split(".")
//       .slice(0, -1)
//       .join(".")
//       .toLowerCase()
//       .replace(/\s+/g, "-")
//       .replace(/[^a-z0-9\-]/g, "");

//     // ইউনিক নাম জেনারেট করা
//     const uniqueName = `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileNameWithoutExtension}`;

//     return {
//       folder: "ecospark/images",
//       public_id: uniqueName,
//       resource_type: "image",
//     };
//   },
// } as any); // 👈 এই 'as any' টুকু টাইপস্ক্রিপ্টের ব্লকিং দূর করবে

// // ✅ স্পষ্ট এবং ক্লিন এক্সপোর্ট
// export const multerUpload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed!") as any, false);
//     }
//   },
// });



// import multer from "multer";

// const storage = multer.memoryStorage();

// export const multerUpload = multer({
//   storage,

//   limits: {
//     fileSize: 10 * 1024 * 1024,
//   },

//   fileFilter(req, file, cb) {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed"));
//     }
//   },
// });



// import multer from "multer";

// // মেমোরি স্টোরেজ ব্যবহার করা হচ্ছে যেন বাফার কন্ট্রোলারে পাঠানো যায়
// const storage = multer.memoryStorage();

// export const multerUpload = multer({
//   storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // সর্বোচ্চ ১০ মেগাবাইট ফাইল সাপোর্ট করবে
//   },
//   fileFilter: (req, file, cb) => {
//     // মাইম-টাইপ অথবা ফাইলের এক্সটেনশন চেক (সব ধরনের ইমেজকে পাস করবে)
//     const isImage =
//       file.mimetype.startsWith("image/") ||
//       /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.originalname);

//     if (isImage) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed") as any, false);
//     }
//   },
// });




// import express from "express";
// import multer from "multer";
// import auth from "../../middlewares/auth"; // আপনার প্রজেক্টের সঠিক পাথ দিন
// import { IdeaController } from "./idea.controller";

// import multer from "multer";

// const storage = multer.memoryStorage();

// export const multerUpload = multer({
//   storage,
//   limits: {
//     fileSize: 15 * 1024 * 1024, // 15MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     // 🔍 ডিবাগিং: টার্মিনালে চেক করুন ফাইলটি আদেও কেমন আসছে
//     console.log("📂 Incoming File Specs:", {
//       mimetype: file?.mimetype,
//       originalname: file?.originalname,
//     });

//     // ১. যদি কোনো ফাইল না থাকে বা আনডিফাইন্ড হয়, তাহলেও পাস করতে দিন (যাতে এরর না দেয়)
//     if (!file) {
//       return cb(null, true);
//     }

//     // ২. ইমেজের টাইপ বা এক্সটেনশন নিখুঁতভাবে চেক করা
//     const isImage =
//       (file.mimetype && file.mimetype.startsWith("image/")) ||
//       (file.originalname && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.originalname));

//     if (isImage) {
//       cb(null, true); // ইমেজ হলে পাস
//     } else {
//       cb(new Error("Only image files are allowed") as any, false);
//     }
//   },
// });




// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { cloudinaryUpload } from "./cloudinary.config";

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinaryUpload,
//   params: async (req, file) => {
//     const originalName = file.originalname;
//     const extension = originalName.split(".").pop()?.toLowerCase();

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
//       folder: "ph-healthcare/images",
//       public_id: uniqueName,
//       resource_type: "image", // only image
//     };
//   },
// });

// const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
//   const allowedMimeTypes = [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/webp",
//     "image/gif",
//   ];

//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed."));
//   }
// };

// export const multerUpload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5 MB
//   },
// });



// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { cloudinaryUpload } from "./cloudinary.config";

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinaryUpload,

//   params: async (req, file) => {
//     const originalName = file.originalname;

//     const extension = originalName.split(".").pop()?.toLowerCase();

//     const fileNameWithoutExtension = originalName
//       .split(".")
//       .slice(0, -1)
//       .join(".")
//       .toLowerCase()
//       .replace(/\s+/g, "-")
//       .replace(/[^a-z0-9-]/g, "");

//     const uniqueName = `${Math.random()
//       .toString(36)
//       .substring(2)}-${Date.now()}-${fileNameWithoutExtension}`;

//     // 🔥 FIX 1: safer folder naming
//     const folder =
//       extension === "gif"
//         ? "ecospark/images/gif"
//         : "ecospark/images";

//     return {
//       folder, // ✅ corrected
//       public_id: uniqueName,

//       // 🔥 FIX 2: explicit image type (safe for images only)
//       resource_type: "image",
//     };
//   },
// });

// const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
//   const allowedMimeTypes = [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/webp",
//     "image/gif",
//   ];

//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed."));
//   }
// };

// export const multerUpload = multer({
//   storage,
//   fileFilter,

//   // 🔥 FIX 3: safer limits
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
// });



import multer from "multer";

export const multerUpload = multer({
  storage: multer.memoryStorage(),

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
       "image/pjpeg",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});