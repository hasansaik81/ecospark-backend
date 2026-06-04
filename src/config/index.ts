// import dotenv from 'dotenv';
// import path from 'path';

// dotenv.config({ path: path.join(process.cwd(), '.env') });

// export default {
//   port: process.env.PORT,
//   database_url: process.env.DATABASE_URL,
// };


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

  jwt_access_secret: process.env.JWT_ACCESS_SECRET,

  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,

  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,

  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,

  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
};

export default config;