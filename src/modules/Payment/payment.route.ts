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

// router.post('/webhook', PaymentController.handleStripeWebhook);

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  PaymentController.handleStripeWebhook
);

router.get(
    '/verify/:ideaId',
    auth('member'),
    validateRequest(paymentValidationSchema.verifyPayment),
    PaymentController.verifyPayment,
);

export const PaymentRoutes = router;




// import express from "express";
// import auth from "../../middlewares/auth";
// import validateRequest from "../../middlewares/validateRequest";
// import { PaymentController } from "./payment.controller";
// import { paymentValidationSchema } from "./payment.validation";

// const router = express.Router();

// // Create Stripe Checkout Session
// router.post(
//   "/checkout/:ideaId",
//   auth("member"),
//   validateRequest(paymentValidationSchema.checkout),
//   PaymentController.CreatePaymentIntent
// );

// // Stripe Webhook
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }), // IMPORTANT
//   PaymentController.handleWebhook
// );

// // Verify user payment for idea access
// router.get(
//   "/verify/:ideaId",
//   auth("member"),
//   validateRequest(paymentValidationSchema.verifyPayment),
//   PaymentController.savePaymentRecord
// );

// export const PaymentRoutes = router;