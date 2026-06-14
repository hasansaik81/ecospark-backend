import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardService } from './dashboard.service';

// ═══════════════════════════════════════════════════════════════════════════════
//  ADMIN CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Admin: Get Dashboard Stats ─────────────────────────────────────────────────
const getAdminStats = catchAsync(async (_req: Request, res: Response) => {
    const result = await DashboardService.getAdminStats();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin dashboard stats retrieved successfully',
        data: result,
    });
});

// ─── Admin: Get All Users ───────────────────────────────────────────────────────
const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
    const result = await DashboardService.getAllUsers();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All users retrieved successfully',
        data: result,
    });
});

// ─── Admin: Update User Status ──────────────────────────────────────────────────
const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { status } = req.body;

    const result = await DashboardService.updateUserStatus(id, status);

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

    const result = await DashboardService.updateUserRole(id, role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User role updated successfully',
        data: result,
    });
});

// ─── Admin: Get All Ideas ───────────────────────────────────────────────────────
const getAllIdeasAdmin = catchAsync(async (_req: Request, res: Response) => {
    const result = await DashboardService.getAllIdeasAdmin();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All ideas retrieved successfully',
        data: result,
    });
});

// ─── Admin: Approve Idea ────────────────────────────────────────────────────────
const approveIdea = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const result = await DashboardService.approveIdea(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Idea approved successfully',
        data: result,
    });
});

// ─── Admin: Reject Idea ─────────────────────────────────────────────────────────
const rejectIdea = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const result = await DashboardService.rejectIdea(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Idea rejected successfully',
        data: result,
    });
});

// ─── Admin: Delete Idea ─────────────────────────────────────────────────────────
const adminDeleteIdea = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    await DashboardService.adminDeleteIdea(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Idea deleted successfully',
        data: null,
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  MEMBER CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Member: Get My Dashboard Stats ────────────────────────────────────────────
const getMemberStats = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;

    const result = await DashboardService.getMemberStats(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Member dashboard stats retrieved successfully',
        data: result,
    });
});

// ─── Member: Get My Ideas ───────────────────────────────────────────────────────
const getMyIdeas = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;

    const result = await DashboardService.getMyIdeas(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My ideas retrieved successfully',
        data: result,
    });
});

export const DashboardController = {
    // Admin
    getAdminStats,
    getAllUsers,
    updateUserStatus,
    updateUserRole,
    getAllIdeasAdmin,
    approveIdea,
    rejectIdea,
    adminDeleteIdea,
    // Member
    getMemberStats,
    getMyIdeas,
};