
import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;

  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;

  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;

  FRONTEND_URL: string;

  STRIPE: {
    SECRET_KEY: string;
    WEBHOOK_SECRET: string;
  };

  CLOUDINARY: {
    [x: string]: string | undefined;
    CLOUD_NAME: string;
    API_KEY: string;
    API_SECRET: string;
  };
}

const loadEnvVariables = (): EnvConfig => {
  const env = process.env;
  const requiredEnvVariables = [
    "DATABASE_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "FRONTEND_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  const missing = requiredEnvVariables.filter((variable) => !env[variable]);

  if (missing.length > 0) {
    console.warn(`[env] Missing optional deployment variables: ${missing.join(", ")}`);
  }

  return {
    NODE_ENV: env.NODE_ENV || "development",
    PORT: env.PORT || "5000",
    DATABASE_URL: env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres",

    ACCESS_TOKEN_SECRET: env.ACCESS_TOKEN_SECRET || env.JWT_ACCESS_SECRET || "dev-access-secret",
    REFRESH_TOKEN_SECRET: env.REFRESH_TOKEN_SECRET || env.JWT_REFRESH_SECRET || "dev-refresh-secret",

    ACCESS_TOKEN_EXPIRES_IN: env.ACCESS_TOKEN_EXPIRES_IN || "1d",
    REFRESH_TOKEN_EXPIRES_IN: env.REFRESH_TOKEN_EXPIRES_IN || "7d",

    FRONTEND_URL: env.FRONTEND_URL || "http://localhost:3000",

    STRIPE: {
      SECRET_KEY: env.STRIPE_SECRET_KEY || "",
      WEBHOOK_SECRET: env.STRIPE_WEBHOOK_SECRET || "",
    },

    CLOUDINARY: {
      CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME || "",
      API_KEY: env.CLOUDINARY_API_KEY || "",
      API_SECRET: env.CLOUDINARY_API_SECRET || "",
    },
  };
};

export const envVars = loadEnvVariables();