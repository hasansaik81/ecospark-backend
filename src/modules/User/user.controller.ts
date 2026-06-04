import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

// ─── Get My Profile ────────────────────────────────────────────────────────────
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;

    const result = await UserService.getMyProfile(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile retrieved successfully',
        data: result,
    });
});

// ─── Update My Profile ─────────────────────────────────────────────────────────
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;

    const result = await UserService.updateMyProfile(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile updated successfully',
        data: result,
    });
});

// ─── Change Password ────────────────────────────────────────────────────────────
const changePassword = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;

    const result = await UserService.changePassword(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.message,
        data: null,
    });
});

// ─── Admin: Get All Users ───────────────────────────────────────────────────────
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getAllUsers();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: result,
    });
});

// ─── Admin: Get Single User ─────────────────────────────────────────────────────
const getUserById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await UserService.getUserById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});

// ─── Admin: Update User Status ──────────────────────────────────────────────────
const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { status } = req.body;

    const result = await UserService.updateUserStatus(id, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User status updated successfully',
        data: result,
    });
});

// ─── Admin: Update User Role ────────────────────────────────────────────────────
const updateUserRole = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { role } = req.body;

    const result = await UserService.updateUserRole(id, role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User role updated successfully',
        data: result,
    });
});

export const UserController = {
    getMyProfile,
    updateMyProfile,
    changePassword,
    getAllUsers,
    getUserById,
    updateUserStatus,
    updateUserRole,
};