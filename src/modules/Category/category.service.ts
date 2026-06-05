import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import calculatePagination from '../../utils/pagination';
import { CategorySearchableFields, CategorySortableFields } from './category.constant';
import { TCategory, TCategoryQuery } from './category.interface';

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

// ─── Get All Categories (Search / Filter / Sort / Paginate) ──────────────────
const getAllCategories = async (query: TCategoryQuery) => {
    const { search, name, ...paginationOptions } = query;

    // ── 1. Pagination & Sorting ─────────────────────────────────────────────
    const defaultSortBy = 'name'; // Alphabetical by default
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(
        paginationOptions,
        defaultSortBy,
    );

    // Guard: only allow whitelisted sort fields
    const resolvedSortBy = CategorySortableFields.includes(
        sortBy as (typeof CategorySortableFields)[number],
    )
        ? sortBy
        : defaultSortBy;

    // ── 2. Build WHERE clause ────────────────────────────────────────────────
    const andConditions: object[] = [];

    // Exact filter: ?name=Energy
    if (name) {
        andConditions.push({
            name: { equals: name, mode: 'insensitive' },
        });
    }

    // Full-text search: ?search=energy (across all searchable fields)
    if (search) {
        andConditions.push({
            OR: CategorySearchableFields.map((field) => ({
                [field]: { contains: search, mode: 'insensitive' },
            })),
        });
    }

    const where = andConditions.length > 0 ? { AND: andConditions } : {};

    // ── 3. Execute queries in parallel ──────────────────────────────────────
    const [result, total] = await Promise.all([
        prisma.category.findMany({
            where,
            orderBy: { [resolvedSortBy]: sortOrder },
            skip,
            take: limit,
        }),
        prisma.category.count({ where }),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: result,
    };
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