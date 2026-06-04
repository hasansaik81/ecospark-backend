import { z } from 'zod';

const updateProfileSchema = z.object({
    body: z.object({
        name: z
            .string({ message: 'Name must be a string' })
            .min(2, 'Name must be at least 2 characters')
            .max(60, 'Name must be at most 60 characters')
            .optional(),
        profileImage: z
            .string({ message: 'Profile image must be a string URL' })
            .url('Profile image must be a valid URL')
            .optional(),
    }),
});

const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z
            .string({ message: 'Current password is required' })
            .min(1, 'Current password cannot be empty'),
        newPassword: z
            .string({ message: 'New password is required' })
            .min(6, 'New password must be at least 6 characters')
            .max(100, 'New password must be at most 100 characters'),
        confirmPassword: z
            .string({ message: 'Confirm password is required' })
            .min(1, 'Confirm password cannot be empty'),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: 'New password and confirm password do not match',
        path: ['confirmPassword'],
    }),
});

const updateUserStatusSchema = z.object({
    body: z.object({
        status: z.enum(['ACTIVE', 'DEACTIVATED'], {
            message: 'Status must be ACTIVE or DEACTIVATED',
        }),
    }),
});

const updateUserRoleSchema = z.object({
    body: z.object({
        role: z.enum(['ADMIN', 'MEMBER'], {
            message: 'Role must be ADMIN or MEMBER',
        }),
    }),
});

export const userValidationSchema = {
    updateProfile: updateProfileSchema,
    changePassword: changePasswordSchema,
    updateUserStatus: updateUserStatusSchema,
    updateUserRole: updateUserRoleSchema,
};