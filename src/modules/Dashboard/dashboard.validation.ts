import { z } from 'zod';

// ─── Admin: Reject Idea ─────────────────────────────────────────────────────────
const rejectIdeaSchema = z.object({
    body: z.object({
        feedback: z
            .string({ message: 'Feedback is required' })
            .min(5, 'Feedback must be at least 5 characters')
            .max(500, 'Feedback must be at most 500 characters'),
    }),
});

// ─── Admin: Update User Status ──────────────────────────────────────────────────
const updateUserStatusSchema = z.object({
    body: z.object({
        status: z.enum(['ACTIVE', 'DEACTIVATED'], {
            message: 'Status must be ACTIVE or DEACTIVATED',
        }),
    }),
});

// ─── Admin: Update User Role ────────────────────────────────────────────────────
const updateUserRoleSchema = z.object({
    body: z.object({
        role: z.enum(['ADMIN', 'MEMBER'], {
            message: 'Role must be ADMIN or MEMBER',
        }),
    }),
});

export const dashboardValidationSchema = {
    rejectIdea: rejectIdeaSchema,
    updateUserStatus: updateUserStatusSchema,
    updateUserRole: updateUserRoleSchema,
};