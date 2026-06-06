import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

const buildCommentTree = (comments: any[]) => {
    const commentsById = new Map<string, any>();
    const roots: any[] = [];

    comments.forEach((comment) => {
        commentsById.set(comment.id, { ...comment, replies: [] });
    });

    comments.forEach((comment) => {
        if (comment.parentId) {
            const parent = commentsById.get(comment.parentId);
            if (parent) {
                parent.replies.push(commentsById.get(comment.id));
                return;
            }
        }

        roots.push(commentsById.get(comment.id));
    });

    return roots;
};

export const CommentService = {
    async getCommentsByIdea(ideaId: string) {
        const idea = await prisma.idea.findUnique({
            where: { id: ideaId },
        });

        if (!idea || idea.isDeleted) {
            throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
        }

        const comments = await prisma.comment.findMany({
            where: {
                ideaId,
                isDeleted: false,
            },
            orderBy: { createdAt: 'asc' },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    },
                },
            },
        });

        return buildCommentTree(comments);
    },

    async createComment(userId: string, ideaId: string, payload: { content: string; parentId?: string }) {
        const idea = await prisma.idea.findUnique({ where: { id: ideaId } });

        if (!idea || idea.isDeleted) {
            throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
        }

        if (payload.parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: payload.parentId },
            });

            if (!parentComment || parentComment.ideaId !== ideaId) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Parent comment is invalid');
            }
        }

        return prisma.comment.create({
            data: {
                content: payload.content,
                parent: payload.parentId
                    ? { connect: { id: payload.parentId } }
                    : undefined,
                author: { connect: { id: userId } },
                idea: { connect: { id: ideaId } },
            },
        });
    },

    async deleteComment(userId: string, commentId: string, userRole: string) {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
        }

        const isOwner = comment.authorId === userId;
        const isAdmin = userRole.toLowerCase() === 'admin';

        if (!isOwner && !isAdmin) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to delete this comment');
        }

        return prisma.comment.delete({
            where: { id: commentId },
        });
    },
};