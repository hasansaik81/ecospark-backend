



import { z } from 'zod';
import {
    IdeaSortableFields,
    PaymentStatusValues,
} from './idea.constant';


const createIdea = z.object({
    body: z
        .object({
            title: z.string().min(3, 'Title must be at least 3 characters'),
            problemStatement: z
                .string()
                .min(10, 'Problem statement must be at least 10 characters'),
            proposedSolution: z
                .string()
                .min(10, 'Proposed solution must be at least 10 characters'),
            description: z
                .string()
                .min(10, 'Description must be at least 10 characters'),
            images: z.array(z.string().url()).optional(),
            categoryId: z.string().uuid('categoryId must be a valid UUID'),
            
        
            paymentStatus: z.string().optional(),
            
            
            price: z
                .preprocess(
                    (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)), 
                    z.number().nonnegative('Price must be a valid non-negative number')
                )
                .optional()
                .nullable(),
        })
        .superRefine((data, ctx) => {
            
            const normalizedStatus = data.paymentStatus?.trim().toUpperCase();

            if (normalizedStatus === 'PAID' && (data.price === undefined || data.price === null || data.price <= 0)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Price is required and must be greater than zero for paid ideas',
                    path: ['price'],
                });
            }
        }),
});


const updateIdea = z.object({
    params: z.object({
        id: z.string().uuid('Idea id must be a valid UUID'),
    }),
    body: z
        .object({
            title: z.string().min(3).optional(),
            problemStatement: z.string().min(10).optional(),
            proposedSolution: z.string().min(10).optional(),
            description: z.string().min(10).optional(),
            images: z.array(z.string().url()).optional(),
            categoryId: z.string().uuid('categoryId must be a valid UUID').optional(),
            paymentStatus: z.string().optional(),
            price: z
                .preprocess(
                    (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)), 
                    z.number().nonnegative()
                )
                .optional()
                .nullable(),
        })
        .superRefine((data, ctx) => {
            const normalizedStatus = data.paymentStatus?.trim().toUpperCase();
            if (normalizedStatus === 'PAID' && (data.price === undefined || data.price === null || data.price <= 0)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Price is required and must be greater than zero for paid ideas',
                    path: ['price'],
                });
            }
        }),
});


const rejectIdea = z.object({
    params: z.object({
        id: z.string().uuid('Idea id must be a valid UUID'),
    }),
    body: z.object({
        feedback: z.string().min(5, 'Feedback must be at least 5 characters'),
    }),
});


const submitIdea = z.object({
    params: z.object({
        id: z.string().uuid('Idea id must be a valid UUID'),
    }),
});


const getAllIdeas = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        sort: z.enum(IdeaSortableFields).optional(),
        category: z.string().uuid().optional(),
        isPaid: z.enum(['free', 'paid']).optional(),
        search: z.string().optional(),
        minVotes: z
            .string()
            .regex(/^[0-9]+$/, 'minVotes must be a non-negative integer')
            .optional(),
    }),
});

export const ideaValidationSchema = {
    createIdea,
    updateIdea,
    rejectIdea,
    submitIdea,
    getAllIdeas,
};