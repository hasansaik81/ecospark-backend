import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryController } from './category.controller';
import { categoryValidationSchema } from './category.validation';

const router = express.Router();


router.get('/', CategoryController.getAllCategories);


router.get('/:id', CategoryController.getCategoryById);


router.post(
    '/',
    auth('ADMIN'),
    validateRequest(categoryValidationSchema.createCategory),
    CategoryController.createCategory,
);


 
router.patch(
    '/:id',
    auth('ADMIN'),
    validateRequest(categoryValidationSchema.updateCategory),
    CategoryController.updateCategory,
);


router.delete(
    '/:id',
    auth('ADMIN'),
    CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
