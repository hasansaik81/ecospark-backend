import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NewsletterService } from './newsletter.service';

const subscribe = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body as { email: string };
    const data = await NewsletterService.subscribe(email);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Subscribed to newsletter successfully',
        data,
    });
});

const unsubscribe = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body as { email: string };
    const data = await NewsletterService.unsubscribe(email);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Unsubscribed from newsletter successfully',
        data,
    });
});

export const NewsletterController = {
    subscribe,
    unsubscribe,
};