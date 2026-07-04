

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

  // Create payment record with PENDING status
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
      console.error(` Payment not found for session: ${sessionId}`);
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






