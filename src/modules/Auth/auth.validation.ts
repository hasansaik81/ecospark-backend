import { z } from 'zod';

const registerValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ message: 'Name must be a string' })
            .min(2, 'Name must be at least 2 characters')
            .max(60, 'Name must be at most 60 characters'),
        email: z
            .string({ message: 'Email must be a string' })
            .email('Invalid email address'),
        password: z
            .string({ message: 'Password must be a string' })
            .min(6, 'Password must be at least 6 characters')
            .max(100, 'Password must be at most 100 characters'),
        profileImage: z
            .string({ message: 'Profile image must be a string URL' })
            .url('Profile image must be a valid URL')
            .optional(),
    }),
});

const loginValidationSchema = z.object({
    body: z.object({
        email: z
            .string({ message: 'Email must be a string' })
            .email('Invalid email address'),
        password: z
            .string({ message: 'Password must be a string' })
            .min(1, 'Password is required'),
    }),
});

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            message: 'Refresh token is required',
        }),
    }),
});

export const authValidationSchema = {
    register: registerValidationSchema,
    login: loginValidationSchema,
    refresh: refreshTokenValidationSchema,
};