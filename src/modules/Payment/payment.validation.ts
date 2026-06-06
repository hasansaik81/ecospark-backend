import { z } from 'zod';

const checkoutSchema = z.object({
    params: z.object({
        ideaId: z.string().uuid('Idea id must be a valid UUID'),
    }),
});

const verifyPaymentSchema = z.object({
    params: z.object({
        ideaId: z.string().uuid('Idea id must be a valid UUID'),
    }),
});

export const paymentValidationSchema = {
    checkout: checkoutSchema,
    verifyPayment: verifyPaymentSchema,
};
