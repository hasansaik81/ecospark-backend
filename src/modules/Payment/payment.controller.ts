




// import { Request, Response } from "express";
// import httpStatus from "http-status";
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
// import { PaymentService } from "./payment.service";
// import AppError from "../../errors/AppError";
// import { stripe } from "../../config/stripe.config";

// /**
//  * Create Stripe Checkout Session
//  */
// const createCheckoutSession = catchAsync(
//   async (req: Request, res: Response) => {
//     const user = req.user as any;

//     if (!user?.id) {
//       throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
//     }

//     const userId = user.id as string;
//     const ideaId = req.params.ideaId as string;

//         // ✅ Debug
//     console.log("========== CHECKOUT DEBUG ==========");
//     console.log("User ID:", userId);
//     console.log("Idea ID:", ideaId);
//     console.log("===================================");

//     const result = await PaymentService.createCheckoutSession(
//       userId,
//       ideaId
//     );

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Checkout session created successfully",
//       data: result,
//     });
//   }
// );

// /**
//  * Stripe Webhook Handler
//  */
// // const handleStripeWebhook = catchAsync(
// //   async (req: Request, res: Response) => {
// //     const signature = req.headers["stripe-signature"] as string;

// //     if (!signature) {
// //       throw new AppError(
// //         httpStatus.BAD_REQUEST,
// //         "Missing stripe-signature header"
// //       );
// //     }

// //     const result = await PaymentService.handleStripeWebhook(
// //       req.body,
// //       signature
// //     );

// //     sendResponse(res, {
// //       statusCode: httpStatus.OK,
// //       success: true,
// //       message: result?.message || "Webhook processed successfully",
// //       data: result ?? null,
// //     });
// //   }
// // );


// // import stripe from '../../config/stripe'; // আপনার প্রজেক্টের স্ট্রাইপ কনফিগ পাথ
// // import { PrismaClient } from '@prisma/client'; // বা আপনার ব্যবহৃত ORM
// // const prisma = new PrismaClient();

// // import stripe from '../../config/stripe'; // আপনার স্ট্রাইপের সঠিক কনফিগ পাথ

// const handleStripeWebhook = async (rawBody: any, signature: string) => {
//   // ১. সিক্রেট কি চেক করা
//   const secret = process.env.STRIPE_WEBHOOK_SECRET;
//   if (!secret) {
//     console.error("❌ ENV Error: STRIPE_WEBHOOK_SECRET is missing in .env file!");
//     return { message: "Webhook secret missing configuration" };
//   }

//   let event;

//   try {
//     // 🎯 সিগনেচার ভেরিফাই করা হচ্ছে
//     event = stripe.webhooks.constructEvent(rawBody, signature, secret);
//   } catch (err: any) {
//     // ⚠️ সিগনেচার ফেইল করলেও ৫০০ এরর না দিয়ে এখানে লগ করুন এবং ২০০ রিটার্ন করুন যাতে স্ট্রাইপ শান্ত থাকে
//     console.error(`❌ Stripe Webhook Signature Verification Failed: ${err.message}`);
//     return { message: `Webhook Signature Error: ${err.message}` };
//   }

//   // ২. ইভেন্ট টাইপ অনুযায়ী সুরক্ষিত লজিক
//   try {
//     switch (event.type) {
//       case 'checkout.session.completed': {
//         const session = event.data.object as any;
        
//         const userId = session.metadata?.userId || session.client_reference_id;
//         const ideaId = session.metadata?.ideaId;

//         console.log(`💰 Webhook Event Triggered -> User: ${userId}, Idea: ${ideaId}`);

//         if (!userId || !ideaId) {
//           console.log('ℹ️ CLI Trigger or Test Event detected (No Metadata). Skipping DB update.');
//           break;
//         }

//         // 🔄 আপনার ডাটাবেস কোড এখানে সাবধানে ট্রাই-ক্যাচে লিখুন
//         // await prisma.payment.update(...);
//         console.log('✅ DB Update Success!');
//         break;
//       }

//       default:
//         console.log(`ℹ️ Unhandled event type: ${event.type}`);
//     }
//   } catch (loopError: any) {
//     console.error(`❌ Error inside webhook handler loop: ${loopError.message}`);
//   }

//   return { message: "Webhook processed" };
// };
// // /**
// //  * Verify Payment
// //  */
// // const verifyPayment = catchAsync(
// //   async (req: Request, res: Response) => {
// //     const user = req.user as any;

// //     if (!user?.id) {
// //       throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
// //     }

// //     const userId = user.id as string;
// //     const ideaId = req.params.ideaId as string;

// //     const result = await PaymentService.verifyPayment(
// //       userId,
// //       ideaId
// //     );

// //     sendResponse(res, {
// //       statusCode: httpStatus.OK,
// //       success: true,
// //       message: "Payment verified successfully",
// //       data: result,
// //     });
// //   }
// // );


// const verifyPayment = catchAsync(async (req: Request, res: Response) => {
//   const user = req.user as any;

//   if (!user?.id) {
//     throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
//   }

//   const userId = user.id as string;
//   const ideaId = req.params.ideaId as string;

//   const result = await PaymentService.verifyPayment(userId, ideaId);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: result.hasPaid ? "Access granted" : "Access denied",
//     data: result,
//   });
// });

// export const PaymentController = {
//   createCheckoutSession,
//   handleStripeWebhook,
//   verifyPayment,
// };






// import { Request, Response } from "express";
// import httpStatus from "http-status";
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
// // import { PaymentService } from "./payment.service";
// import AppError from "../../errors/AppError";
// import { stripe } from "../../config/stripe.config";
// import { PaymentService } from "./payment.service";

// /**
//  * ১. Create Stripe Checkout Session
//  */

// /**
//  * ২. Stripe Webhook Handler (ক্রিটিক্যাল ফিক্সসহ)
//  * নোট: app.ts থেকে আমরা rawBody এবং signature সরাসরি পাস করছি, তাই এখানে রিকোয়েস্ট ডিরেক্ট হ্যান্ডেল হচ্ছে।
//  */
// const handleStripeWebhook = async (rawBody: any, signature: string) => {
//   const secret = process.env.STRIPE_WEBHOOK_SECRET;
  
//   if (!secret) {
//     console.error("❌ ENV Error: STRIPE_WEBHOOK_SECRET is missing in .env file!");
//     return { success: false, message: "Webhook secret missing configuration" };
//   }

//   let event;

//   try {
//     // 🎯 সিগনেচার ভেরিফাই করা হচ্ছে
//     event = stripe.webhooks.constructEvent(rawBody, signature, secret);
//   } catch (err: any) {
//     // সিগনেচার ফেইল করলেও সার্ভার যাতে ক্র্যাশ না করে (৫০০ এরর এড়াতে) লগ করে রিটার্ন করা হচ্ছে
//     console.error(`❌ Stripe Webhook Signature Verification Failed: ${err.message}`);
//     return { success: false, message: `Webhook Signature Error: ${err.message}` };
//   }

//   // ইভেন্ট টাইপ অনুযায়ী ডাটাবেজ আপডেট লজিক
//   try {
//     switch (event.type) {
//       case 'checkout.session.completed': {
//         const session = event.data.object as any;
        
//         // মেটাডাটা বা ক্লায়েন্ট রেফারেন্স আইডি থেকে ইউজার ও আইডিয়া ডাটা সংগ্রহ
//         const userId = session.metadata?.userId || session.client_reference_id;
//         const ideaId = session.metadata?.ideaId;

//         console.log(`💰 Webhook Event Triggered -> User: ${userId}, Idea: ${ideaId}`);

//         if (!userId || !ideaId) {
//           console.log('ℹ️ CLI Trigger or Test Event detected (No Metadata). Skipping DB update.');
//           break;
//         }

//         // 🔄 সার্ভিস লেয়ারের মাধ্যমে ডাটাবেজ আপডেট কল করুন
//         // await PaymentService.updatePaymentStatusInDB(userId, ideaId, session.id);
//         console.log('✅ DB Update Success via Webhook!');
//         break;
//       }

//       default:
//         console.log(`ℹ️ Unhandled event type: ${event.type}`);
//     }
//   } catch (loopError: any) {
//     console.error(`❌ Error inside webhook handler loop: ${loopError.message}`);
//   }

//   return { success: true, message: "Webhook processed successfully" };
// };

// /**
//  * ৩. Verify Payment
//  */
// const verifyPayment = catchAsync(async (req: Request, res: Response) => {
//   const user = req.user as any;

//   if (!user?.id) {
//     throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
//   }

//   const userId = user.id as string;
//   const ideaId = req.params.ideaId as string;

//   const result = await PaymentService.verifyPayment(userId, ideaId);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: result?.hasPaid ? "Access granted" : "Access denied",
//     data: result,
//   });
// });

// export const PaymentController = {
//   createCheckoutSession,
//   handleStripeWebhook,
//   verifyPayment,
// };



import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import AppError from "../../errors/AppError";




// const createCheckoutSession = catchAsync(
//   async (req: Request, res: Response) => {
//     const user = req.user as any;

//     if (!user?.id) {
//       throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
//     }

//     const userId = user.id as string;
//     const ideaId = req.params.ideaId as string;

//     // ✅ Debug Logs
//     console.log("========== CHECKOUT DEBUG ==========");
//     console.log("User ID:", userId);
//     console.log("Idea ID:", ideaId);
//     console.log("===================================");

//     const result = await PaymentService.createCheckoutSession(userId, ideaId);

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Checkout session created successfully",
//       data: result,
//     });
//   }
// );


const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const ideaIdParam = req.params.ideaId;
  const ideaId = Array.isArray(ideaIdParam) ? ideaIdParam[0] : ideaIdParam;

  if (!ideaId) {
    return res.status(400).json({ error: "Idea ID is required" });
  }

  const result = await PaymentService.createCheckoutSession(req.user.id, ideaId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Checkout session created successfully",
    data: result,
  });
});

const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const ideaIdParam = req.params.ideaId;
  const ideaId = Array.isArray(ideaIdParam) ? ideaIdParam[0] : ideaIdParam;

  const result = await PaymentService.verifyPayment(req.user.id, ideaId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment verification successful",
    data: result,
  });
});
const handleStripeWebhook = async (
  req: Request,
  res: Response
) => {
  const signature = req.headers["stripe-signature"] as string;

  const result = await PaymentService.handleStripeWebhook(
    req.body,
    signature
  );

  res.status(200).json(result);
};

export const PaymentController = {
  createCheckoutSession,
  verifyPayment,
  handleStripeWebhook,
}