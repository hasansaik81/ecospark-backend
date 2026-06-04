import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

// Register a new user
const register = async (payload: any) => {
    const isUserExists = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (isUserExists) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(
        payload.password,
        config.bcrypt_salt_rounds,
    );

    const newUser = await prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            profileImage: payload.profileImage || null,
        },
        select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return newUser;
};

// Login user and issue tokens
const login = async (payload: any) => {
    const user = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.status !== 'ACTIVE') {
        throw new AppError(httpStatus.FORBIDDEN, 'Your account is deactivated');
    }

    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwt.sign(
        jwtPayload,
        config.jwt_access_secret as string,
        { expiresIn: config.jwt_access_expires_in as any },
    );

    const refreshToken = jwt.sign(
        jwtPayload,
        config.jwt_refresh_secret as string,
        { expiresIn: config.jwt_refresh_expires_in as any },
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
            role: user.role,
            status: user.status,
        },
        accessToken,
        refreshToken,
    };
};

// Generate a new access token using a refresh token
const refreshToken = async (token: string) => {
    let decoded: JwtPayload;

    try {
        decoded = jwt.verify(
            token,
            config.jwt_refresh_secret as string,
        ) as JwtPayload;
    } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    const { email } = decoded;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.status !== 'ACTIVE') {
        throw new AppError(httpStatus.FORBIDDEN, 'Your account is deactivated');
    }

    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwt.sign(
        jwtPayload,
        config.jwt_access_secret as string,
        { expiresIn: config.jwt_access_expires_in as any },
    );

    return {
        accessToken,
    };
};

export const AuthService = {
    register,
    login,
    refreshToken,
};