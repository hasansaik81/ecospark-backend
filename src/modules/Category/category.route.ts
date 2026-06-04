import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryController } from './category.controller';
import { categoryValidationSchema } from './category.validation';

const router = express.Router();

/**
 * GET /api/categories
 * Retrieve all categories (Public)
 */
router.get('/', CategoryController.getAllCategories);

/**
 * GET /api/categories/:id
 * Retrieve a specific category (Public)
 */
router.get('/:id', CategoryController.getCategoryById);

/**
 * POST /api/categories
 * Create a new category (Admin only)
 */
router.post(
    '/',
    auth('admin'),
    validateRequest(categoryValidationSchema.createCategory),
    CategoryController.createCategory,
);

/**
 * PATCH /api/categories/:id
 * Update an existing category (Admin only)
 */
router.patch(
    '/:id',
    auth('admin'),
    validateRequest(categoryValidationSchema.updateCategory),
    CategoryController.updateCategory,
);

/**
 * DELETE /api/categories/:id
 * Delete a category (Admin only)
 */
router.delete(
    '/:id',
    auth('admin'),
    CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
