// import httpStatus from 'http-status';
// import AppError from '../../errors/AppError';
// import { prisma } from '../../lib/prisma';
// import { stripe } from '../../config/stripe.config';
// import { envVars } from '../../config/env';

// export const PaymentService = {
//     async createCheckoutSession(userId: string, ideaId: string) {
//         const idea = await prisma.idea.findUnique({
//             where: { id: ideaId },
//         });

//         if (!idea || idea.isDeleted) {
//             throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
//         }

//         if (idea.paymentStatus !== 'PAID' || !idea.price || idea.price <= 0) {
//             throw new AppError(httpStatus.BAD_REQUEST, 'This idea is not available for purchase');
//         }

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             mode: 'payment',
//             line_items: [
//                 {
//                     price_data: {
//                         currency: 'usd',
//                         product_data: {
//                             name: idea.title,
//                             description: idea.problemStatement || idea.description || undefined,
//                         },
//                         unit_amount: Math.round(idea.price * 100),
//                     },
//                     quantity: 1,
//                 },
//             ],
//             metadata: {
//                 ideaId,
//                 userId,
//             },
//             success_url: `${envVars.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${envVars.FRONTEND_URL}/payment-cancel?ideaId=${ideaId}`,
//         });

//         return session;
//     },

//     async handleStripeWebhook(payload: any, signature?: string) {
//         let event: any;
//         const rawBody = typeof payload === 'string' ? payload : JSON.stringify(payload);

//         try {
//             if (signature) {
//                 event = stripe.webhooks.constructEvent(
//                     rawBody,
//                     signature,
//                     envVars.STRIPE.WEBHOOK_SECRET,
//                 );
//             } else {
//                 event = payload;
//             }
//         } catch (error) {
//             throw new AppError(httpStatus.BAD_REQUEST, 'Stripe webhook signature verification failed');
//         }

//         if (event.type === 'checkout.session.completed') {
//             const session = event.data.object as any;
//             const ideaId = session.metadata?.ideaId;
//             const userId = session.metadata?.userId;
//             const transactionId = session.payment_intent || session.id;
//             const amount = Number(session.amount_total ?? session.amount_subtotal ?? 0) / 100;

//             if (!ideaId || !userId || !transactionId) {
//                 throw new AppError(httpStatus.BAD_REQUEST, 'Incomplete Stripe session metadata');
//             }

//             return prisma.payment.upsert({
//                 where: {
//                     userId_ideaId: {
//                         userId,
//                         ideaId,
//                     },
//                 },
//                 update: {
//                     amount,
//                     transactionId,
//                     status: 'COMPLETED',
//                 },
//                 create: {
//                     amount,
//                     transactionId,
//                     status: 'COMPLETED',
//                     user: { connect: { id: userId } },
//                     idea: { connect: { id: ideaId } },
//                 },
//             });
//         }

//         return null;
//     },

//     async verifyPayment(userId: string, ideaId: string) {
//         const idea = await prisma.idea.findUnique({
//             where: { id: ideaId },
//         });

//         if (!idea || idea.isDeleted) {
//             throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
//         }

//         if (idea.paymentStatus !== 'PAID') {
//             return {
//                 hasPaid: true,
//                 message: 'This idea is free to access',
//             };
//         }

//         const payment = await prisma.payment.findUnique({
//             where: {
//                 userId_ideaId: {
//                     userId,
//                     ideaId,
//                 },
//             },
//         });

//         if (!payment || payment.status !== 'COMPLETED') {
//             throw new AppError(httpStatus.PAYMENT_REQUIRED, 'Payment required to access this idea');
//         }

//         return {
//             hasPaid: true,
//             payment,
//         };
//     },
// };



/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";

const createCheckoutSession = async (
  userId: string,
  ideaId: string
) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
  });

  if (!idea || idea.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Idea not found");
  }

  // Paid idea only
  if (!idea.price || idea.price <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This idea is not available for purchase"
    );
  }

  // Prevent duplicate purchase
  const existingPayment = await prisma.payment.findUnique({
    where: {
      userId_ideaId: {
        userId,
        ideaId,
      },
    },
  });

  if (existingPayment?.status === "SUCCESS") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already purchased this idea"
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],

    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(idea.price * 100),

          product_data: {
            name: idea.title,
            description:
              idea.problemStatement ||
              idea.description ||
              undefined,
          },
        },
      },
    ],

    metadata: {
      userId,
      ideaId,
    },

    success_url: `${envVars.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${envVars.FRONTEND_URL}/payment-cancel?ideaId=${ideaId}`,
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
};

const handleStripeWebhook = async (event: any) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      const userId = session.metadata?.userId;
      const ideaId = session.metadata?.ideaId;

      if (!userId || !ideaId) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Missing webhook metadata"
        );
      }

      const transactionId =
        session.payment_intent || session.id;

      const amount =
        Number(session.amount_total || 0) / 100;

      await prisma.payment.upsert({
        where: {
          userId_ideaId: {
            userId,
            ideaId,
          },
        },

        update: {
          amount,
          transactionId,
          status: "SUCCESS",
        },

        create: {
          userId,
          ideaId,
          amount,
          transactionId,
          status: "SUCCESS",
        },
      });

      return {
        message: "Payment completed successfully",
      };
    }

    case "payment_intent.payment_failed": {
      console.log("Payment failed");
      break;
    }

    case "checkout.session.expired": {
      console.log("Checkout session expired");
      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return null;
};

const verifyPayment = async (
  userId: string,
  ideaId: string
) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
  });

  if (!idea || idea.isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Idea not found"
    );
  }

  // Free idea
  if (!idea.price || idea.price <= 0) {
    return {
      hasPaid: true,
      message: "Free idea",
    };
  }

  const payment = await prisma.payment.findUnique({
    where: {
      userId_ideaId: {
        userId,
        ideaId,
      },
    },
  });

  if (!payment || payment.status !== "SUCCESS") {
    throw new AppError(
      httpStatus.PAYMENT_REQUIRED,
      "Payment required to access this idea"
    );
  }

  return {
    hasPaid: true,
    payment,
  };
};

export const PaymentService = {
  createCheckoutSession,
  handleStripeWebhook,
  verifyPayment,
};





// import Stripe from "stripe";
// import config from "../../config";
// import { TIPaymentResult, TPaymentConfirmation, TPaymentIntent } from "./payment.interface";
// import AppError from "../../errors/AppError";
// import { prisma } from "../../lib/prisma";
// import httpStatus from "http-status";

// const stripe = new Stripe(config.stripe_secret_key as string, {
//   apiVersion: "2023-10-16" as any,
// });

// const MAX_STRIPE_AMOUNT_USD = 999999.99;
// const MAX_STRIPE_AMOUNT_CENTS = 99999999;

// const createPaymentIntent = async (payload: TPaymentIntent): Promise<TIPaymentResult> => {
//   const { ideaId, userId, amount: requestedAmount } = payload;

//   if (!ideaId || !userId) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Idea ID and User ID are required");
//   }

//   // ১. চেক করুন আইডিয়াটি ডাটাবেজে আছে কিনা
//   const idea = await prisma.idea.findUnique({
//     where: { id: ideaId },
//   });

//   if (!idea) {
//     throw new AppError(httpStatus.NOT_FOUND, "Idea not found");
//   }

//   // ২. চেক করুন এই ইউজার অলরেডি এই আইডিয়াতে পেমেন্ট করেছেন কিনা (@@unique([userId, ideaId]))
//   const existingPayment = await prisma.payment.findUnique({
//     where: {
//       userId_ideaId: {
//         userId,
//         ideaId,
//       },
//     },
//   });

//   if (existingPayment && existingPayment.status === "SUCCESS") {
//     throw new AppError(httpStatus.BAD_REQUEST, "You have already paid for this idea");
//   }

//   // ৩. অ্যামাউন্ট ভ্যালিডেশন (আইডিয়া টেবিল থেকে ফিক্সড প্রাইস হলে idea.price নিবেন, নতুবা রিকোয়েস্ট বডি থেকে)
//   const amountInDollars = Number(requestedAmount || idea.price); 
  
//   if (isNaN(amountInDollars) || amountInDollars <= 0) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Invalid payment amount");
//   }

//   if (amountInDollars > MAX_STRIPE_AMOUNT_USD) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       `Payment amount cannot exceed $${MAX_STRIPE_AMOUNT_USD.toLocaleString()}`
//     );
//   }

//   const amountInCents = Math.round(amountInDollars * 100);

//   // ৪. স্ট্রাইপ পেমেন্ট ইনটেন্ট তৈরি
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: amountInCents,
//     currency: "usd",
//     metadata: { ideaId, userId },
//     automatic_payment_methods: { enabled: true },
//   });

//   return {
//     clientSecret: paymentIntent.client_secret!,
//     amount: amountInDollars,
//     transactionId: paymentIntent.id,
//   };
// };

// const savePaymentRecord = async (payload: TPaymentConfirmation) => {
//   return await prisma.$transaction(async (tx) => {
//     // ১. ট্রানজেকশন আইডি দিয়ে আগের রেকর্ড চেক
//     const existingPayment = await tx.payment.findUnique({
//       where: { transactionId: payload.transactionId },
//     });

//     if (existingPayment) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Payment record already exists");
//     }

//     // ২. নতুন পেমেন্ট রেকর্ড তৈরি (EconSpark Model অনুযায়ী)
//     const payment = await tx.payment.create({
//       data: {
//         userId: payload.userId,
//         ideaId: payload.ideaId,
//         transactionId: payload.transactionId,
//         amount: Number(payload.amount), // Float টাইপ হ্যান্ডেল করার জন্য
//         status: payload.status === "succeeded" ? "SUCCESS" : "FAILED",
//       },
//     });

//     // ৩. পেমেন্ট সফল হলে যদি Idea টেবিলে কোনো স্ট্যাটাস আপডেট করতে চান (ঐচ্ছিক)
//     // if (payload.status === "succeeded") {
//     //   await tx.idea.update({
//     //     where: { id: payload.ideaId },
//     //     data: { isFunded: true }, // আপনার মডেল অনুযায়ী পরিবর্তন করতে পারেন
//     //   });
//     // }

//     return payment;
//   });
// };

// export const PaymentService = {
//   createPaymentIntent,
//   savePaymentRecord,
// };