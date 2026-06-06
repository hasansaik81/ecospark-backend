import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentService } from './payment.service';

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
    const { ideaId } = req.params as { ideaId: string };
    const { userId } = req.user as JwtPayload;

    const data = await PaymentService.createCheckoutSession(userId as string, ideaId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Checkout session created successfully',
        data,
    });
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string | undefined;

    const data = await PaymentService.handleStripeWebhook(req.body, signature);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Stripe webhook processed successfully',
        data,
    });
});

const verifyPayment = catchAsync(async (req: Request, res: Response) => {
    const { ideaId } = req.params as { ideaId: string };
    const { userId } = req.user as JwtPayload;

    const data = await PaymentService.verifyPayment(userId as string, ideaId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment verification completed successfully',
        data,
    });
});

export const PaymentController = {
    createCheckoutSession,
    handleWebhook,
    verifyPayment,
};
