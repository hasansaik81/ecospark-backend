import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VoteService } from './vote.service';
import { VoteType } from '../../../generated/prisma';

const castVote = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { type } = req.body as { type: VoteType };
    const { userId } = req.user as JwtPayload;

    const result = await VoteService.castVote(userId as string, id, type);

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