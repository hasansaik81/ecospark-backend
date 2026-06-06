import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import calculatePagination from '../../utils/pagination';
import {
    IdeaSearchableFields,
    IdeaSortableFields,
} from './idea.constant';
import {
    TCreateIdea,
    TIdeaQuery,
    TUpdateIdea,
    TIdeaStatusPayload,
} from './idea.interface';

const buildIdeaWhereClause = (query: TIdeaQuery, isAdmin = false) => {
    const conditions: object[] = [];

    if (!isAdmin) {
        conditions.push({ status: 'APPROVED' });
    }

    conditions.push({ isDeleted: false });

    if (query.category) {
        conditions.push({ categoryId: query.category });
    }

    if (query.isPaid) {
        conditions.push({
            paymentStatus: query.isPaid === 'paid' ? 'PAID' : 'FREE',
        });
    }

    if (query.search) {
        conditions.push({
            OR: IdeaSearchableFields.map((field) => ({
                [field]: { contains: query.search, mode: 'insensitive' },
            })),
        });
    }

    if (query.minVotes) {
        conditions.push({
            votes: {
                _count: {
                    gte: Number(query.minVotes),
                },
            },
        });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
};

const resolveOrderBy = (sort?: string) => {
    switch (sort) {
        case 'topVoted':
            return { votes: { _count: 'desc' as const } };
        case 'mostCommented':
            return { comments: { _count: 'desc' as const } };
        case 'recent':
        default:
            return { createdAt: 'desc' as const };
    }
};

const createIdea = async (payload: TCreateIdea, authorId: string) => {
    const data = {
        title: payload.title,
        problemStatement: payload.problemStatement,
        proposedSolution: payload.proposedSolution,
        description: payload.description,
        images: payload.images || [],
        categoryId: payload.categoryId,
        paymentStatus: payload.paymentStatus || 'FREE',
        price:
            payload.paymentStatus === 'PAID'
                ? payload.price ?? 0
                : null,
        authorId,
    };

    if (data.paymentStatus === 'PAID' && (data.price === null || data.price === 0)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Paid ideas require a valid price');
    }

    return prisma.idea.create({
        data,
    });
};

const getAllIdeas = async (query: TIdeaQuery) => {
    const pagination = calculatePagination({
        page: query.page,
        limit: query.limit,
    });

    const where = buildIdeaWhereClause(query);
    const orderBy = resolveOrderBy(query.sort);

    const [ideas, total] = await Promise.all([
        prisma.idea.findMany({
            where,
            include: {
                category: {
                    select: { id: true, name: true },
                },
                author: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { votes: true, comments: true },
                },
            },
            orderBy,
            skip: pagination.skip,
            take: pagination.limit,
        }),
        prisma.idea.count({ where }),
    ]);

    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            totalPage: Math.ceil(total / pagination.limit),
        },
        data: ideas,
    };
};

const getAllIdeasAdmin = async (query: TIdeaQuery) => {
    const pagination = calculatePagination({
        page: query.page,
        limit: query.limit,
    });

    const where = buildIdeaWhereClause(query, true);
    const orderBy = resolveOrderBy(query.sort);

    const [ideas, total] = await Promise.all([
        prisma.idea.findMany({
            where,
            include: {
                category: {
                    select: { id: true, name: true },
                },
                author: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { votes: true, comments: true },
                },
            },
            orderBy,
            skip: pagination.skip,
            take: pagination.limit,
        }),
        prisma.idea.count({ where }),
    ]);

    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            totalPage: Math.ceil(total / pagination.limit),
        },
        data: ideas,
    };
};

const getIdeaById = async (
    id: string,
    currentUserId?: string,
    currentUserRole?: string,
) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
        include: {
            category: {
                select: { id: true, name: true },
            },
            author: {
                select: { id: true, name: true, email: true },
            },
            _count: {
                select: { votes: true, comments: true },
            },
        },
    });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    if (idea.paymentStatus === 'PAID') {
        const isOwner = currentUserId === idea.authorId;
        const isAdmin = currentUserRole === 'admin';

        if (!isOwner && !isAdmin) {
            if (!currentUserId) {
                throw new AppError(
                    httpStatus.PAYMENT_REQUIRED,
                    'Payment required to access this idea',
                );
            }

            const payment = await prisma.payment.findFirst({
                where: {
                    ideaId: id,
                    userId: currentUserId,
                    status: {
                        in: ['SUCCESS', 'PAID'],
                    },
                },
            });

            if (!payment) {
                throw new AppError(
                    httpStatus.PAYMENT_REQUIRED,
                    'Payment required to access this idea',
                );
            }
        }
    }

    return idea;
};

const updateIdea = async (
    id: string,
    authorId: string,
    payload: TUpdateIdea,
) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
    });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    if (idea.authorId !== authorId) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not the owner of this idea');
    }

    if (!['DRAFT', 'REJECTED'].includes(idea.status)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Only draft or rejected ideas can be updated',
        );
    }

    const updatedData: Record<string, unknown> = {
        ...payload,
    };

    if (payload.paymentStatus === 'PAID') {
        updatedData.price = payload.price ?? idea.price;
    }

    if (payload.paymentStatus === 'FREE') {
        updatedData.price = null;
    }

    if (payload.paymentStatus === undefined && payload.price !== undefined) {
        updatedData.price = payload.price;
    }

    return prisma.idea.update({
        where: { id },
        data: updatedData,
    });
};

const deleteIdea = async (id: string, authorId: string) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
    });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    if (idea.authorId !== authorId) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not the owner of this idea');
    }

    if (!['DRAFT', 'REJECTED'].includes(idea.status)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Only draft or rejected ideas can be deleted',
        );
    }

    return prisma.idea.update({
        where: { id },
        data: { isDeleted: true },
    });
};

const submitIdea = async (id: string, authorId: string) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
    });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    if (idea.authorId !== authorId) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not the owner of this idea');
    }

    if (!['DRAFT', 'REJECTED'].includes(idea.status)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Only draft or rejected ideas may be submitted for review',
        );
    }

    return prisma.idea.update({
        where: { id },
        data: {
            status: 'UNDER_REVIEW',
            adminFeedback: null,
        },
    });
};

const getMyIdeas = async (authorId: string) => {
    return prisma.idea.findMany({
        where: {
            authorId,
            isDeleted: false,
        },
        include: {
            category: {
                select: { id: true, name: true },
            },
            _count: {
                select: { votes: true, comments: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};

const approveIdea = async (id: string) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
    });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    return prisma.idea.update({
        where: { id },
        data: {
            status: 'APPROVED',
            adminFeedback: null,
        },
    });
};

const rejectIdea = async (id: string, payload: TIdeaStatusPayload) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
    });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    return prisma.idea.update({
        where: { id },
        data: {
            status: 'REJECTED',
            adminFeedback: payload.feedback,
        },
    });
};

const adminDeleteIdea = async (id: string) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
    });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    return prisma.idea.update({
        where: { id },
        data: { isDeleted: true },
    });
};

export const IdeaService = {
    createIdea,
    getAllIdeas,
    getAllIdeasAdmin,
    getIdeaById,
    updateIdea,
    deleteIdea,
    submitIdea,
    getMyIdeas,
    approveIdea,
    rejectIdea,
    adminDeleteIdea,
};