// // 📁 src/utils/imageHelper.ts (ব্যাকেন্ড)
// // import { transformImageUrl } from "../config/cloudinary.config";


// // ✅ ব্যাকেন্ডে ইমেজ ট্রান্সফর্মেশন
// export const getThumbnailUrl = (imageUrl: string): string => {
//   return transformImageUrl(imageUrl, {
//     width: 200,
//     height: 200,
//     crop: "thumb",
//     quality: 80,
//   });
// };

// export const getResponsiveImageUrl = (imageUrl: string, width: number): string => {
//   return transformImageUrl(imageUrl, {
//     width: width,
//     crop: "limit",
//     quality: 80,
//   });
// };

// // ✅ API Response এ ট্রান্সফর্মড ইমেজ পাঠান
// export const getImageUrls = (imageUrl: string) => {
//   return {
//     original: imageUrl,
//     thumbnail: getThumbnailUrl(imageUrl),
//     medium: getResponsiveImageUrl(imageUrl, 500),
//     large: getResponsiveImageUrl(imageUrl, 1000),
//   };
// };

// function transformImageUrl(imageUrl: string, arg1: { width: number; crop: string; quality: number; }): string {
//     throw new Error("Function not implemented.");
// }
