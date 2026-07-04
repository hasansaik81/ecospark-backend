

import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { VoteType } from '../../../generated/prisma';


const castVote = async (userId: string, ideaId: string, type: VoteType) => {
    if (!userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    const idea = await prisma.idea.findUnique({
        where: { id: ideaId },
    });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    const existingVote = await prisma.vote.findUnique({
        where: {
            userId_ideaId: {
                userId,
                ideaId,
            },
        },
    });

    if (existingVote) {
        if (existingVote.type === type) return existingVote;

        return prisma.vote.update({
            where: { id: existingVote.id },
            data: { type },
        });
    }

    return prisma.vote.create({
        data: {
            type,
            userId,
            ideaId,
        },
    });
};


 const removeVote = async (userId: string, ideaId: string) => {
    const existingVote = await prisma.vote.findUnique({
        where: {
            userId_ideaId: {
                userId,
                ideaId,
            },
        },
    });

    if (!existingVote) {
        throw new AppError(httpStatus.NOT_FOUND, 'Vote not found');
    }

    return prisma.vote.delete({
        where: { id: existingVote.id },
    });
};

// Default export (optional)
export const VoteService = {
    castVote,
    removeVote,
};