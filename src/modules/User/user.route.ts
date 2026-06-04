import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { userValidationSchema } from './user.validation';

const router = express.Router();

// ─── Member Routes ─────────────────────────────────────────────────────────────

/**
 * GET /api/users/me
 * Get the authenticated user's own profile
 */
router.get('/me', auth('member', 'admin'), UserController.getMyProfile);

/**
 * PATCH /api/users/me
 * Update the authenticated user's own profile (name, profileImage)
 */
router.patch(
    '/me',
    auth('member', 'admin'),
    validateRequest(userValidationSchema.updateProfile),
    UserController.updateMyProfile,
);

/**
 * PATCH /api/users/me/change-password
 * Change the authenticated user's password
 */
router.patch(
    '/me/change-password',
    auth('member', 'admin'),
    validateRequest(userValidationSchema.changePassword),
    UserController.changePassword,
);

// ─── Admin Routes ──────────────────────────────────────────────────────────────

/**
 * GET /api/users
 * Admin: List all registered users
 */
router.get('/', auth('admin'), UserController.getAllUsers);

/**
 * GET /api/users/:id
 * Admin: Get a specific user by ID
 */
router.get('/:id', auth('admin'), UserController.getUserById);

/**
 * PATCH /api/users/:id/status
 * Admin: Activate or deactivate a user
 */
router.patch(
    '/:id/status',
    auth('admin'),
    validateRequest(userValidationSchema.updateUserStatus),
    UserController.updateUserStatus,
);

/**
 * PATCH /api/users/:id/role
 * Admin: Change a user's role (MEMBER ↔ ADMIN)
 */
router.patch(
    '/:id/role',
    auth('admin'),
    validateRequest(userValidationSchema.updateUserRole),
    UserController.updateUserRole,
);

export const UserRoutes = router;
