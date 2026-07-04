import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VoteService } from './vote.service';
import { VoteType } from '../../../generated/prisma';



const castVote = catchAsync(async (req: Request, res: Response) => {
    const { id: ideaId } = req.params;

    const { type } = req.body as { type: VoteType };

    // ✅ SAFE user extraction (fix for undefined bug)
    const user = req.user as JwtPayload & { id?: string; userId?: string };

    const userId = user.userId || user.id;

    if (!userId) {
        return sendResponse(res, {
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: 'User not found. Please login again.',
            data: null,
        });
    }

    const result = await VoteService.castVote(userId, ideaId as string, type);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Vote cast successfully',
        data: result,
    });
});

const removeVote = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { userId } = req.user as JwtPayload;

    await VoteService.removeVote(userId as string, id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Vote removed successfully',
        data: null,
    });
});

export const VoteController = {
    castVote,
    removeVote,
};