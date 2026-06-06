import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CommentService } from './comment.service';

const getComments = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const data = await CommentService.getCommentsByIdea(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Comments retrieved successfully',
        data,
    });
});

const createComment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { content, parentId } = req.body as { content: string; parentId?: string };
    const { userId } = req.user as JwtPayload;

    const data = await CommentService.createComment(userId as string, id, {
        content,
        parentId,
    });

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Comment created successfully',
        data,
    });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { userId, role } = req.user as JwtPayload;

    await CommentService.deleteComment(userId as string, id, role as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Comment deleted successfully',
        data: null,
    });
});

export const CommentController = {
    getComments,
    createComment,
    deleteComment,
};