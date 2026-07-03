
// import { NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import config from '../config';
// import AppError from '../errors/AppError';
// import catchAsync from '../utils/catchAsync';
// import { prisma } from '../lib/prisma';

// export const USER_ROLE = {
//     ADMIN: 'ADMIN',
//     MEMBER: 'MEMBER',
// } as const;

// type AuthRole = keyof typeof USER_ROLE;

// const auth = (...requiredRoles: AuthRole[]) => {
//     return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//         // 🔐 ১. হেডার থেকে টোকেন কালেক্ট করা
//         const authHeader = req.headers.authorization;

//         if (!authHeader) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized! Authorization header is missing.');
//         }

//         // 🔐 ২. টোকেন এক্সট্র্যাক্ট করা (Bearer থাকলেও চলবে, না থাকলেও সরাসরি টোকেন নিয়ে নেবে)
//         let token = authHeader.trim();

//         if (authHeader.startsWith('Bearer ')) {
//             token = authHeader.substring(7).trim();
//         }

//         if (!token) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Token is missing!');
//         }

//         // 🔐 ৩. টোকেন ভেরিফাই করা
//         const secretKey = config.jwt_access_secret || process.env.JWT_ACCESS_SECRET;

//         if (!secretKey) {
//             throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'JWT configuration secret is missing on server.');
//         }

//         let decoded: JwtPayload;

//         try {
//             decoded = jwt.verify(token, secretKey) as JwtPayload;
//         } catch (error: any) {
//             if (error.name === 'TokenExpiredError') {
//                 throw new AppError(httpStatus.UNAUTHORIZED, 'Token has expired! Please login again.');
//             }
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token!');
//         }

//         const { role, email } = decoded;

//         if (!role || !email) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload data!');
//         }

//         // 🧑‍💻 ৪. ডাটাবেজে ইউজার চেক করা
//         const user = await prisma.user.findUnique({
//             where: { email },
//         });

//         if (!user) {
//             throw new AppError(httpStatus.NOT_FOUND, 'This user was not found!');
//         }

//         if (user.status !== 'ACTIVE') {
//             throw new AppError(httpStatus.FORBIDDEN, 'Your account is deactivated!');
//         }

//         // 🔐 ৫. রোল পারমিশন চেক করা (Strict Case Matching)
//         const userRole = role.toString().toUpperCase() as AuthRole;

//         if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
//             throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to access this route!');
//         }

//         // ✅ ৬. সফল হলে রিকোয়েস্টে ইউজার ডাটা এটাচ করা
//         req.user = {
//             id: user.id,
//             userId: user.id,
//             email: user.email,
//             role: userRole,
//             ...decoded,
//         };

//         next();
//     });
// };

// export default auth;






// import { NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import config from '../config';
// import AppError from '../errors/AppError';
// import catchAsync from '../utils/catchAsync';
// import { prisma } from '../lib/prisma';

// export const USER_ROLE = {
//     ADMIN: 'ADMIN',
//     MEMBER: 'MEMBER',
// } as const;

// type AuthRole = keyof typeof USER_ROLE;

// const auth = (...requiredRoles: AuthRole[]) => {
//     return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//         // 🔐 ১. কুকি থেকে টোকেন সংগ্রহ করা
//         const token = req.cookies.token; 

//         if (!token) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized! No token found in cookies.');
//         }

//         // 🔐 ২. টোকেন ভেরিফাই করা
//         const secretKey = config.jwt_access_secret || process.env.JWT_ACCESS_SECRET;

//         if (!secretKey) {
//             throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'JWT secret is missing!');
//         }

//         let decoded: JwtPayload;

//         try {
//             decoded = jwt.verify(token, secretKey) as JwtPayload;
//         } catch (error: any) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token!');
//         }

//         const { email } = decoded;

//         // 🧑‍💻 ৩. ডাটাবেজে ইউজার চেক করা
//         const user = await prisma.user.findUnique({
//             where: { email },
//         });

//         if (!user || user.status !== 'ACTIVE') {
//             throw new AppError(httpStatus.FORBIDDEN, 'User not found or account deactivated!');
//         }

//         // 🔐 ৪. রোল চেক করা
//         const userRole = user.role.toUpperCase() as AuthRole;

//         if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
//             throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission!');
//         }

//         // ✅ ৫. রিকোয়েস্টে ইউজার সেট করা
//         req.user = {
//             id: user.id,
//             userId: user.id,
//             email: user.email,
//             role: userRole,
//              ...decoded,
//         };

//         next();
//     });
// };

// export default auth;





// import { NextFunction, Request, Response } from "express";
// // import { secret } from "../modules/Auth/auth.service";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { prisma } from "../lib/prisma";
// // import { secret } from "../modules/Auth/auth.service";
// // import { secret } from "../modules/Auth/auth.service";


// export const USER_ROLE = {
//     ADMIN: 'ADMIN',
//     MEMBER: 'MEMBER',
// } as const;

// type AuthRole = keyof typeof USER_ROLE;


// const auth = (...roles: AuthRole[]) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const authHeader = req.headers.authorization;


//             if (!authHeader) {
//                 throw new Error("Authorization header not found!");
//             }


//             const token = authHeader.startsWith('Bearer ')
//                 ? authHeader.split(' ')[1]
//                 : authHeader;

//             if (!token) {
//                 throw new Error("Token is missing! Please provide a valid token.");
//             }

//             const secret = process.env.JWT_SECRET;
//             if (!secret) {
//                 throw new Error("JWT secret not configured");
//             }

//             const decoded = jwt.verify(token, secret) as JwtPayload;

//             const userData = await prisma.user.findUnique({
//                 where: {
//                     email: decoded.email,
//                 },
//             });

//             if (!userData) {
//                 throw new Error("User does not exist in our system!");
//             }


//             if (userData.status !== "ACTIVE") {
//                 throw new Error("Your account is not active. Please contact support.");
//             }


//             if (roles.length && !roles.includes(userData.role as AuthRole)) {
//                 throw new Error("Access Denied: You don't have permission for this action.");
//             }


//             req.user = {
//                 ...decoded,
//                 userId: userData.id,
//             };

//             next();
//         } catch (error: any) {

//             next(error);
//         }
//     };


// };



// export default auth;




// import { NextFunction, Request, Response } from "express";
// import httpStatus from "http-status";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import config from "../config";
// import AppError from "../errors/AppError";
// import catchAsync from "../utils/catchAsync";
// import { prisma } from "../lib/prisma";

// export const USER_ROLE = {
//     ADMIN: "ADMIN",
//     MEMBER: "MEMBER",
// } as const;

// type AuthRole = keyof typeof USER_ROLE;

// const auth = (...requiredRoles: AuthRole[]) => {
//     return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//         // 🔐 cookie token
//         const tokenFromCookie = req.cookies?.token;

//         // 🔐 header token (SAFE VERSION)
//         const authHeader = req.headers.authorization;

//         const tokenFromHeader =
//             authHeader && authHeader.startsWith("Bearer ")
//                 ? authHeader.split(" ")[1]
//                 : null;

//         const token = tokenFromCookie || tokenFromHeader;

//         if (!token) {
//             throw new AppError(
//                 httpStatus.UNAUTHORIZED,
//                 "Unauthorized! Token missing."
//             );
//         }

//         // 🔐 secret
//         const secretKey =
//             config.jwt_access_secret || process.env.JWT_ACCESS_SECRET;

//         if (!secretKey) {
//             throw new AppError(
//                 httpStatus.INTERNAL_SERVER_ERROR,
//                 "JWT secret is missing!"
//             );
//         }

//         // 🔐 verify token
//         let decoded: JwtPayload;

//         try {
//             decoded = jwt.verify(token, secretKey) as JwtPayload;
//         } catch {
//             throw new AppError(
//                 httpStatus.UNAUTHORIZED,
//                 "Invalid or expired token!"
//             );
//         }

//         const email = decoded.email;

//         if (!email) {
//             throw new AppError(
//                 httpStatus.UNAUTHORIZED,
//                 "Invalid token payload!"
//             );
//         }

//         // 🧑‍💻 user check
//         const user = await prisma.user.findUnique({
//             where: { email },
//         });

//         if (!user || user.status !== "ACTIVE") {
//             throw new AppError(
//                 httpStatus.FORBIDDEN,
//                 "User not found or inactive!"
//             );
//         }

//         const userRole = user.role.toUpperCase() as AuthRole;

//         // 🔐 role check
//         if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
//             throw new AppError(
//                 httpStatus.FORBIDDEN,
//                 "You do not have permission!"
//             );
//         }

//         // ✅ attach user
//         req.user = {
//             id: user.id,
//             email: user.email,
//             role: userRole,
//             ...decoded,
//         };

//         next();
//     });
// };

// export default auth;

// ######################################################################################################## 



// import { NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import config from '../config';
// import AppError from '../errors/AppError';
// import catchAsync from '../utils/catchAsync';
// import { prisma } from '../lib/prisma';

// export const USER_ROLE = {
//     ADMIN: 'ADMIN',
//     MEMBER: 'MEMBER',
// } as const;

// type AuthRole = keyof typeof USER_ROLE;

// const auth = (...requiredRoles: AuthRole[]) => {
//     return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//         // 🔐 ১. হেডার থেকে টোকেন কালেক্ট করা
//         const authHeader = req.headers.authorization;

//         if (!authHeader) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized! Authorization header is missing.');
//         }

//         // 🔐 ২. টোকেন এক্সট্র্যাক্ট করা (Bearer প্রিফিক্স হ্যান্ডেল করা - Case Insensitive)
//         let token = authHeader.trim();

//         if (authHeader.toLowerCase().startsWith('bearer ')) {
//             token = authHeader.substring(7).trim();
//         }

//         if (!token) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Token is missing!');
//         }

//         // 🔐 ৩. টোকেন ভেরিফাই করা
//         const secretKey = config.jwt_access_secret || process.env.JWT_ACCESS_SECRET;

//         if (!secretKey) {
//             throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'JWT configuration secret is missing on server.');
//         }

//         let decoded: JwtPayload;

//         try {
//             decoded = jwt.verify(token, secretKey) as JwtPayload;
//         } catch (error: any) {
//             if (error.name === 'TokenExpiredError') {
//                 throw new AppError(httpStatus.UNAUTHORIZED, 'Token has expired! Please login again.');
//             }
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token!');
//         }

//         const { role, email } = decoded;

//         if (!role || !email) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload data!');
//         }

//         // 🧑‍💻 ৪. ডাটাবেজে ইউজার চেক করা
//         const user = await prisma.user.findUnique({
//             where: { email },
//         });

//         if (!user) {
//             throw new AppError(httpStatus.NOT_FOUND, 'This user was not found!');
//         }

//         if (user.status !== 'ACTIVE') {
//             throw new AppError(httpStatus.FORBIDDEN, 'Your account is deactivated!');
//         }

//         // 🔐 ৫. রোল পারমিশন চেক করা (Strict Case Matching)
//         const userRole = role.toString().toUpperCase() as AuthRole;

//         if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
//             throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to access this route!');
//         }

//         // ✅ ৬. সফল হলে রিকোয়েস্টে ইউজার ডাটা এটাচ করা
//         req.user = {
//             id: user.id,
//             userId: user.id, // আপনার পূর্ববর্তী প্রজেক্ট এবং এই প্রজেক্টের কন্ট্রোলারের সেফটির জন্য দুটি নামই রাখা হলো
//             email: user.email,
//             role: userRole,
//             ...decoded,
//         };

//         next();
//     });
// };

// export default auth;


// ####################################################################################################################



// import { NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import config from '../config';
// import AppError from '../errors/AppError';
// import catchAsync from '../utils/catchAsync';
// import { prisma } from '../lib/prisma';


// export const USER_ROLE = {
//     ADMIN: 'ADMIN',
//     MEMBER: 'MEMBER',
// } as const;

// type AuthRole = keyof typeof USER_ROLE;

// const auth = (...requiredRoles: AuthRole[]) => {
//     return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//         const authHeader = req.headers.authorization;

//         if (!authHeader) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized! Authorization header is missing.');
//         }

//         let token = authHeader.trim();
//         if (authHeader.startsWith('Bearer ')) {
//             token = authHeader.substring(7).trim();
//         }

//         if (!token) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Token is missing!');
//         }

//         const secretKey = config.jwt_access_secret || process.env.JWT_ACCESS_SECRET;
//         if (!secretKey) {
//             throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'JWT configuration secret is missing on server.');
//         }

//         let decoded: JwtPayload;
//         try {
//             decoded = jwt.verify(token, secretKey) as JwtPayload;
//         } catch (error: any) {
//             if (error.name === 'TokenExpiredError') {
//                 throw new AppError(httpStatus.UNAUTHORIZED, 'Token has expired! Please login again.');
//             }
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token!');
//         }

//         const { role, email } = decoded;
//         if (!role || !email) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload data!');
//         }

//         const user = await prisma.user.findUnique({
//             where: { email },
//         });

//         if (!user) {
//             throw new AppError(httpStatus.NOT_FOUND, 'This user was not found!');
//         }

//         if (user.status !== 'ACTIVE') {
//             throw new AppError(httpStatus.FORBIDDEN, 'Your account is deactivated!');
//         }

//         const userRole = role.toString().toUpperCase() as AuthRole;
//         if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
//             throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to access this route!');
//         }

//         req.user = {
//             id: user.id,
//             userId: user.id,
//             email: user.email,
//             role: userRole,
//             ...decoded,
//         };

//         next();
//     });
// };

// export default auth;




import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import { prisma } from '../lib/prisma';



export const USER_ROLE = {
    ADMIN: 'ADMIN',
    MEMBER: 'MEMBER',
} as const;

type AuthRole = keyof typeof USER_ROLE;



const auth = (...requiredRoles: AuthRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        console.log("\n========== AUTH DEBUG ==========");
        console.log("Method:", req.method);
        console.log("URL:", req.originalUrl);
        console.log("Headers:", req.headers);
        console.log("Authorization Header:", req.headers.authorization);
        console.log("================================\n");

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            console.log("❌ Authorization header is missing!");
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                "You are not authorized! Authorization header is missing."
            );
        }

        let token = authHeader.trim();

        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7).trim();
        }

        console.log("Extracted Token:", token);

        if (!token) {
            console.log("❌ Token is empty!");
            throw new AppError(httpStatus.UNAUTHORIZED, "Token is missing!");
        }

        const secretKey =
            config.jwt_access_secret || process.env.JWT_ACCESS_SECRET;

        if (!secretKey) {
            console.log("❌ JWT Secret Missing");
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "JWT configuration secret is missing."
            );
        }

        let decoded: JwtPayload;

        try {
            decoded = jwt.verify(token, secretKey) as JwtPayload;
            console.log("✅ Decoded Token:", decoded);
        } catch (error: any) {
            console.log("❌ JWT Verify Error:", error.message);

            if (error.name === "TokenExpiredError") {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    "Token has expired! Please login again."
                );
            }

            throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token!");
        }

        const { role, email } = decoded;

        console.log("Role:", role);
        console.log("Email:", email);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        console.log("DB User:", user);

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "This user was not found!");
        }

        if (user.status !== "ACTIVE") {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "Your account is deactivated!"
            );
        }

        const userRole = role.toString().toUpperCase() as AuthRole;

        console.log("Required Roles:", requiredRoles);
        console.log("User Role:", userRole);

        if (
            requiredRoles.length > 0 &&
            !requiredRoles.includes(userRole)
        ) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "You do not have permission to access this route!"
            );
        }

        req.user = {
            id: user.id,
            userId: user.id,
            email: user.email,
            role: userRole,
            ...decoded,
        };

        console.log("✅ Authentication Success");
        console.log("================================\n");

        next();
    });
};

export default auth;