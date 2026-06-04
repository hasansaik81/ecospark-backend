import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { UserSelectedFields } from './user.constant';
import { TChangePassword, TUpdateProfile } from './user.interface';

// ─── Get My Profile ────────────────────────────────────────────────────────────
const getMyProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
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

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user;
};

// ─── Update My Profile ─────────────────────────────────────────────────────────
const updateMyProfile = async (userId: string, payload: TUpdateProfile) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: payload,
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

    return updatedUser;
};

// ─── Change Password ────────────────────────────────────────────────────────────
const changePassword = async (
    userId: string,
    payload: TChangePassword,
) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Verify current password
    const isPasswordMatched = await bcrypt.compare(
        payload.currentPassword,
        user.password,
    );

    if (!isPasswordMatched) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'Current password is incorrect',
        );
    }

    // Ensure new password differs from current
    const isSamePassword = await bcrypt.compare(
        payload.newPassword,
        user.password,
    );

    if (isSamePassword) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'New password must be different from the current password',
        );
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(
        payload.newPassword,
        config.bcrypt_salt_rounds,
    );

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
};

// ─── Admin: Get All Users ───────────────────────────────────────────────────────
const getAllUsers = async () => {
    const users = await prisma.user.findMany({
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
        orderBy: { createdAt: 'desc' },
    });

    return users;
};

// ─── Admin: Get Single User ─────────────────────────────────────────────────────
const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
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

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user;
};

// ─── Admin: Update User Status ──────────────────────────────────────────────────
const updateUserStatus = async (id: string, status: 'ACTIVE' | 'DEACTIVATED') => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: { status },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            updatedAt: true,
        },
    });

    return updatedUser;
};

// ─── Admin: Update User Role ────────────────────────────────────────────────────
const updateUserRole = async (id: string, role: 'ADMIN' | 'MEMBER') => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: { role },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            updatedAt: true,
        },
    });

    return updatedUser;
};

export const UserService = {
    getMyProfile,
    updateMyProfile,
    changePassword,
    getAllUsers,
    getUserById,
    updateUserStatus,
    updateUserRole,
};