// import { Request, Response } from 'express';
// import { JwtPayload } from 'jsonwebtoken';
// import httpStatus from 'http-status';
// import catchAsync from '../../utils/catchAsync';
// import sendResponse from '../../utils/sendResponse';
// import { PaymentService } from './payment.service';
// import { envVars } from '../../config/env';
// import { PaymentWebhookService } from './payment.webhook';

// import { stripe } from '../../config/stripe.config';



// const handleStripeWebhookEvent = catchAsync(async (req, res) => {
//   const signature = req.headers["stripe-signature"] as string;
//   const webhookSecret = envVars.STRIPE.WEBHOOK_SECRET;

//   if (!signature || !webhookSecret) {
//     return sendResponse(res, {
//       statusCode: httpStatus.BAD_REQUEST,
//       success: false,
//       message: "Missing Stripe signature or webhook secret",
//       data: null,
//     });
//   }


//  type StripeEvent = any;

// let event: StripeEvent;
  

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       signature,
//       webhookSecret
//     );
//   } catch (error: any) {
//     return sendResponse(res, {
//       statusCode: httpStatus.BAD_REQUEST,
//       success: false,
//       message: `Webhook verification failed: ${error.message}`,
//       data: null,
//     });
//   }

//   try {
//     const result =
//       await PaymentWebhookService.handleStripeWebhook(event);

//     return sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Webhook processed successfully",
//       data: result,
//     });
//   } catch (error: any) {
//     return sendResponse(res, {
//       statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//       success: false,
//       message: error.message || "Webhook processing failed",
//       data: null,
//     });
//   }
// });


// const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
//     const { ideaId } = req.params as { ideaId: string };
//     const { userId } = req.user as JwtPayload;

//     const data = await PaymentService.createCheckoutSession(userId as string, ideaId);

//     sendResponse(res, {
//         statusCode: httpStatus.CREATED,
//         success: true,
//         message: 'Checkout session created successfully',
//         data,
//     });
// });

// const handleWebhook = catchAsync(async (req: Request, res: Response) => {
//     const signature = req.headers['stripe-signature'] as string | undefined;

//     const data = await PaymentService.handleStripeWebhook(req.body, signature);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Stripe webhook processed successfully',
//         data,
//     });
// });

// const verifyPayment = catchAsync(async (req: Request, res: Response) => {
//     const { ideaId } = req.params as { ideaId: string };
//     const { userId } = req.user as JwtPayload;

//     const data = await PaymentService.verifyPayment(userId as string, ideaId);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Payment verification completed successfully',
//         data,
//     });
// });



import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";

/**
 * Create Stripe Checkout Session
 */
const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = req.user.id;
  const { ideaId } = req.body;

  const result = await PaymentService.createCheckoutSession(
    userId,
    ideaId
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Checkout session created successfully",
    data: result,
  });
});

/**
 * Stripe Webhook Handler
 */
const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const event = req.body as any;

  if (!event?.type) {
    throw new Error("Invalid Stripe webhook payload");
  }

  const result = await PaymentService.handleStripeWebhook(event);

  res.status(httpStatus.OK).json({
    success: true,
    message: result?.message || "Webhook processed",
  });
});

/**
 * Verify Payment Status
 */
const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = req.user.id;

  const ideaId = Array.isArray(req.params.ideaId)
    ? req.params.ideaId[0]
    : req.params.ideaId;

  const result = await PaymentService.verifyPayment(
    userId,
    ideaId
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Payment verified successfully",
    data: result,
  });
});

export const PaymentController = {
  createCheckoutSession,
  handleStripeWebhook,
  verifyPayment,
};




// import { Request, Response } from "express";
// import httpStatus from "http-status";
// import catchAsync from "../../shared/catchAsync"; // আপনার প্রজেক্টের পাথ অনুযায়ী পরিবর্তন করুন
// import sendResponse from "../../shared/sendResponse"; // আপনার প্রজেক্টের পাথ অনুযায়ী পরিবর্তন করুন
// import { PaymentService } from "./payment.service";




// const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
//   const result = await PaymentService.createPaymentIntent(req.body);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Payment intent created successfully",
//     data: result,
//   });
// });

// const savePaymentRecord = catchAsync(async (req: Request, res: Response) => {
//   const result = await PaymentService.savePaymentRecord(req.body);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "Payment saved successfully",
//     data: result,
//   });
// });

// // export const PaymentController = {
// //   createPaymentIntent,
// //   savePaymentRecord,
// // };

// export const PaymentController = {
//     CreatePaymentIntent: createPaymentIntent,
//     // handleWebhook,
//     handleStripeWebhookEvent,
//     savePaymentRecord,
// };
