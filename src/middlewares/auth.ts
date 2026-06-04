import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import { prisma } from '../lib/prisma';

export const USER_ROLE = {
    member: 'member',
    admin: 'admin',
} as const;

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let token = req.headers.authorization;

        // checking if the token is missing
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }

        // Handle Bearer <token> format
        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }

        // checking if the given token is valid
        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(
                token,
                config.jwt_access_secret as string,
            ) as JwtPayload;
        } catch (error) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }

        const { role, email } = decoded;

        // checking if the user exists
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
        }

        // checking if user status is ACTIVE
        if (user.status !== 'ACTIVE') {
            throw new AppError(httpStatus.FORBIDDEN, 'Your account is deactivated');
        }

        // Normalize roles for case-insensitive check (e.g. DB 'MEMBER' -> 'member')
        const userRole = role.toLowerCase() as keyof typeof USER_ROLE;

        if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }

        req.user = decoded;
        next();
    });
};

export default auth;
