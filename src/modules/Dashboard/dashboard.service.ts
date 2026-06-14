import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { DashboardIdeaInclude, DashboardUserSelect } from './dashboard.constant';
import { TRejectIdeaPayload } from './dashboard.interface';

// ═══════════════════════════════════════════════════════════════════════════════
//  ADMIN SERVICES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Admin: Get Dashboard Stats ─────────────────────────────────────────────────
const getAdminStats = async () => {
    const [
        totalUsers,
        totalIdeas,
        totalVotes,
        revenueResult,
        draft,
        underReview,
        approved,
        rejected,
    ] = await Promise.all([
        prisma.user.count({ where: { role: 'MEMBER' } }),
        prisma.idea.count({ where: { isDeleted: false } }),
        prisma.vote.count(),
        prisma.payment.aggregate({
            where: { status: { in: ['SUCCESS', 'PAID'] } },
            _sum: { amount: true },
        }),
        prisma.idea.count({ where: { status: 'DRAFT', isDeleted: false } }),
        prisma.idea.count({ where: { status: 'UNDER_REVIEW', isDeleted: false } }),
        prisma.idea.count({ where: { status: 'APPROVED', isDeleted: false } }),
        prisma.idea.count({ where: { status: 'REJECTED', isDeleted: false } }),
    ]);

    return {
        totalUsers,
        totalIdeas,
        totalVotes,
        totalRevenue: revenueResult._sum.amount ?? 0,
        ideasByStatus: {
            DRAFT: draft,
            UNDER_REVIEW: underReview,
            APPROVED: approved,
            REJECTED: rejected,
        },
    };
};

// ─── Admin: Get All Users ───────────────────────────────────────────────────────
const getAllUsers = async () => {
    return prisma.user.findMany({
        select: DashboardUserSelect,
        orderBy: { createdAt: 'desc' },
    });
};

// ─── Admin: Update User Status ──────────────────────────────────────────────────
const updateUserStatus = async (id: string, status: 'ACTIVE' | 'DEACTIVATED') => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return prisma.user.update({
        where: { id },
        data: { status },
        select: DashboardUserSelect,
    });
};

// ─── Admin: Update User Role ────────────────────────────────────────────────────
const updateUserRole = async (id: string, role: 'ADMIN' | 'MEMBER') => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return prisma.user.update({
        where: { id },
        data: { role },
        select: DashboardUserSelect,
    });
};

// ─── Admin: Get All Ideas ───────────────────────────────────────────────────────
const getAllIdeasAdmin = async () => {
    return prisma.idea.findMany({
        where: { isDeleted: false },
        include: DashboardIdeaInclude,
        orderBy: { createdAt: 'desc' },
    });
};

// ─── Admin: Approve Idea ────────────────────────────────────────────────────────
const approveIdea = async (id: string) => {
    const idea = await prisma.idea.findUnique({ where: { id } });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    if (idea.status !== 'UNDER_REVIEW') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Only ideas under review can be approved',
        );
    }

    return prisma.idea.update({
        where: { id },
        data: { status: 'APPROVED', adminFeedback: null },
        include: DashboardIdeaInclude,
    });
};

// ─── Admin: Reject Idea ─────────────────────────────────────────────────────────
const rejectIdea = async (id: string, payload: TRejectIdeaPayload) => {
    const idea = await prisma.idea.findUnique({ where: { id } });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    if (idea.status !== 'UNDER_REVIEW') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Only ideas under review can be rejected',
        );
    }

    return prisma.idea.update({
        where: { id },
        data: { status: 'REJECTED', adminFeedback: payload.feedback },
        include: DashboardIdeaInclude,
    });
};

// ─── Admin: Delete Idea ─────────────────────────────────────────────────────────
const adminDeleteIdea = async (id: string) => {
    const idea = await prisma.idea.findUnique({ where: { id } });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    return prisma.idea.update({
        where: { id },
        data: { isDeleted: true },
    });
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MEMBER SERVICES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Member: Get My Dashboard Stats ────────────────────────────────────────────
const getMemberStats = async (userId: string) => {
    const [
        totalIdeas,
        draft,
        underReview,
        approved,
        rejected,
        votesResult,
        commentsResult,
    ] = await Promise.all([
        prisma.idea.count({ where: { authorId: userId, isDeleted: false } }),
        prisma.idea.count({ where: { authorId: userId, status: 'DRAFT', isDeleted: false } }),
        prisma.idea.count({ where: { authorId: userId, status: 'UNDER_REVIEW', isDeleted: false } }),
        prisma.idea.count({ where: { authorId: userId, status: 'APPROVED', isDeleted: false } }),
        prisma.idea.count({ where: { authorId: userId, status: 'REJECTED', isDeleted: false } }),
        prisma.vote.count({
            where: { idea: { authorId: userId } },
        }),
        prisma.comment.count({
            where: { idea: { authorId: userId } },
        }),
    ]);

    return {
        totalIdeas,
        totalVotesReceived: votesResult,
        totalCommentsReceived: commentsResult,
        ideasByStatus: {
            DRAFT: draft,
            UNDER_REVIEW: underReview,
            APPROVED: approved,
            REJECTED: rejected,
        },
    };
};

// ─── Member: Get My Ideas ───────────────────────────────────────────────────────
const getMyIdeas = async (userId: string) => {
    return prisma.idea.findMany({
        where: { authorId: userId, isDeleted: false },
        include: DashboardIdeaInclude,
        orderBy: { createdAt: 'desc' },
    });
};

export const DashboardService = {
    // Admin
    getAdminStats,
    getAllUsers,
    updateUserStatus,
    updateUserRole,
    getAllIdeasAdmin,
    approveIdea,
    rejectIdea,
    adminDeleteIdea,
    // Member
    getMemberStats,
    getMyIdeas,
};