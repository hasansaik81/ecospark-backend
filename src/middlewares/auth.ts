// // import { NextFunction, Request, Response } from 'express';
// // import httpStatus from 'http-status';
// // import jwt, { JwtPayload } from 'jsonwebtoken';
// // import config from '../config';
// // import AppError from '../errors/AppError';
// // import catchAsync from '../utils/catchAsync';
// // import { prisma } from '../lib/prisma';

// // export const USER_ROLE = {
// //     member: 'member',
// //     admin: 'admin',
// // } as const;

// // type AuthRole = keyof typeof USER_ROLE | 'ADMIN' | 'MEMBER';

// // const auth = (...requiredRoles: AuthRole[]) => {
// //     return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
// //         let token = req.headers.authorization;

// //         // checking if the token is missing
// //         if (!token) {
// //             throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
// //         }

// //         // Handle Bearer <token> format
// //         if (token.startsWith('Bearer ')) {
// //             token = token.split(' ')[1];
// //         }

// //         // checking if the given token is valid
// //         let decoded: JwtPayload;
// //         try {
// //             decoded = jwt.verify(
// //                 token,
// //                 config.jwt_access_secret as string,
// //             ) as JwtPayload;
// //         } catch (error) {
// //             throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
// //         }

// //         const { role, email } = decoded;

// //         // checking if the user exists
// //         const user = await prisma.user.findUnique({ where: { email } });

// //         if (!user) {
// //             throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
// //         }

// //         // checking if user status is ACTIVE
// //         if (user.status !== 'ACTIVE') {
// //             throw new AppError(httpStatus.FORBIDDEN, 'Your account is deactivated');
// //         }

// //         // Normalize roles for case-insensitive check (e.g. DB 'MEMBER' -> 'member')
// //         const userRole = role.toLowerCase() as keyof typeof USER_ROLE;
// //         const normalizedRequiredRoles = requiredRoles.map((role) =>
// //             role.toLowerCase() as keyof typeof USER_ROLE,
// //         );

// //         if (normalizedRequiredRoles.length > 0 && !normalizedRequiredRoles.includes(userRole)) {
// //             throw new AppError(
// //                 httpStatus.UNAUTHORIZED,
// //                 'You are not authorized!',
// //             );
// //         }

// //         req.user = {
// //             ...decoded,
// //             id: user.id,      // এখন কন্ট্রোলারে req.user.id চমৎকারভাবে কাজ করবে
// //             email: user.email,
// //             role: userRole,
// //         };
// //         next();
// //     });
// // };

// // export default auth;





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

//         // 🔐 1. Get token
//         const authHeader = req.headers.authorization;

//         if (!authHeader || typeof authHeader !== 'string') {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
//         }

//         const token = authHeader.startsWith('Bearer ')
//             ? authHeader.split(' ')[1]
//             : authHeader;

//         if (!token) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
//         }

//         // 🔐 2. Verify token
//         let decoded: JwtPayload;
        

//         try {
//             decoded = jwt.verify(
                
//                 token,
//                 config.jwt_access_secret as string,
//             ) as JwtPayload;
//         } catch (error: any) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token!');
//         }

//         const { role, email } = decoded;

//         if (!role || !email) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload!');
//         }

//         // 🧑‍💻 3. Check user in DB
//         const user = await prisma.user.findUnique({
//             where: { email },
//         });

//         if (!user) {
//             throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
//         }

//         if (user.status !== 'ACTIVE') {
//             throw new AppError(httpStatus.FORBIDDEN, 'Your account is deactivated');
//         }

//         // 🔐 4. Role check (STRICT & SAFE)
//         const userRole = role as AuthRole;

//         if (
//             requiredRoles.length > 0 &&
//             !requiredRoles.includes(userRole)
//         ) {
//             throw new AppError(
//                 httpStatus.UNAUTHORIZED,
//                 'You are not authorized!'
//             );
//         }

//         // ✅ 5. Attach user to request
//         req.user = {
//             ...decoded,
//             id: user.id,
//             email: user.email,
//             role: userRole,
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

//         // 🔐 1. Get token
//         const authHeader = req.headers.authorization;

//         if (!authHeader || typeof authHeader !== 'string') {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
//         }

//         const token = authHeader.startsWith('Bearer ')
//             ? authHeader.split(' ')[1]
//             : authHeader;

//         if (!token) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
//         }

//         // 🔐 2. Verify token
//         let decoded: JwtPayload;

//         // 🛠️ ট্রাবলশুটিং লগ: চেক করা হচ্ছে সিক্রেট কী আদৌ লোড হয়েছে কিনা
//         const secretKey = config.jwt_access_secret || process.env.JWT_ACCESS_SECRET;
        
//         if (!secretKey) {
//             console.error("❌ [JWT ERROR]: Your JWT Access Secret is UNDEFINED! Please check your .env file or config.");
//         }

//         try {
//             decoded = jwt.verify(
//                 token,
//                 secretKey as string,
//             ) as JwtPayload;
//         } catch (error: any) {
//             // 💡 আপনার VS Code টার্মিনালে আসল এররটি প্রিন্ট হবে (যেমন: TokenExpiredError বা JsonWebTokenError)
//             console.error("❌ [JWT VERIFICATION FAILED]:", error.message);
            
//             throw new AppError(httpStatus.UNAUTHORIZED, `Invalid or expired token! (${error.message})`);
//         }

//         const { role, email } = decoded;

//         if (!role || !email) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload!');
//         }

//         // 🧑‍💻 3. Check user in DB
//         const user = await prisma.user.findUnique({
//             where: { email },
//         });

//         if (!user) {
//             throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
//         }

//         if (user.status !== 'ACTIVE') {
//             throw new AppError(httpStatus.FORBIDDEN, 'Your account is deactivated');
//         }

//         // 🔐 4. Role check (STRICT & SAFE)
//         // টোকেনের রোল ছোট হাতের থাকলে সেটিকে বড় হাতের করে ম্যাচ করা হচ্ছে
//         const userRole = role.toUpperCase() as AuthRole;

//         if (
//             requiredRoles.length > 0 &&
//             !requiredRoles.includes(userRole)
//         ) {
//             throw new AppError(
//                 httpStatus.UNAUTHORIZED,
//                 'You are not authorized!'
//             );
//         }

//         // ✅ 5. Attach user to request
//         req.user = {
//             ...decoded,
//             userId: user.id, // কন্ট্রোলারের user.userId এভেলেবল করার জন্য
//             id: user.id,
//             email: user.email,
//             role: userRole,
//         };

//         next();
//     });
// };

// export default auth;




// src/middlewares/auth.ts



// src/middlewares/auth.ts
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
//         // ✅ 1. Get token from header
//         const authHeader = req.headers.authorization;

//         console.log('🔍 ===== AUTH DEBUG START =====');
//         console.log('📝 Raw Authorization Header:', authHeader);

//         // Check if header exists
//         if (!authHeader) {
//             console.log('❌ No authorization header found');
//             throw new AppError(
//                 httpStatus.UNAUTHORIZED, 
//                 'Authorization header is missing!'
//             );
//         }

//         // Check if header format is correct
//         if (!authHeader.startsWith('Bearer ')) {
//             console.log('❌ Header does not start with Bearer');
//             throw new AppError(
//                 httpStatus.UNAUTHORIZED, 
//                 'Invalid authorization format! Use: Bearer <your_token>'
//             );
//         }

//         // Extract token
//         const token = authHeader.split(' ')[1];

//         console.log('📝 Extracted Token:', token);
//         console.log('📝 Token Length:', token?.length || 0);
//         console.log('📝 Token Parts (by dot):', token?.split('.').length || 0);

//         // 🔥 CRITICAL: Check if token has exactly 3 parts
//         if (!token || token.trim() === '' || token === 'null' || token === 'undefined') {
//             console.log('❌ Token is empty or null');
//             throw new AppError(
//                 httpStatus.UNAUTHORIZED, 
//                 'Token is missing or invalid!'
//             );
//         }

//         const tokenParts = token.split('.');
//         if (tokenParts.length !== 3) {
//             console.log(`❌ Token has ${tokenParts.length} parts, but should have 3`);
//             console.log('📝 Token preview:', token.substring(0, 100));
            
//             // Check if token might have extra spaces or newlines
//             const cleanedToken = token.replace(/\s/g, '');
//             console.log('📝 Cleaned Token (no spaces):', cleanedToken.substring(0, 100));
//             console.log('📝 Cleaned parts:', cleanedToken.split('.').length);
            
//             throw new AppError(
//                 httpStatus.UNAUTHORIZED, 
//                 `Invalid token format! Token must have 3 parts separated by dots. Found ${tokenParts.length} parts.`
//             );
//         }

//         console.log('✅ Token has valid format (3 parts)');

//         // 🔐 2. Get secret key
//         const secretKey = config.jwt_access_secret || process.env.JWT_ACCESS_SECRET;
        
//         console.log('🔑 Secret Key exists?', !!secretKey);
//         if (secretKey) {
//             console.log('🔑 Secret Key length:', secretKey.length);
//             console.log('🔑 Secret Key preview:', secretKey.substring(0, 10) + '...');
//         }
        
//         if (!secretKey) {
//             console.error("❌ CRITICAL: JWT_ACCESS_SECRET is not defined!");
//             throw new AppError(
//                 httpStatus.INTERNAL_SERVER_ERROR, 
//                 'Server configuration error.'
//             );
//         }

//         // ✅ 3. Verify token
//         let decoded: JwtPayload;

//         try {
//             console.log('🔄 Attempting to verify token...');
//             decoded = jwt.verify(token, secretKey) as JwtPayload;
//             console.log('✅ Token verified successfully for:', decoded.email);
            
//         } catch (error: any) {
//             console.error('❌ JWT Verification Failed');
//             console.error('Error Name:', error.name);
//             console.error('Error Message:', error.message);
            
//             // Handle specific errors
//             if (error.name === 'TokenExpiredError') {
//                 throw new AppError(
//                     httpStatus.UNAUTHORIZED, 
//                     'Token has expired! Please login again.'
//                 );
//             } else if (error.name === 'JsonWebTokenError') {
//                 throw new AppError(
//                     httpStatus.UNAUTHORIZED, 
//                     `Invalid token! ${error.message}`
//                 );
//             } else if (error.name === 'NotBeforeError') {
//                 throw new AppError(
//                     httpStatus.UNAUTHORIZED, 
//                     'Token is not active yet!'
//                 );
//             } else {
//                 throw new AppError(
//                     httpStatus.UNAUTHORIZED, 
//                     `Authentication failed: ${error.message}`
//                 );
//             }
//         }

//         // ... rest of the code (user validation, role check, etc.)
//         console.log('🔍 ===== AUTH DEBUG END =====');
        
//         // Validate decoded payload
//         const { role, email } = decoded;

//         if (!email) {
//             throw new AppError(
//                 httpStatus.UNAUTHORIZED, 
//                 'Invalid token payload! Email is missing.'
//             );
//         }

//         if (!role) {
//             throw new AppError(
//                 httpStatus.UNAUTHORIZED, 
//                 'Invalid token payload! Role is missing.'
//             );
//         }

//         // Check user in database
//         const user = await prisma.user.findUnique({
//             where: { email: email },
//         });

//         if (!user) {
//             throw new AppError(
//                 httpStatus.NOT_FOUND, 
//                 'User not found!'
//             );
//         }

//         if (user.status !== 'ACTIVE') {
//             throw new AppError(
//                 httpStatus.FORBIDDEN, 
//                 'Your account is deactivated.'
//             );
//         }

//         const userRole = role.toString().toUpperCase() as AuthRole;
//         const isValidRole = Object.values(USER_ROLE).includes(userRole);

//         if (!isValidRole) {
//             throw new AppError(
//                 httpStatus.UNAUTHORIZED, 
//                 'Invalid role in token!'
//             );
//         }

//         if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
//             throw new AppError(
//                 httpStatus.FORBIDDEN, 
//                 `Access denied! Required roles: ${requiredRoles.join(', ')}`
//             );
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







// src/middlewares/auth.ts - সম্পূর্ণ নতুন কোড
// import { NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import config from '../config';
// import AppError from '../errors/AppError';
// import catchAsync from '../utils/catchAsync';
// import { prisma } from '../lib/prisma';
// import fs from 'fs';
// import path from 'path';

// export const USER_ROLE = {
//     ADMIN: 'ADMIN',
//     MEMBER: 'MEMBER',
// } as const;

// type AuthRole = keyof typeof USER_ROLE;

// // ✅ Token ডিবাগ করার জন্য ফাংশন
// const debugToken = (token: string, stage: string) => {
//     const debugInfo = {
//         stage,
//         timestamp: new Date().toISOString(),
//         tokenLength: token?.length || 0,
//         tokenPreview: token?.substring(0, 50) || 'empty',
//         dotCount: (token?.match(/\./g) || []).length,
//         parts: token?.split('.')?.length || 0,
//         hasSpaces: token?.includes(' ') || false,
//         hasNewlines: token?.includes('\n') || false,
//         hasQuotes: token?.includes('"') || false,
//         tokenChars: token?.split('').map(c => c.charCodeAt(0)) || [],
//     };
    
//     console.log(`\n🔍 DEBUG [${stage}]:`, JSON.stringify(debugInfo, null, 2));
    
//     // টোকেনটি ফাইলে সেভ করুন (ডিবাগের জন্য)
//     try {
//         const logFile = path.join(process.cwd(), 'token-debug.log');
//         fs.appendFileSync(logFile, JSON.stringify(debugInfo) + '\n');
//     } catch (e) {
//         // Ignore file write errors
//     }
    
//     return debugInfo;
// };

// const auth = (...requiredRoles: AuthRole[]) => {
//     return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//         console.log('\n🚀 ========================================');
//         console.log('🚀 AUTHENTICATION STARTED');
//         console.log('🚀 ========================================');
//         console.log('📝 Request URL:', req.url);
//         console.log('📝 Request Method:', req.method);
//         console.log('📝 Headers:', JSON.stringify(req.headers, null, 2));

//         // ✅ 1. GET AUTHORIZATION HEADER
//         const authHeader = req.headers.authorization;
//         debugToken(authHeader as string, 'RAW_HEADER');

//         if (!authHeader) {
//             console.log('❌ No authorization header found');
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Authorization header is missing!');
//         }

//         // ✅ 2. CHECK BEARER FORMAT
//         if (!authHeader.startsWith('Bearer ')) {
//             console.log('❌ Invalid format - does not start with Bearer');
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid format! Use: Bearer <token>');
//         }

//         // ✅ 3. EXTRACT TOKEN - METHOD 1 (সাবস্ট্রিং)
//         let token1 = authHeader.substring(7); // Remove 'Bearer '
//         debugToken(token1, 'AFTER_SUBSTRING');

//         // ✅ 4. EXTRACT TOKEN - METHOD 2 (স্প্লিট)
//         let token2 = authHeader.split(' ')[1];
//         debugToken(token2, 'AFTER_SPLIT');

//         // ✅ 5. COMPARE BOTH METHODS
//         console.log('📝 Token1 (substring):', token1);
//         console.log('📝 Token2 (split):', token2);
//         console.log('📝 Tokens match?', token1 === token2);

//         // Use token1 as primary
//         let token = token1;

//         // ✅ 6. CLEAN THE TOKEN
//         console.log('\n🔧 Cleaning token...');
//         token = token.trim();
//         token = token.replace(/\s/g, '');
//         token = token.replace(/\n/g, '');
//         token = token.replace(/\r/g, '');
//         token = token.replace(/^["']|["']$/g, '');
//         token = token.replace(/^\{|\}$/g, '');
//         token = token.replace(/,/g, '');
        
//         debugToken(token, 'AFTER_CLEANING');

//         // ✅ 7. CHECK FOR URL ENCODING
//         console.log('\n🔍 Checking for URL encoding...');
//         let decodedToken = token;
//         try {
//             decodedToken = decodeURIComponent(token);
//             if (decodedToken !== token) {
//                 console.log('✅ Token was URL encoded!');
//                 debugToken(decodedToken, 'AFTER_URL_DECODE');
//                 token = decodedToken;
//             } else {
//                 console.log('✅ Token is not URL encoded');
//             }
//         } catch (e) {
//             console.log('❌ Failed to decode URL');
//         }

//         // ✅ 8. CHECK FOR BASE64
//         console.log('\n🔍 Checking if token is valid JWT...');
//         const parts = token.split('.');
//         console.log(`📝 Token has ${parts.length} parts`);

//         // Show each part
//         parts.forEach((part, index) => {
//             console.log(`📝 Part ${index + 1}: ${part.substring(0, 30)}... (length: ${part.length})`);
//         });

//         // ✅ 9. IF TOKEN HAS 1 PART - TRY TO FIX
//         if (parts.length === 1 && token.length > 0) {
//             console.log('\n⚠️ Token has only 1 part! Trying to fix...');
            
//             // Check if token might have been truncated
//             console.log('📝 Full token:', token);
//             console.log('📝 Token length:', token.length);
            
//             // Try to see if it's actually 3 parts but dots got removed
//             // Maybe dots were encoded as %2E
//             if (token.includes('%2E')) {
//                 console.log('🔍 Found %2E in token, replacing with .');
//                 token = token.replace(/%2E/g, '.');
//                 const newParts = token.split('.');
//                 console.log(`📝 After replacement: ${newParts.length} parts`);
//                 debugToken(token, 'AFTER_REPLACING_DOTS');
//             }
            
//             // Try to see if token has been split by something
//             if (token.includes(' ')) {
//                 console.log('🔍 Token has spaces, removing them');
//                 token = token.replace(/\s/g, '');
//             }
//         }

//         // ✅ 10. FINAL VALIDATION
//         const finalParts = token.split('.');
//         console.log(`\n📝 Final parts count: ${finalParts.length}`);
        
//         if (finalParts.length !== 3) {
//             console.log('\n❌❌❌ INVALID TOKEN FORMAT ❌❌❌');
//             console.log('Parts count:', finalParts.length);
//             console.log('Token preview:', token.substring(0, 100));
//             console.log('Token length:', token.length);
//             console.log('Token characters:', token.split('').map(c => c.charCodeAt(0)).join(','));
            
//             throw new AppError(
//                 httpStatus.UNAUTHORIZED, 
//                 `Invalid token format! Expected 3 parts, found ${finalParts.length}. Token length: ${token.length}`
//             );
//         }

//         console.log('✅ Token format is valid!');
//         console.log('📝 Header:', finalParts[0].substring(0, 20) + '...');
//         console.log('📝 Payload:', finalParts[1].substring(0, 20) + '...');
//         console.log('📝 Signature:', finalParts[2].substring(0, 20) + '...');

//         // ✅ 11. VERIFY TOKEN
//         const secretKey = config.jwt_access_secret || process.env.JWT_ACCESS_SECRET;
        
//         if (!secretKey) {
//             console.error("❌ JWT_ACCESS_SECRET is not defined!");
//             throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Server configuration error.');
//         }

//         let decoded: JwtPayload;

//         try {
//             decoded = jwt.verify(token, secretKey) as JwtPayload;
//             console.log('✅ Token verified successfully!');
//             console.log('📝 Email:', decoded.email);
//             console.log('📝 Role:', decoded.role);
//         } catch (error: any) {
//             console.error('❌ Verification error:', error.message);
//             console.error('❌ Error type:', error.name);
            
//             if (error.name === 'TokenExpiredError') {
//                 throw new AppError(httpStatus.UNAUTHORIZED, 'Token expired! Please login again.');
//             } else if (error.name === 'JsonWebTokenError') {
//                 throw new AppError(httpStatus.UNAUTHORIZED, `Invalid token! ${error.message}`);
//             } else {
//                 throw new AppError(httpStatus.UNAUTHORIZED, `Authentication failed: ${error.message}`);
//             }
//         }

//         // ✅ 12. CHECK USER
//         const { role, email, userId } = decoded;

//         if (!email || !role) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload!');
//         }

//         const user = await prisma.user.findUnique({
//             where: { email },
//         });

//         if (!user) {
//             throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
//         }

//         if (user.status !== 'ACTIVE') {
//             throw new AppError(httpStatus.FORBIDDEN, 'Account is deactivated!');
//         }

//         // ✅ 13. CHECK ROLE
//         const userRole = role.toString().toUpperCase() as AuthRole;
        
//         if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
//             throw new AppError(
//                 httpStatus.FORBIDDEN, 
//                 `Access denied! Required roles: ${requiredRoles.join(', ')}. Your role: ${userRole}`
//             );
//         }

//         // ✅ 14. ATTACH USER
//         req.user = {
//             id: user.id,
//             userId: user.id,
//             email: user.email,
//             role: userRole,
//             ...decoded,
//         };

//         console.log('✅ Authentication successful for:', user.email);
//         console.log('🚀 ========================================\n');
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
        
        // 🔐 ১. হেডার থেকে টোকেন কালেক্ট করা
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized! Authorization header is missing.');
        }

        // 🔐 ২. Bearer ফরম্যাট চেক এবং টোকেন আলাদা করা
        if (!authHeader.startsWith('Bearer ')) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token format! Use: Bearer <token>');
        }

        const token = authHeader.substring(7).trim();

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Token is missing!');
        }

        // 🔐 ৩. টোকেন ভেরিফাই করা
        const secretKey = config.jwt_access_secret || process.env.JWT_ACCESS_SECRET;
        
        if (!secretKey) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'JWT configuration secret is missing on server.');
        }

        let decoded: JwtPayload;

        try {
            decoded = jwt.verify(token, secretKey) as JwtPayload;
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                throw new AppError(httpStatus.UNAUTHORIZED, 'Token has expired! Please login again.');
            }
            throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token!');
        }

        const { role, email } = decoded;

        if (!role || !email) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload data!');
        }

        // 🧑‍💻 ৪. ডাটাবেজে ইউজার চেক করা
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'This user was not found!');
        }

        if (user.status !== 'ACTIVE') {
            throw new AppError(httpStatus.FORBIDDEN, 'Your account is deactivated!');
        }

        // 🔐 ৫. রোল পারমিশন চেক করা (Strict Case Matching)
        const userRole = role.toString().toUpperCase() as AuthRole;
        
        if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
            throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to access this route!');
        }

        // ✅ ৬. সফল হলে রিকোয়েস্টে ইউজার ডাটা এটাচ করা
        req.user = {
            id: user.id,
            userId: user.id, // আপনার কন্ট্রোলারের সেফটির জন্য দুটিই রাখা হলো
            email: user.email,
            role: userRole,
            ...decoded,
        };

        next();
    });
};

export default auth;