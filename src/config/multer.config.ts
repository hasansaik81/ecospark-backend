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





import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";


const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,

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

export const multerUpload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and WEBP images are allowed"));
    }
  },
});
