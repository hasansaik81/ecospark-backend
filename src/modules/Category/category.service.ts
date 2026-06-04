import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { TCategory } from './category.interface';

// ─── Create Category ─────────────────────────────────────────────────────────
const createCategory = async (payload: TCategory) => {
    const existingCategory = await prisma.category.findUnique({
        where: { name: payload.name },
    });

    if (existingCategory) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Category already exists');
    }

    const result = await prisma.category.create({
        data: payload,
    });

    return result;
};

// ─── Get All Categories ──────────────────────────────────────────────────────
const getAllCategories = async () => {
    const result = await prisma.category.findMany({
        orderBy: { name: 'asc' }, // Alphabetical order is standard for categories
    });

    return result;
};

// ─── Get Category By Id ──────────────────────────────────────────────────────
const getCategoryById = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) {
        throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
    }

    return category;
};

// ─── Update Category ─────────────────────────────────────────────────────────
const updateCategory = async (id: string, payload: Partial<TCategory>) => {
    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) {
        throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
    }

    if (payload.name) {
        const existingCategory = await prisma.category.findUnique({
            where: { name: payload.name },
        });

        if (existingCategory && existingCategory.id !== id) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Category name already exists',
            );
        }
    }

    const result = await prisma.category.update({
        where: { id },
        data: payload,
    });

    return result;
};

// ─── Delete Category ─────────────────────────────────────────────────────────
const deleteCategory = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) {
        throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
    }

    // Prevent deletion if there are ideas under this category
    const associatedIdeasCount = await prisma.idea.count({
        where: { categoryId: id },
    });

    if (associatedIdeasCount > 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Cannot delete category because it has associated ideas',
        );
    }

    await prisma.category.delete({
        where: { id },
    });

    return { message: 'Category deleted successfully' };
};

export const CategoryService = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};