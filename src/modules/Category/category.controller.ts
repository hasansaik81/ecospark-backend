import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryService } from './category.service';

// ─── Create Category ─────────────────────────────────────────────────────────
const createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.createCategory(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Category created successfully',
        data: result,
    });
});

// ─── Get All Categories ──────────────────────────────────────────────────────
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.getAllCategories();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Categories retrieved successfully',
        data: result,
    });
});

// ─── Get Category By Id ──────────────────────────────────────────────────────
const getCategoryById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await CategoryService.getCategoryById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category retrieved successfully',
        data: result,
    });
});

// ─── Update Category ─────────────────────────────────────────────────────────
const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await CategoryService.updateCategory(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category updated successfully',
        data: result,
    });
});

// ─── Delete Category ─────────────────────────────────────────────────────────
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await CategoryService.deleteCategory(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category deleted successfully',
        data: result,
    });
});

export const CategoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};