import { z } from 'zod';

const subscribeSchema = z.object({
    body: z.object({
        email: z
            .string({ message: 'Email must be a valid string' })
            .email('Email must be valid'),
    }),
});

const unsubscribeSchema = z.object({
    body: z.object({
        email: z
            .string({ message: 'Email must be a valid string' })
            .email('Email must be valid'),
    }),
});

export const newsletterValidationSchema = {
    subscribe: subscribeSchema,
    unsubscribe: unsubscribeSchema,
};