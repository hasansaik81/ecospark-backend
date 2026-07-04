
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import calculatePagination from '../../utils/pagination';



import {
    TCreateIdea,
    TIdeaQuery,
    TUpdateIdea,
    TIdeaStatusPayload,
} from './idea.interface';
import { PaymentStatus, Prisma } from '../../../generated/prisma';




const buildIdeaWhereClause = (
  query: TIdeaQuery,
  isAdmin = false,
  userId?: string
): Prisma.IdeaWhereInput => {
  const where: Prisma.IdeaWhereInput = {
    isDeleted: false,
  };

  // user filter: if userId is provided and not admin, filter to only their ideas
  if (!isAdmin && userId) {
    where.authorId = userId; 
  }

  // only admin can see non-approved ideas, so if not admin, filter to only approved
  if (!isAdmin) {
    where.status = "APPROVED";
  }

  // category filter
  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  // ৪. search (Title, Problem, Solution, Description এ সার্চ করবে)
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { problemStatement: { contains: query.search, mode: "insensitive" } },
      { proposedSolution: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }

  // ৫. payment filter (paid/free)
  if (query.isPaid === "paid") {
    where.paymentStatus = "PAID";
  } else if (query.isPaid === "free") {
    where.paymentStatus = "FREE";
  }

  return where;
};



// new idea creation logic with validation for paid/free ideas
const createIdea = async (payload: TCreateIdea, authorId: string) => {
    if (!authorId) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'Author ID is missing. Please login again.'
        );
    }

    // PAID ideas must have a valid price greater than 
    if (payload.paymentStatus === 'PAID' && (!payload.price || payload.price <= 0)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Paid ideas require a valid price (must be greater than 0)'
        );
    }

    // FREE ideas should not have a price greater than 
    if (payload.paymentStatus === 'FREE' && payload.price && payload.price > 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Free ideas cannot have a price. Please set price to null or 0'
        );
    }

    const isPaid = payload.paymentStatus === 'PAID';

    const result = await prisma.idea.create({
        data: {
            title: payload.title,
            problemStatement: payload.problemStatement,
            proposedSolution: payload.proposedSolution,
            description: payload.description,
            images: payload.images || [],
            categoryId: payload.categoryId,
            paymentStatus: payload.paymentStatus || 'FREE',
            price: isPaid ? payload.price : null,
            authorId: authorId,
            status: 'APPROVED',
        },
        include: {
            category: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true,
                },
            },
        },
    });

    return result;
};



// public function to get all ideas with pagination, filtering, and sorting
const getAllIdeas = async (query: TIdeaQuery, userId?: string) => {
    const pagination = calculatePagination({
        page: query.page,
        limit: query.limit,
    });

    const where = buildIdeaWhereClause(query, false, userId);
    const orderBy = resolveOrderBy(query.sort);

    const [ideas, total] = await Promise.all([
        prisma.idea.findMany({
            where,
            include: {
                category: { select: { id: true, name: true } },
                author: { select: { id: true, name: true, email: true } },
                _count: { select: { votes: true, comments: true } },
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

// admin function to get all ideas with pagination, filtering, and sorting
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
                category: { select: { id: true, name: true } },
                author: { select: { id: true, name: true, email: true } },
                _count: { select: { votes: true, comments: true } },
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


export const getIdeaById = async (
  id: string,
  currentUserId?: string,
  currentUserRole?: string
) => {
  
  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
      author: { select: { id: true, name: true, email: true } },
      _count: { select: { votes: true, comments: true } },
    },
  });

  
  if (!idea || idea.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Idea not found");
  }

  
  const isOwner = currentUserId === idea.authorId;
  const isAdmin = currentUserRole === "ADMIN";
  const isFree = idea.paymentStatus === "FREE";

  
  if (isFree || isOwner || isAdmin) {
    return idea;
  }


  if (!currentUserId) {
    throw new AppError(
      httpStatus.PAYMENT_REQUIRED,
      "Please login to access this paid idea"
    );


  }
  const payment = await prisma.payment.findFirst({
    where: {
      ideaId: id,
      userId: currentUserId,
      status: PaymentStatus.SUCCESS, 
    },
  });

  if (!payment) {
    throw new AppError(
      httpStatus.PAYMENT_REQUIRED,
      "Payment required to access this idea"
    );
  }

  return idea;
};


const updateIdea = async (id: string, authorId: string, payload: TUpdateIdea) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
    });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    if (idea.authorId !== authorId) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not the owner of this idea');
    }

    const updatedData: Prisma.IdeaUpdateInput = {
        title: payload.title,
        problemStatement: payload.problemStatement,
        proposedSolution: payload.proposedSolution,
        description: payload.description,
        images: payload.images,
        paymentStatus: payload.paymentStatus,
    };

    if (payload.paymentStatus === 'PAID') {
        updatedData.price = payload.price ?? idea.price;
    } else if (payload.paymentStatus === 'FREE') {
        updatedData.price = null;
    } else if (payload.price !== undefined) {
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
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
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


function resolveOrderBy(sort: string | undefined) {
    switch (sort) {
        case 'topVoted':
            return { votes: { _count: 'desc' as const } };
        case 'mostCommented':
            return { comments: { _count: 'desc' as const } };
        case 'recent':
        default:
            return { createdAt: 'desc' as const };
    }
}

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