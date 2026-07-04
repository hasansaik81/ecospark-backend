// // import httpStatus from 'http-status';
// // import AppError from '../../errors/AppError';
// // import { prisma } from '../../lib/prisma';
// // import { stripe } from '../../config/stripe.config';
// // import { envVars } from '../../config/env';

// import { envVars } from "../../config/env";
// import { stripe } from "../../config/stripe.config";
// import AppError from "../../errors/AppError";
// import { prisma } from "../../lib/prisma";

// // export const PaymentService = {
// //     async createCheckoutSession(userId: string, ideaId: string) {
// //         const idea = await prisma.idea.findUnique({
// //             where: { id: ideaId },
// //         });

// //         if (!idea || idea.isDeleted) {
// //             throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
// //         }

// //         if (idea.paymentStatus !== 'PAID' || !idea.price || idea.price <= 0) {
// //             throw new AppError(httpStatus.BAD_REQUEST, 'This idea is not available for purchase');
// //         }

// //         const session = await stripe.checkout.sessions.create({
// //             payment_method_types: ['card'],
// //             mode: 'payment',
// //             line_items: [
// //                 {
// //                     price_data: {
// //                         currency: 'usd',
// //                         product_data: {
// //                             name: idea.title,
// //                             description: idea.problemStatement || idea.description || undefined,
// //                         },
// //                         unit_amount: Math.round(idea.price * 100),
// //                     },
// //                     quantity: 1,
// //                 },
// //             ],
// //             metadata: {
// //                 ideaId,
// //                 userId,
// //             },
// //             success_url: `${envVars.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
// //             cancel_url: `${envVars.FRONTEND_URL}/payment-cancel?ideaId=${ideaId}`,
// //         });

// //         return session;
// //     },

// //     async handleStripeWebhook(payload: any, signature?: string) {
// //         let event: any;
// //         const rawBody = typeof payload === 'string' ? payload : JSON.stringify(payload);

// //         try {
// //             if (signature) {
// //                 event = stripe.webhooks.constructEvent(
// //                     rawBody,
// //                     signature,
// //                     envVars.STRIPE.WEBHOOK_SECRET,
// //                 );
// //             } else {
// //                 event = payload;
// //             }
// //         } catch (error) {
// //             throw new AppError(httpStatus.BAD_REQUEST, 'Stripe webhook signature verification failed');
// //         }

// //         if (event.type === 'checkout.session.completed') {
// //             const session = event.data.object as any;
// //             const ideaId = session.metadata?.ideaId;
// //             const userId = session.metadata?.userId;
// //             const transactionId = session.payment_intent || session.id;
// //             const amount = Number(session.amount_total ?? session.amount_subtotal ?? 0) / 100;

// //             if (!ideaId || !userId || !transactionId) {
// //                 throw new AppError(httpStatus.BAD_REQUEST, 'Incomplete Stripe session metadata');
// //             }

// //             return prisma.payment.upsert({
// //                 where: {
// //                     userId_ideaId: {
// //                         userId,
// //                         ideaId,
// //                     },
// //                 },
// //                 update: {
// //                     amount,
// //                     transactionId,
// //                     status: 'COMPLETED',
// //                 },
// //                 create: {
// //                     amount,
// //                     transactionId,
// //                     status: 'COMPLETED',
// //                     user: { connect: { id: userId } },
// //                     idea: { connect: { id: ideaId } },
// //                 },
// //             });
// //         }

// //         return null;
// //     },

// //     async verifyPayment(userId: string, ideaId: string) {
// //         const idea = await prisma.idea.findUnique({
// //             where: { id: ideaId },
// //         });

// //         if (!idea || idea.isDeleted) {
// //             throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
// //         }

// //         if (idea.paymentStatus !== 'PAID') {
// //             return {
// //                 hasPaid: true,
// //                 message: 'This idea is free to access',
// //             };
// //         }

// //         const payment = await prisma.payment.findUnique({
// //             where: {
// //                 userId_ideaId: {
// //                     userId,
// //                     ideaId,
// //                 },
// //             },
// //         });

// //         if (!payment || payment.status !== 'COMPLETED') {
// //             throw new AppError(httpStatus.PAYMENT_REQUIRED, 'Payment required to access this idea');
// //         }

// //         return {
// //             hasPaid: true,
// //             payment,
// //         };
// //     },
// // };



// /* eslint-disable @typescript-eslint/no-explicit-any */



// // const createCheckoutSession = async (
// //   userId: string,
// //   ideaId: string
// // ) => {
// //   const idea = await prisma.idea.findUnique({
// //     where: { id: ideaId },
// //   });

// //   if (!idea || idea.isDeleted) {
// //     throw new AppError(httpStatus.NOT_FOUND, "Idea not found");
// //   }

// //   if (idea.paymentStatus !== "PAID") {
// //     throw new AppError(
// //       httpStatus.BAD_REQUEST,
// //       "This idea is free and does not require purchase"
// //     );
// //   }

// //   if (!idea.price || idea.price <= 0) {
// //     throw new AppError(
// //       httpStatus.BAD_REQUEST,
// //       "This paid idea has an invalid price"
// //     );
// //   }

// //   // Prevent duplicate purchase
// //   const existingPayment = await prisma.payment.findUnique({
// //     where: {
// //       userId_ideaId: {
// //         userId,
// //         ideaId,
// //       },
// //     },
// //   });

// //   if (existingPayment?.status === "SUCCESS") {
// //     throw new AppError(
// //       httpStatus.BAD_REQUEST,
// //       "You have already purchased this idea"
// //     );
// //   }

// //   const session = await stripe.checkout.sessions.create({
// //     mode: "payment",
// //     payment_method_types: ["card"],

// //     line_items: [
// //       {
// //         quantity: 1,
// //         price_data: {
// //           currency: "usd",
// //           unit_amount: Math.round(idea.price * 100),

// //           product_data: {
// //             name: idea.title,
// //             description:
// //               idea.problemStatement ||
// //               idea.description ||
// //               undefined,
// //           },
// //         },
// //       },
// //     ],

// //     metadata: {
// //       userId,
// //       ideaId,
// //     },

// //     success_url: `${envVars.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

// //     cancel_url: `${envVars.FRONTEND_URL}/payment-cancel?ideaId=${ideaId}`,
// //   });

// //   return {
// //     sessionId: session.id,
// //     url: session.url,
// //   };
// // };
// // import Stripe from "stripe";
// // import { stripe } from "../../config/stripe.config";

// import httpStatus from "http-status";
// import AppError from "../../errors/AppError";
// import { prisma } from "../../lib/prisma";
// import { stripe } from "../../config/stripe.config";
// import { envVars } from "../../config/env";


// const createCheckoutSession = async (
//   userId: string,
//   ideaId: string
// ) => {
//   const idea = await prisma.idea.findUnique({
//     where: { id: ideaId },
//   });

//   if (!idea || idea.isDeleted) {
//     throw new AppError(httpStatus.NOT_FOUND, "Idea not found");
//   }

//   console.log("IDEA DEBUG:", {
//     id: idea.id,
//     status: idea.status,
//     paymentStatus: idea.paymentStatus,
//     price: idea.price,
//   });


//   // 🔒 Only approved ideas allowed
//   if (idea.status !== "APPROVED") {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "This idea is not published for purchase yet."
//     );
//   }

//   console.log("IDEA DEBUG:", idea);

//   const price = idea.price ?? 0;

//   const isPaidIdea =
//     idea.paymentStatus === "PAID" && price > 0;

//   if (!isPaidIdea) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "This idea is free and does not require purchase"
//     );
//   }

//   const existingPayment = await prisma.payment.findUnique({
//     where: {
//       userId_ideaId: { userId, ideaId },
//     },
//   });

//   if (existingPayment?.status === "SUCCESS") {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "You have already purchased this idea"
//     );
//   }

//   const session = await stripe.checkout.sessions.create({
//     mode: "payment",
//     payment_method_types: ["card"],

//     line_items: [
//       {
//         quantity: 1,
//         price_data: {
//           currency: "usd",
//           unit_amount: Math.round(price * 100),

//           product_data: {
//             name: idea.title,
//             description:
//               idea.problemStatement ||
//               idea.description ||
//               undefined,
//           },
//         },
//       },
//     ],

//     metadata: {
//       userId,
//       ideaId,
//     },

//     success_url: `${envVars.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${envVars.FRONTEND_URL}/payment-cancel?ideaId=${ideaId}`,
//   });

//   return {
//     sessionId: session.id,
//     url: session.url,
//   };
// };







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

// // ###############################################

// // const verifyPayment = async (
// //   userId: string,
// //   ideaId: string
// // ) => {
// //   const idea = await prisma.idea.findUnique({
// //     where: { id: ideaId },
// //   });

// //   if (!idea || idea.isDeleted) {
// //     throw new AppError(
// //       httpStatus.NOT_FOUND,
// //       "Idea not found"
// //     );
// //   }

// //   // Free idea
// //   if (!idea.price || idea.price <= 0) {
// //     return {
// //       hasPaid: true,
// //       message: "Free idea",
// //     };
// //   }

// //   const payment = await prisma.payment.findUnique({
// //     where: {
// //       userId_ideaId: {
// //         userId,
// //         ideaId,
// //       },
// //     },
// //   });

// //   if (!payment || payment.status !== "SUCCESS") {
// //     throw new AppError(
// //       httpStatus.PAYMENT_REQUIRED,
// //       "Payment required to access this idea"
// //     );
// //   }

// //   return {
// //     hasPaid: true,
// //     payment,
// //   };
// // };

// const verifyPayment = async (userId: string, ideaId: string) => {
//   // ১. আইডিয়াটি আসলেই এক্সিস্ট করে কিনা চেক করা
//   const idea = await prisma.idea.findUnique({
//     where: { id: ideaId },
//   });

//   if (!idea || idea.isDeleted) {
//     throw new AppError(httpStatus.NOT_FOUND, "Idea not found");
//   }

//   // 💡 ২. আইডিয়াটি ফ্রি হলে সরাসরি ট্রু রিটার্ন
//   if (!idea.price || idea.price <= 0) {
//     return {
//       hasPaid: true,
//       isFree: true,
//       message: "Free idea access granted",
//     };
//   }

//   // 🔄 ৩. ইউনিক কম্পাউন্ড ইনডেক্স দিয়ে পেমেন্ট চেক
//   const payment = await prisma.payment.findUnique({
//     where: {
//       userId_ideaId: {
//         userId,
//         ideaId,
//       },
//     },
//   });

//   // 🔒 ৪. পেমেন্ট না থাকলে বা সাকসেস না হলে (এখানে এরর থ্রো না করে অবজেক্ট পাঠানো ফ্রন্টএন্ডের জন্য সহজ)
//   if (!payment || payment.status !== "SUCCESS") {
//     return {
//       hasPaid: false,
//       message: "Payment required to access this idea",
//     };
//   }

//   // ✅ ৫. পেমেন্ট সফল হলে
//   return {
//     hasPaid: true,
//     payment,
//   };
// };



// export const PaymentService = {
//   createCheckoutSession,
//   handleStripeWebhook,
//   verifyPayment,
// };





// // import Stripe from "stripe";
// // import config from "../../config";
// // import { TIPaymentResult, TPaymentConfirmation, TPaymentIntent } from "./payment.interface";
// // import AppError from "../../errors/AppError";
// // import { prisma } from "../../lib/prisma";
// // import httpStatus from "http-status";

// // const stripe = new Stripe(config.stripe_secret_key as string, {
// //   apiVersion: "2023-10-16" as any,
// // });

// // const MAX_STRIPE_AMOUNT_USD = 999999.99;
// // const MAX_STRIPE_AMOUNT_CENTS = 99999999;

// // const createPaymentIntent = async (payload: TPaymentIntent): Promise<TIPaymentResult> => {
// //   const { ideaId, userId, amount: requestedAmount } = payload;

// //   if (!ideaId || !userId) {
// //     throw new AppError(httpStatus.BAD_REQUEST, "Idea ID and User ID are required");
// //   }

// //   // ১. চেক করুন আইডিয়াটি ডাটাবেজে আছে কিনা
// //   const idea = await prisma.idea.findUnique({
// //     where: { id: ideaId },
// //   });

// //   if (!idea) {
// //     throw new AppError(httpStatus.NOT_FOUND, "Idea not found");
// //   }

// //   // ২. চেক করুন এই ইউজার অলরেডি এই আইডিয়াতে পেমেন্ট করেছেন কিনা (@@unique([userId, ideaId]))
// //   const existingPayment = await prisma.payment.findUnique({
// //     where: {
// //       userId_ideaId: {
// //         userId,
// //         ideaId,
// //       },
// //     },
// //   });

// //   if (existingPayment && existingPayment.status === "SUCCESS") {
// //     throw new AppError(httpStatus.BAD_REQUEST, "You have already paid for this idea");
// //   }

// //   // ৩. অ্যামাউন্ট ভ্যালিডেশন (আইডিয়া টেবিল থেকে ফিক্সড প্রাইস হলে idea.price নিবেন, নতুবা রিকোয়েস্ট বডি থেকে)
// //   const amountInDollars = Number(requestedAmount || idea.price); 
  
// //   if (isNaN(amountInDollars) || amountInDollars <= 0) {
// //     throw new AppError(httpStatus.BAD_REQUEST, "Invalid payment amount");
// //   }

// //   if (amountInDollars > MAX_STRIPE_AMOUNT_USD) {
// //     throw new AppError(
// //       httpStatus.BAD_REQUEST,
// //       `Payment amount cannot exceed $${MAX_STRIPE_AMOUNT_USD.toLocaleString()}`
// //     );
// //   }

// //   const amountInCents = Math.round(amountInDollars * 100);

// //   // ৪. স্ট্রাইপ পেমেন্ট ইনটেন্ট তৈরি
// //   const paymentIntent = await stripe.paymentIntents.create({
// //     amount: amountInCents,
// //     currency: "usd",
// //     metadata: { ideaId, userId },
// //     automatic_payment_methods: { enabled: true },
// //   });

// //   return {
// //     clientSecret: paymentIntent.client_secret!,
// //     amount: amountInDollars,
// //     transactionId: paymentIntent.id,
// //   };
// // };

// // const savePaymentRecord = async (payload: TPaymentConfirmation) => {
// //   return await prisma.$transaction(async (tx) => {
// //     // ১. ট্রানজেকশন আইডি দিয়ে আগের রেকর্ড চেক
// //     const existingPayment = await tx.payment.findUnique({
// //       where: { transactionId: payload.transactionId },
// //     });

// //     if (existingPayment) {
// //       throw new AppError(httpStatus.BAD_REQUEST, "Payment record already exists");
// //     }

// //     // ২. নতুন পেমেন্ট রেকর্ড তৈরি (EconSpark Model অনুযায়ী)
// //     const payment = await tx.payment.create({
// //       data: {
// //         userId: payload.userId,
// //         ideaId: payload.ideaId,
// //         transactionId: payload.transactionId,
// //         amount: Number(payload.amount), // Float টাইপ হ্যান্ডেল করার জন্য
// //         status: payload.status === "succeeded" ? "SUCCESS" : "FAILED",
// //       },
// //     });

// //     // ৩. পেমেন্ট সফল হলে যদি Idea টেবিলে কোনো স্ট্যাটাস আপডেট করতে চান (ঐচ্ছিক)
// //     // if (payload.status === "succeeded") {
// //     //   await tx.idea.update({
// //     //     where: { id: payload.ideaId },
// //     //     data: { isFunded: true }, // আপনার মডেল অনুযায়ী পরিবর্তন করতে পারেন
// //     //   });
// //     // }

// //     return payment;
// //   });
// // };

// // export const PaymentService = {
// //   createPaymentIntent,
// //   savePaymentRecord,
// // };

import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import { stripe } from '../../config/stripe.config';
import { envVars } from '../../config/env';
import { Stripe } from 'stripe/cjs/stripe.core';
import { PaymentStatus } from '../../../generated/prisma';





const createCheckoutSession = async (userId: string, ideaId: string) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
  });

  console.log("========== IDEA DEBUG ==========");
console.log("ID:", idea?.id);
console.log("Status:", idea?.status);
console.log("Payment Status:", idea?.paymentStatus);
console.log("Price:", idea?.price);
console.log("================================");
  

  if (!idea || idea.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Idea not found");
  }

  if (idea.status !== "APPROVED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This idea is not published for purchase yet."
    );
  }

  const price = idea.price ?? 0;
  const isPaidIdea = idea.paymentStatus === "PAID" && price > 0;

  if (!isPaidIdea) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This idea is free and does not require purchase"
    );
  }

  // Check if already purchased
  // const existingPayment = await prisma.payment.findUnique({
  //   where: {
  //     userId_ideaId: { userId, ideaId },
  //   },
  // });

  // if (existingPayment?.status === "SUCCESS" || existingPayment?.status === "PAID") {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "You have already purchased this idea"
  //   );
  // }

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


  // Create Stripe session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(price * 100),
          product_data: {
            name: idea.title,
            description: idea.problemStatement || idea.description || undefined,
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

  

  console.log({
  price: idea.price,
  paymentStatus: idea.paymentStatus,
  status: idea.status,
});

  // ✅ Create payment record with PENDING status
  const payment = await prisma.payment.create({
    data: {
      userId,
      ideaId,
      stripeSessionId: session.id,
      amount: price,
      currency: "usd",
      status: "PENDING",
      paymentMethod: "stripe",
      transactionId: session.id, // temporary, will be updated later
    },
  });

  

  return {
    sessionId: session.id,
    url: session.url,
    paymentId: payment.id,
  };
};

// ✅ Update payment status from webhook
// const updatePaymentStatus = async (sessionId: string) => {
//   try {
//     // Retrieve session from Stripe
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
    
//     if (session.payment_status === 'paid') {
//       // Find payment by stripeSessionId
//       const payment = await prisma.payment.findFirst({
//         where: { 
//           stripeSessionId: sessionId 
//         },
//       });

//       if (!payment) {
//         console.error(`❌ Payment not found for session: ${sessionId}`);
//         return null;
//       }

//       // ✅ Update payment record
//       const updatedPayment = await prisma.payment.update({
//         where: { id: payment.id },
//         data: {
//           status: "PAID",
//           transactionId: session.payment_intent as string, // Update with actual transaction ID
//           stripePaymentIntentId: session.payment_intent as string,
//           paidAt: new Date(),
//         },
//       });

//       // ✅ Update idea payment status
//       await prisma.idea.update({
//         where: { id: payment.ideaId },
//         data: {
//           paymentStatus: "PAID",
//         },
//       });

//       console.log(`✅ Payment successful for session: ${sessionId}`);
//       return updatedPayment;
//     }
//   } catch (error) {
//     console.error(`❌ Error updating payment: ${error}`);
//     throw error;
//   }
// };



const updatePaymentStatus = async (sessionId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return null;
    }

    const payment = await prisma.payment.findFirst({
      where: {
        stripeSessionId: sessionId,
      },
    });

    if (!payment) {
      console.error(`❌ Payment not found for session: ${sessionId}`);
      return null;
    }

    // Already updated
    if (payment.status === "PAID") {
      console.log("✅ Payment already updated.");
      return payment;
    }

    const updatedPayment = await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "PAID",
        transactionId: session.payment_intent as string,
        stripePaymentId: session.payment_intent as string,
        paidAt: new Date(),
      },
    });

    console.log(`✅ Payment successful: ${sessionId}`);

    return updatedPayment;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// ✅ Webhook handler
// const handleStripeWebhook = async (rawBody: any, signature: string) => {
//   const secret = process.env.STRIPE_WEBHOOK_SECRET;
  
//   if (!secret) {
//     console.error("❌ STRIPE_WEBHOOK_SECRET is missing!");
//     return { success: false, message: "Webhook secret missing" };
//   }

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(rawBody, signature, secret);
//   } catch (err: any) {
//     console.error(`❌ Webhook signature verification failed: ${err.message}`);
//     return { success: false, message: `Signature Error: ${err.message}` };
//   }

//   try {
//     switch (event.type) {
//       case 'checkout.session.completed': {
//         const session = event.data.object;
//         const sessionId = session.id;
        
//         console.log(`💰 Payment completed for session: ${sessionId}`);
        
//         // ✅ Update database
//         await updatePaymentStatus(sessionId);
        
//         console.log('✅ Payment record updated successfully!');
//         break;
//       }

//       case 'checkout.session.async_payment_succeeded': {
//         const session = event.data.object;
//         console.log(`💰 Async payment succeeded: ${session.id}`);
//         await updatePaymentStatus(session.id);
//         break;
//       }

//       case 'checkout.session.expired': {
//         const session = event.data.object;
//         console.log(`⏰ Session expired: ${session.id}`);
        
//         // Update payment status to FAILED
//         await prisma.payment.updateMany({
//           where: { stripeSessionId: session.id },
//           data: { 
//             status: "PENDING", // or "FAILED" based on your logic
//           },
//         });
//         break;
//       }

//       default:
//         console.log(`ℹ️ Unhandled event type: ${event.type}`);
//     }
//   } catch (error: any) {
//     console.error(`❌ Webhook processing error: ${error.message}`);
//     return { success: false, message: error.message };
//   }

//   return { success: true, message: "Webhook processed successfully" };
// };



const handleStripeWebhook = async (
  rawBody: Buffer,
  signature: string
) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      secret
    );
  } catch (err: any) {
    console.error(err.message);

    return {
      success: false,
      message: err.message,
    };
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        console.log("Checkout completed");

        await updatePaymentStatus(session.id);

        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;

        await updatePaymentStatus(session.id);

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;

        await prisma.payment.updateMany({
          where: {
            stripeSessionId: session.id,
          },
          data: {
            status:PaymentStatus.FAILED
          },
        });

        break;
      }

      default:
        console.log(`Unhandled Event: ${event.type}`);
    }

    return {
      success: true,
      message: "Webhook processed successfully",
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }
};


// /


const verifyPayment = async (
  userId: string,
  ideaId: string
) => {
  const idea = await prisma.idea.findUnique({
    where: {
      id: ideaId,
    },
  });

  if (!idea || idea.isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Idea not found"
    );
  }

  // Free Idea
  if (
    idea.paymentStatus === "FREE" ||
    !idea.price ||
    idea.price <= 0
  ) {
    return {
      hasPaid: true,
      isFree: true,
      message: "Free idea access granted",
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

  if (!payment || !["PAID", "APPROVED"].includes(payment.status)) {
    return {
      hasPaid: false,
      status: payment?.status ?? "NOT_FOUND",
      message: "Payment required",
    };
  }

  return {
    hasPaid: true,
    payment,
    message: "Payment verified successfully",
  };
};

export const PaymentService = {
  createCheckoutSession,
  handleStripeWebhook,
  verifyPayment,
  updatePaymentStatus,
};






