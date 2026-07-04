



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

       

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            console.log(" Authorization header is missing!");
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
            console.log(" Token is empty!");
            throw new AppError(httpStatus.UNAUTHORIZED, "Token is missing!");
        }

        const secretKey =
            config.jwt_access_secret || process.env.JWT_ACCESS_SECRET;

        if (!secretKey) {
            console.log(" JWT Secret Missing");
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "JWT configuration secret is missing."
            );
        }

        let decoded: JwtPayload;

        try {
            decoded = jwt.verify(token, secretKey) as JwtPayload;
            console.log(" Decoded Token:", decoded);
        } catch (error: any) {
            console.log(" JWT Verify Error:", error.message);

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

       

        next();
    });
};

export default auth;