// import { Request, Response } from 'express';
// import httpStatus from 'http-status';
// import { JwtPayload } from 'jsonwebtoken';
// import catchAsync from '../../utils/catchAsync';
// import sendResponse from '../../utils/sendResponse';
// import { DashboardService } from './dashboard.service';

// // ═══════════════════════════════════════════════════════════════════════════════
// //  ADMIN CONTROLLERS
// // ═══════════════════════════════════════════════════════════════════════════════

// // ─── Admin: Get Dashboard Stats ─────────────────────────────────────────────────
// const getAdminStats = catchAsync(async (_req: Request, res: Response) => {
//     const result = await DashboardService.getAdminStats();

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Admin dashboard stats retrieved successfully',
//         data: result,
//     });
// });

// // ─── Admin: Get All Users ───────────────────────────────────────────────────────
// const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
//     const result = await DashboardService.getAllUsers();

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'All users retrieved successfully',
//         data: result,
//     });
// });

// // ─── Admin: Update User Status ──────────────────────────────────────────────────
// const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params as { id: string };
//     const { status } = req.body;

//     const result = await DashboardService.updateUserStatus(id, status);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'User status updated successfully',
//         data: result,
//     });
// });

// // ─── Admin: Update User Role ────────────────────────────────────────────────────
// const updateUserRole = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params as { id: string };
//     const { role } = req.body;

//     const result = await DashboardService.updateUserRole(id, role);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'User role updated successfully',
//         data: result,
//     });
// });

// // ─── Admin: Get All Ideas ───────────────────────────────────────────────────────
// const getAllIdeasAdmin = catchAsync(async (_req: Request, res: Response) => {
//     const result = await DashboardService.getAllIdeasAdmin();

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'All ideas retrieved successfully',
//         data: result,
//     });
// });

// // ─── Admin: Approve Idea ────────────────────────────────────────────────────────
// const approveIdea = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params as { id: string };

//     const result = await DashboardService.approveIdea(id);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Idea approved successfully',
//         data: result,
//     });
// });

// // ─── Admin: Reject Idea ─────────────────────────────────────────────────────────
// const rejectIdea = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params as { id: string };

//     const result = await DashboardService.rejectIdea(id, req.body);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Idea rejected successfully',
//         data: result,
//     });
// });

// // ─── Admin: Delete Idea ─────────────────────────────────────────────────────────
// const adminDeleteIdea = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params as { id: string };

//     await DashboardService.adminDeleteIdea(id);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Idea deleted successfully',
//         data: null,
//     });
// });

// // ═══════════════════════════════════════════════════════════════════════════════
// //  MEMBER CONTROLLERS
// // ═══════════════════════════════════════════════════════════════════════════════

// // ─── Member: Get My Dashboard Stats ────────────────────────────────────────────
// const getMemberStats = catchAsync(async (req: Request, res: Response) => {
//     const { userId } = req.user as JwtPayload;

//     const result = await DashboardService.getMemberStats(userId);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Member dashboard stats retrieved successfully',
//         data: result,
//     });
// });

// // ─── Member: Get My Ideas ───────────────────────────────────────────────────────
// const getMyIdeas = catchAsync(async (req: Request, res: Response) => {
//     const { userId } = req.user as JwtPayload;

//     const result = await DashboardService.getMyIdeas(userId);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'My ideas retrieved successfully',
//         data: result,
//     });
// });

// export const DashboardController = {
//     // Admin
//     getAdminStats,
//     getAllUsers,
//     updateUserStatus,
//     updateUserRole,
//     getAllIdeasAdmin,
//     approveIdea,
//     rejectIdea,
//     adminDeleteIdea,
//     // Member
//     getMemberStats,
//     getMyIdeas,
// };





// import { Request, Response } from 'express';
// import httpStatus from 'http-status';
// // import { catchAsync } from '../../shared/catchAsync';
// // import { sendResponse } from '../../shared/sendResponse';
// import { DashboardService } from './dashboard.service';
// import catchAsync from '../../utils/catchAsync';
// import sendResponse from '../../utils/sendResponse';
// import AppError from '../../errors/AppError';
// // ...existing code...
// import { IRequestUserFromToken } from '../User/user.interface'; // <-- adjust path/casing
// // ...existing code...

// // const getDashboardStatsData = catchAsync(
// //     async (req: Request, res: Response) => {
// //         const result = await DashboardService.getDashboardStatsData(
// //             req.user
// //         );


// //         sendResponse(res, {
// //     statusCode: httpStatus.OK,
// //     success: true,
// //     message: 'Dashboard stats retrieved successfully',
// //     data: result,
// // });

// //         // sendResponse(res, {
// //         //     httpStatusCode: httpStatus.OK,
// //         //     success: true,
// //         //     message: 'Dashboard stats retrieved successfully',
// //         //     data: result,
// //         // });
// //     }
// // );


// // const getDashboardStatsData = catchAsync(
// //     async (req: Request, res: Response) => {
// //         if (!req.user) {
// //             throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized user');
// //         }

// //         const result = await DashboardService.getDashboardStatsData(
// //             req.user
// //         );

// //         sendResponse(res, {
// //             statusCode: httpStatus.OK,
// //             success: true,
// //             message: 'Dashboard stats retrieved successfully',
// //             data: result,
// //         });
// //     }
// // );



// // export const DashboardController = {
// //     getDashboardStatsData,
// // };





// // ...existing code...
// const getDashboardStatsData = catchAsync(
//     async (req: Request, res: Response) => {
//         if (!req.user) {
//             throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized user');
//         }

//         // Normalize JWT payload to IRequestUserFromToken
//         const token = req.user as any;
//         const requestUser: IRequestUserFromToken = {
//             userId: token.userId ?? token.id,
//             email: token.email,
//             role: token.role,
//         };

//         const result = await DashboardService.getDashboardStatsData(
//             requestUser
//         );

//         sendResponse(res, {
//             statusCode: httpStatus.OK,
//             success: true,
//             message: 'Dashboard stats retrieved successfully',
//             data: result,
//         });
//     }
// );

// export const DashboardController = {
//     getDashboardStatsData,
// };




import { Request, Response } from 'express';
import httpStatus from 'http-status';

import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import {
    DashboardService,
    IRequestUserFromToken,
} from './dashboard.service';

const getDashboardStatsData = catchAsync(
    async (req: Request, res: Response) => {
        if (!req.user) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'Unauthorized user',
            );
        }

        const token = req.user as {
            userId?: string;
            id?: string;
            email?: string;
            role?: string;
        };

        const userId = token.userId ?? token.id;

        if (!userId) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'User id missing from token',
            );
        }

        if (
            token.role !== 'ADMIN' &&
            token.role !== 'MEMBER'
        ) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                'Invalid user role',
            );
        }

        const requestUser: IRequestUserFromToken = {
            userId,
            email: token.email ?? '',
            role: token.role,
        };

        const result =
            await DashboardService.getDashboardStatsData(
                requestUser,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Dashboard stats retrieved successfully',
            data: result,
        });
    },
);

export const DashboardController = {
    getDashboardStatsData,
};