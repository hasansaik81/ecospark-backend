// import { UploadApiResponse } from "cloudinary";
// import cloudinary from "../config/cloudinary.config";

// export const uploadFileToCloudinary = (
//     buffer: Buffer,
//     fileName: string
// ): Promise<UploadApiResponse> => {
//     return new Promise((resolve, reject) => {
//         cloudinary.uploader
//             .upload_stream(
//                 {
//                     folder: "ecospark/images",
//                     resource_type: "image",
//                     public_id: `${Date.now()}-${fileName
//                         .split(".")[0]
//                         .replace(/\s+/g, "-")}`,
//                 },
//                 (error, result) => {
//                     if (error) return reject(error);

//                     resolve(result as UploadApiResponse);
//                 }
//             )
//             .end(buffer);
//     });
// };




// import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// // 🔐 সরাসরি ক্লাউডিনারি অফিশিয়াল কনফিগারেশন
// cloudinary.config({
//     cloud_name: "dmni9du1l",
//     api_key: "246187762724262",
//     api_secret: "B4Kp5BCZVkjA0WE7KrmEbFVk5Po", // আপনার একদম নতুন কপি করা সিক্রেট কি
// });

// export const uploadFileToCloudinary = async (
//     buffer: Buffer,
//     fileName: string
// ): Promise<UploadApiResponse> => {
//     if (!buffer || !fileName) {
//         throw new Error("File buffer and file name are required");
//     }

//     // ক্লিন এবং ইউনিক নাম তৈরি
//     const uniqueName = `${Math.random().toString(36).substring(2)}-${Date.now()}`;

//     return new Promise((resolve, reject) => {
//         cloudinary.uploader
//             .upload_stream(
//                 {
//                     resource_type: "image",
//                     // 💡 ফোল্ডার পারমিশন ইস্যু এড়াতে সাময়িকভাবে সরাসরি রুটে আপলোড করা হচ্ছে
//                     public_id: uniqueName,
//                 },
//                 (error, result) => {
//                     if (error) {
//                         console.error("❌ Cloudinary Actual Server Error:", error);
//                         return reject(error);
//                     }
//                     resolve(result as UploadApiResponse);
//                 }
//             )
//             .end(buffer);
//     });
// };