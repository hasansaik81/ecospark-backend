import { z } from 'zod';

const createCategoryValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ message: 'Category name must be a string' })
            .min(1, 'Category name is required')
            .max(50, 'Category name must be at most 50 characters'),
        description: z
            .string({ message: 'Description must be a string' })
            .max(500, 'Description must be at most 500 characters')
            .optional(),
    }),
});

const updateCategoryValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ message: 'Category name must be a string' })
            .min(1, 'Category name cannot be empty')
            .max(50, 'Category name must be at most 50 characters')
            .optional(),
        description: z
            .string({ message: 'Description must be a string' })
            .max(500, 'Description must be at most 500 characters')
            .optional(),
    }),
});

export const categoryValidationSchema = {
    createCategory: createCategoryValidationSchema,
    updateCategory: updateCategoryValidationSchema,
};