// // import dotenv from 'dotenv';
// // import path from 'path';

// // dotenv.config({ path: path.join(process.cwd(), '.env') });

// // export default {
// //   port: process.env.PORT,
// //   database_url: process.env.DATABASE_URL,
// // };


// import dotenv from 'dotenv';
// import path from 'path';

// dotenv.config({
//   path: path.join(process.cwd(), '.env'),
// });

// const config = {
//   NODE_ENV: process.env.NODE_ENV || 'development',

//   port: Number(process.env.PORT) || 5000,

//   database_url: process.env.DATABASE_URL,

//   bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUND) || 10,

//   jwt_access_secret: process.env.JWT_ACCESS_SECRET,

//   jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,

//   jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,

//   jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,

//   stripe_secret_key: process.env.STRIPE_SECRET_KEY,
// };

// export default config;



import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});
// 
const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUND) || 10,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,

  // ✅ ক্লাউডিনারি ভ্যারিয়েবলগুলো সরাসরি এখানে মার্জ করে দেওয়া হলো
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,

};

//  একটি কুইক সেফটি চেক যেন ভ্যালু undefined থাকলে টার্মিনালেই ধরা পড়ে
if (!config.cloudinary_cloud_name || !config.cloudinary_api_key || !config.cloudinary_api_secret) {
  console.warn("⚠️ Warning: Cloudinary credentials are missing in .env file!");
}

export default config;