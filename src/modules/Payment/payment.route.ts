import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentController } from './payment.controller';
import { paymentValidationSchema } from './payment.validation';

const router = express.Router();

router.post(
    '/checkout/:ideaId',
    auth('member'),
    validateRequest(paymentValidationSchema.checkout),
    PaymentController.createCheckoutSession,
);

router.post('/webhook', PaymentController.handleWebhook);

router.get(
    '/verify/:ideaId',
    auth('member'),
    validateRequest(paymentValidationSchema.verifyPayment),
    PaymentController.verifyPayment,
);

export const PaymentRoutes = router;
