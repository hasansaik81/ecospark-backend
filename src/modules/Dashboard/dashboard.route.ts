import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { DashboardController } from './dashboard.controller';
import { dashboardValidationSchema } from './dashboard.validation';

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════════════════
//  ADMIN ROUTES  —  prefix: /api/dashboard/admin
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/dashboard/admin/stats
 * Admin: Overall platform statistics
 */
router.get('/admin/stats', auth('admin'), DashboardController.getAdminStats);

/**
 * GET /api/dashboard/admin/users
 * Admin: List all registered users/members
 */
router.get('/admin/users', auth('admin'), DashboardController.getAllUsers);

/**
 * PATCH /api/dashboard/admin/users/:id/status
 * Admin: Activate or deactivate a user account
 */
router.patch(
    '/admin/users/:id/status',
    auth('admin'),
    validateRequest(dashboardValidationSchema.updateUserStatus),
    DashboardController.updateUserStatus,
);

/**
 * PATCH /api/dashboard/admin/users/:id/role
 * Admin: Change a user's role (MEMBER ↔ ADMIN)
 */
router.patch(
    '/admin/users/:id/role',
    auth('admin'),
    validateRequest(dashboardValidationSchema.updateUserRole),
    DashboardController.updateUserRole,
);

/**
 * GET /api/dashboard/admin/ideas
 * Admin: List all ideas (Under Review, Approved, Rejected, Draft)
 */
router.get('/admin/ideas', auth('admin'), DashboardController.getAllIdeasAdmin);

/**
 * PATCH /api/dashboard/admin/ideas/:id/approve
 * Admin: Approve an idea that is under review
 */
router.patch(
    '/admin/ideas/:id/approve',
    auth('admin'),
    DashboardController.approveIdea,
);

/**
 * PATCH /api/dashboard/admin/ideas/:id/reject
 * Admin: Reject an idea with a feedback message
 */
router.patch(
    '/admin/ideas/:id/reject',
    auth('admin'),
    validateRequest(dashboardValidationSchema.rejectIdea),
    DashboardController.rejectIdea,
);

/**
 * DELETE /api/dashboard/admin/ideas/:id
 * Admin: Soft-delete any idea
 */
router.delete(
    '/admin/ideas/:id',
    auth('admin'),
    DashboardController.adminDeleteIdea,
);

// ═══════════════════════════════════════════════════════════════════════════════
//  MEMBER ROUTES  —  prefix: /api/dashboard/member
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/dashboard/member/stats
 * Member: Personal dashboard statistics (ideas count, votes received, etc.)
 */
router.get('/member/stats', auth('member', 'admin'), DashboardController.getMemberStats);

/**
 * GET /api/dashboard/member/ideas
 * Member: All of the authenticated member's own ideas
 */
router.get('/member/ideas', auth('member', 'admin'), DashboardController.getMyIdeas);

export const DashboardRoutes = router;
