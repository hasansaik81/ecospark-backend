// // import Stripe from "stripe";
// // import { prisma } from "../../lib/prisma";
// // import AppError from "../../errors/AppError";
// // import httpStatus from "http-status";

// // type StripeEvent = any;

// // const handleStripeWebhook = async (event: StripeEvent) => {
// //   try {
// //     // 1. Idempotency check
// //     const existingEvent = await prisma.payment.findFirst({
// //       where: {
// //         stripeEventId: event.id,
// //       },
// //     });

// //     if (existingEvent) {
// //       console.log(`Event already processed: ${event.id}`);
// //       return { message: "Already processed" };
// //     }

// //     switch (event.type) {

// //       // =========================
// //       //  PAYMENT SUCCESS (MAIN)
// //       // =========================
// //       case "checkout.session.completed": {
// //         const session = event.data.object as any;

// //         const ideaId = session.metadata?.ideaId;
// //         const userId = session.metadata?.userId;

// //         if (!ideaId || !userId) {
// //           console.log("Missing metadata");
// //           return { message: "Missing metadata" };
// //         }

// //         const idea = await prisma.idea.findUnique({
// //           where: { id: ideaId },
// //         });

// //         if (!idea) {
// //           return { message: "Idea not found" };
// //         }

// //         const paymentIntentId = session.payment_intent;
// //         const amount = Number(session.amount_total / 100);

// //         await prisma.$transaction(async (tx) => {

// //           // 1. Create Payment
// //           await tx.payment.create({
// //             data: {
// //               userId,
// //               ideaId,
// //               transactionId: paymentIntentId,
// //               stripePaymentId: paymentIntentId,
// //               amount,
// //               currency: "usd",
// //               status:
// //                 session.payment_status === "paid"
// //                   ? "SUCCESS"
// //                   : "FAILED",
// //               stripeEventId: event.id,
// //               paymentGatewayData: session,
// //             },
// //           });

// //           // 2. Unlock Idea (IMPORTANT FOR ECOSPARK)
// //           if (session.payment_status === "paid") {
// //             await tx.idea.update({
// //               where: { id: ideaId },
// //               data: {
// //                 paymentStatus: "PAID",
// //               },
// //             });
// //           }
// //         });

// //         console.log("Idea unlocked:", ideaId);
// //         break;
// //       }

// //       // =========================
// //       // PAYMENT FAILED
// //       // =========================
// //       case "payment_intent.payment_failed": {
// //         const intent = event.data.object as any;
// //         console.log("Payment failed:", intent.id);
// //         break;
// //       }

// //       // =========================
// //       // SESSION EXPIRED
// //       // =========================
// //       case "checkout.session.expired": {
// //         const session = event.data.object as any;
// //         console.log("Session expired:", session.id);
// //         break;
// //       }

// //       default:
// //         console.log("Unhandled event:", event.type);
// //     }

// //     return {
// //       message: `Webhook processed: ${event.id}`,
// //     };
// //   } catch (error) {
// //     console.error("Webhook error:", error);
// //     throw new AppError(
// //       httpStatus.INTERNAL_SERVER_ERROR,
// //       "Webhook failed"
// //     );
// //   }
// // };

// // export const PaymentWebhookService = {
// //   handleStripeWebhook,
// // };



// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // import Stripe from "stripe";
// // import { prisma } from "../../lib/prisma";

// // const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
// //     // 🔐 Idempotency check
// //     const existing = await prisma.payment.findUnique({
// //         where: {
// //             transactionId: event.id,
// //         },
// //     });

// //     if (existing) {
// //         console.log("Duplicate event ignored:", event.id);
// //         return { message: "Already processed" };
// //     }

// //     switch (event.type) {
        
// //         //  SUCCESS PAYMENT
        
// //         case "checkout.session.completed": {
// //             const session = event.data.object as any;

// //             const ideaId = session.metadata?.ideaId;
// //             const userId = session.metadata?.userId;

// //             if (!ideaId || !userId) {
// //                 console.error("Missing metadata in Stripe event");
// //                 return { message: "Missing metadata" };
// //             }

// //             // 🔍 verify data
// //             const idea = await prisma.idea.findUnique({
// //                 where: { id: ideaId },
// //             });

// //             const user = await prisma.user.findUnique({
// //                 where: { id: userId },
// //             });

// //             if (!idea || !user) {
// //                 console.error("Idea/User not found");
// //                 return { message: "Invalid references" };
// //             }

// //             const amount = session.amount_total
// //                 ? session.amount_total / 100
// //                 : 0;

// //             // 💾 Payment record (core requirement)
// //             await prisma.payment.upsert({
// //                 where: {
// //                     userId_ideaId: { userId, ideaId },
// //                 },
// //                 update: {
// //                     status: "SUCCESS",
// //                     transactionId: session.id,
// //                     amount,
// //                 },
// //                 create: {
// //                     userId,
// //                     ideaId,
// //                     status: "SUCCESS",
// //                     transactionId: session.id,
// //                     amount,
// //                 },
// //             });

// //             console.log(
// //                 `Payment SUCCESS | User: ${userId} | Idea: ${ideaId}`
// //             );

// //             break;
// //         }

        
// //         //  FAILED / EXPIRED
        
// //         case "checkout.session.expired":
// //         case "payment_intent.payment_failed": {
// //             const session = event.data.object as any;

// //             const ideaId = session.metadata?.ideaId;
// //             const userId = session.metadata?.userId;

// //             if (!ideaId || !userId) return;

// //             const amount = session.amount_total
// //                 ? session.amount_total / 100
// //                 : 0;

// //             await prisma.payment.upsert({
// //                 where: {
// //                     userId_ideaId: { userId, ideaId },
// //                 },
// //                 update: {
// //                     status: "FAILED",
// //                     transactionId: session.id,
// //                 },
// //                 create: {
// //                     userId,
// //                     ideaId,
// //                     status: "FAILED",
// //                     transactionId: session.id,
// //                     amount,
// //                 },
// //             });

// //             console.log(
// //                 `Payment FAILED | User: ${userId} | Idea: ${ideaId}`
// //             );

// //             break;
// //         }

// //         default:
// //             console.log("Unhandled event:", event.type);
// //     }

// //     return { message: "Webhook processed successfully" };
// // };

// // export const PaymentService = {
// //     handlerStripeWebhookEvent,
// // };




// import Stripe from "stripe";
// import { prisma } from "../../lib/prisma";
// import AppError from "../../errors/AppError";
// import httpStatus from "http-status";

// type StripeEvent = any;

// const handleStripeWebhook = async (event: StripeEvent) => {
//   try {
//     // =========================
//     // 1. IDEMPOTENCY CHECK
//     // =========================
//     const existingEvent = await prisma.payment.findFirst({
//       where: {
//         transactionId: event.id,
//       },
//     });

//     if (existingEvent) {
//       console.log(`Already processed event: ${event.id}`);
//       return { message: "Already processed" };
//     }

//     // =========================
//     // 2. HANDLE EVENTS
//     // =========================
//     switch (event.type) {
//       // =========================
//       // PAYMENT SUCCESS (MAIN)
//       // =========================
//       case "checkout.session.completed": {
//         const session = event.data.object as any;

//         const ideaId = session.metadata?.ideaId;
//         const userId = session.metadata?.userId;

//         if (!ideaId || !userId) {
//           console.log("Missing metadata");
//           return { message: "Missing metadata" };
//         }

//         const idea = await prisma.idea.findUnique({
//           where: { id: ideaId },
//         });

//         if (!idea) {
//           return { message: "Idea not found" };
//         }

//         const amount = session.amount_total
//           ? session.amount_total / 100
//           : 0;

//         const isPaid = session.payment_status === "paid";

//         await prisma.$transaction(async (tx) => {
//           // =========================
//           // 1. PAYMENT CREATE/UPDATE
//           // =========================
//           await tx.payment.upsert({
//             where: {
//               userId_ideaId: {
//                 userId,
//                 ideaId,
//               },
//             },
//             update: {
//               status: isPaid ? "SUCCESS" : "FAILED",
//               transactionId: session.id,
//               amount,
//             },
//             create: {
//               userId,
//               ideaId,
//               status: isPaid ? "SUCCESS" : "FAILED",
//               transactionId: session.id,
//               amount,
//             },
//           });

//           // =========================
//           // 2. UNLOCK IDEA (CORE FEATURE)
//           // =========================
//           if (isPaid) {
//             await tx.idea.update({
//               where: { id: ideaId },
//               data: {
//                 paymentStatus: "PAID",
//               },
//             });
//           }
//         });

//         console.log(
//           `Payment ${isPaid ? "SUCCESS" : "FAILED"} | Idea: ${ideaId}`
//         );

//         break;
//       }

//       // =========================
//       // PAYMENT FAILED
//       // =========================
//       case "payment_intent.payment_failed": {
//         const intent = event.data.object as any;

//         console.log("Payment failed:", intent.id);

//         break;
//       }

//       // =========================
//       // SESSION EXPIRED
//       // =========================
//       case "checkout.session.expired": {
//         const session = event.data.object as any;

//         console.log("Session expired:", session.id);

//         break;
//       }

//       default:
//         console.log("Unhandled event:", event.type);
//     }

//     return {
//       message: `Webhook processed: ${event.id}`,
//     };
//   } catch (error) {
//     console.error("Webhook error:", error);

//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Webhook processing failed"
//     );
//   }
// };

// export const PaymentWebhookService = {
//   handleStripeWebhook,
// };