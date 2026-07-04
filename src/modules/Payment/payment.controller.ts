


import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
// import { prisma } from "src/lib/prisma";
import { prisma } from "../../lib/prisma";







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



export const confirmPayment = async (req: Request, res: Response) => {
  const { sessionId, paymentData } = req.body; 

  try {
    
    const updatedPayment = await prisma.payment.update({
      where: {
        id: paymentData.id, 
      },
      data: {
        status: "PAID",
        transactionId: paymentData.payment_intent as string,
        stripePaymentId: paymentData.payment_intent as string,
        paidAt: new Date(),
      },
    });

    console.log(`✅ Payment successful: ${sessionId}`);

    return res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: updatedPayment,
    });

  } catch (error: any) {
    console.error("Payment Confirmation Error:", error);
    
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update payment status",
    });
  }
};


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