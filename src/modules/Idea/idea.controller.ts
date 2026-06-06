import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import sendResponse from '../../utils/sendResponse';
import config from '../../config';
import { IdeaService } from './idea.service';

const parseUserFromAuthHeader = (req: Request) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {};
    }

    const token = authHeader.slice(7);
    try {
        return jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
    } catch {
        return {};
    }
};

const createIdea = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;

    const result = await IdeaService.createIdea(req.body, userId as string);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Idea created successfully',
        data: result,
    });
});

const getAllIdeas = catchAsync(async (req: Request, res: Response) => {
    const query = pick(req.query as Record<string, string>, [
        'page',
        'limit',
        'sort',
        'category',
        'isPaid',
        'search',
        'minVotes',
    ]);

    const { meta, data } = await IdeaService.getAllIdeas(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Ideas retrieved successfully',
        meta,
        data,
    });
});

const getIdeaById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const authUser = parseUserFromAuthHeader(req);
    const result = await IdeaService.getIdeaById(
        id,
        authUser.userId as string | undefined,
        authUser.role as string | undefined,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Idea retrieved successfully',
        data: result,
    });
});

const updateIdea = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { userId } = req.user as JwtPayload;

    const result = await IdeaService.updateIdea(
        id,
        userId as string,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Idea updated successfully',
        data: result,
    });
});

const deleteIdea = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { userId } = req.user as JwtPayload;

    const result = await IdeaService.deleteIdea(id, userId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Idea deleted successfully',
        data: result,
    });
});

const submitIdea = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { userId } = req.user as JwtPayload;

    const result = await IdeaService.submitIdea(id, userId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Idea submitted for review successfully',
        data: result,
    });
});

const getMyIdeas = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;

    const result = await IdeaService.getMyIdeas(userId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My ideas retrieved successfully',
        data: result,
    });
});

const getAllIdeasAdmin = catchAsync(async (req: Request, res: Response) => {
    const query = pick(req.query as Record<string, string>, [
        'page',
        'limit',
        'sort',
        'category',
        'isPaid',
        'search',
        'minVotes',
    ]);

    const { meta, data } = await IdeaService.getAllIdeasAdmin(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin idea list retrieved successfully',
        meta,
        data,
    });
});

const approveIdea = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await IdeaService.approveIdea(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Idea approved successfully',
        data: result,
    });
});

const rejectIdea = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await IdeaService.rejectIdea(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Idea rejected successfully',
        data: result,
    });
});

const adminDeleteIdea = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await IdeaService.adminDeleteIdea(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Idea deleted successfully',
        data: result,
    });
});

export const IdeaController = {
    createIdea,
    getAllIdeas,
    getIdeaById,
    updateIdea,
    deleteIdea,
    submitIdea,
    getMyIdeas,
    getAllIdeasAdmin,
    approveIdea,
    rejectIdea,
    adminDeleteIdea,
};