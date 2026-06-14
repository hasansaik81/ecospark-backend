// import dotenv from "dotenv";
// import status from "http-status";
// import AppError from "../errors/AppError";
// // import AppError from "../errorHelpers/AppError";

// dotenv.config();

// interface EnvConfig {
//     NODE_ENV: string;
//     PORT: string;
//     DATABASE_URL: string;
//     // Authentication (Better Auth or JWT)
//     AUTH_SECRET: string;
//     AUTH_URL: string;
//     ACCESS_TOKEN_SECRET: string;
//     REFRESH_TOKEN_SECRET: string;
//     ACCESS_TOKEN_EXPIRES_IN: string;
//     REFRESH_TOKEN_EXPIRES_IN: string;
//     // SkillBridge Specific (Courses/Learning)
//     FRONTEND_URL: string;
//     BACKEND_URL: string;
//     // Email Service (For Course Purchase/Welcome)
//     EMAIL_SENDER: {
//         SMTP_USER: string;
//         SMTP_PASS: string;
//         SMTP_HOST: string;
//         SMTP_PORT: string;
//         SMTP_FROM: string;
//     };
//     // Media Storage (For Course Thumbnails/Profile)
//     CLOUDINARY: {
//         CLOUD_NAME: string;
//         API_KEY: string;
//         API_SECRET: string;
//     };
//     // Payment Gateway (For Course Enrollment)
//     STRIPE: {
//         [x: string]: string;
//         SECRET_KEY: string;
//         WEBHOOK_SECRET: string;
//     };
//     // AI/RAG Features (For Doubt Solving/Chat)
//     AI_CONFIG: {
//         API_KEY: string;
//         MODEL: string;
//     };
// }

// const loadEnvVariables = (): EnvConfig => {
//     const requiredEnvVariables = [
//         "NODE_ENV",
//         "PORT",
//         "DATABASE_URL",
//         "AUTH_SECRET",
//         "AUTH_URL",
//         "ACCESS_TOKEN_SECRET",
//         "REFRESH_TOKEN_SECRET",
//         "ACCESS_TOKEN_EXPIRES_IN",
//         "REFRESH_TOKEN_EXPIRES_IN",
//         "FRONTEND_URL",
//         "EMAIL_SENDER_SMTP_USER",
//         "EMAIL_SENDER_SMTP_PASS",
//         "EMAIL_SENDER_SMTP_HOST",
//         "EMAIL_SENDER_SMTP_PORT",
//         "EMAIL_SENDER_SMTP_FROM",
//         "CLOUDINARY_CLOUD_NAME",
//         "CLOUDINARY_API_KEY",
//         "CLOUDINARY_API_SECRET",
//         "STRIPE_SECRET_KEY",
//         "STRIPE_WEBHOOK_SECRET",
//         "AI_API_KEY",
//     ];

//     // Missing variable check logic
//     requiredEnvVariables.forEach((variable) => {
//         if (!process.env[variable]) {
//             throw new AppError(
//                 status.INTERNAL_SERVER_ERROR,
//                 `SkillBridge Configuration Error: ${variable} is missing in .env file.`
//             );
//         }
//     });

//     return {
//         NODE_ENV: process.env.NODE_ENV as string,
//         PORT: process.env.PORT || "5000",
//         DATABASE_URL: process.env.DATABASE_URL as string,
//         AUTH_SECRET: process.env.AUTH_SECRET as string,
//         AUTH_URL: process.env.AUTH_URL as string,
//         ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
//         REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
//         ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
//         REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
//         FRONTEND_URL: process.env.FRONTEND_URL as string,
//         BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000",
//         EMAIL_SENDER: {
//             SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER as string,
//             SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS as string,
//             SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST as string,
//             SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT as string,
//             SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM as string,
//         },
//         CLOUDINARY: {
//             CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
//             API_KEY: process.env.CLOUDINARY_API_KEY as string,
//             API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
//         },
//         STRIPE: {
//             SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
//             WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
//         },
//         AI_CONFIG: {
//             API_KEY: process.env.AI_API_KEY as string,
//             MODEL: process.env.AI_MODEL || "gpt-4",
//         },
//     };
// };

// export const envVars = loadEnvVariables();



import dotenv from "dotenv";
import status from "http-status";
import AppError from "../errors/AppError";

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
    CLOUD_NAME: string;
    API_KEY: string;
    API_SECRET: string;
  };
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",

    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",

    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",

    "FRONTEND_URL",

    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",

    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        `${variable} is missing in .env file`
      );
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV!,
    PORT: process.env.PORT!,
    DATABASE_URL: process.env.DATABASE_URL!,

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,

    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN!,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN!,

    FRONTEND_URL: process.env.FRONTEND_URL!,

    STRIPE: {
      SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
      WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    },

    CLOUDINARY: {
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
      API_KEY: process.env.CLOUDINARY_API_KEY!,
      API_SECRET: process.env.CLOUDINARY_API_SECRET!,
    },
  };
};

export const envVars = loadEnvVariables();