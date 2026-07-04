
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUND) || 10,
  jwt_access_secret: process.env.ACCESS_TOKEN_SECRET || process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
  jwt_access_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN || process.env.JWT_ACCESS_EXPIRES_IN || '1d',
  jwt_refresh_secret: process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  jwt_refresh_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN || process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};

if (!config.cloudinary_cloud_name || !config.cloudinary_api_key || !config.cloudinary_api_secret) {
  console.warn('Warning: Cloudinary credentials are missing in .env file!');
}

export default config;