import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { stripe } from '../../config/stripe.config';
import { envVars } from '../../config/env';

export const PaymentService = {
    async createCheckoutSession(userId: string, ideaId: string) {
        const idea = await prisma.idea.findUnique({
            where: { id: ideaId },
        });

        if (!idea || idea.isDeleted) {
            throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
        }

        if (idea.paymentStatus !== 'PAID' || !idea.price || idea.price <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, 'This idea is not available for purchase');
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: idea.title,
                            description: idea.problemStatement || idea.description || undefined,
                        },
                        unit_amount: Math.round(idea.price * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                ideaId,
                userId,
            },
            success_url: `${envVars.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${envVars.FRONTEND_URL}/payment-cancel?ideaId=${ideaId}`,
        });

        return session;
    },

    async handleStripeWebhook(payload: any, signature?: string) {
        let event: any;
        const rawBody = typeof payload === 'string' ? payload : JSON.stringify(payload);

        try {
            if (signature) {
                event = stripe.webhooks.constructEvent(
                    rawBody,
                    signature,
                    envVars.STRIPE.WEBHOOK_SECRET,
                );
            } else {
                event = payload;
            }
        } catch (error) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Stripe webhook signature verification failed');
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as any;
            const ideaId = session.metadata?.ideaId;
            const userId = session.metadata?.userId;
            const transactionId = session.payment_intent || session.id;
            const amount = Number(session.amount_total ?? session.amount_subtotal ?? 0) / 100;

            if (!ideaId || !userId || !transactionId) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Incomplete Stripe session metadata');
            }

            return prisma.payment.upsert({
                where: {
                    userId_ideaId: {
                        userId,
                        ideaId,
                    },
                },
                update: {
                    amount,
                    transactionId,
                    status: 'COMPLETED',
                },
                create: {
                    amount,
                    transactionId,
                    status: 'COMPLETED',
                    user: { connect: { id: userId } },
                    idea: { connect: { id: ideaId } },
                },
            });
        }

        return null;
    },

    async verifyPayment(userId: string, ideaId: string) {
        const idea = await prisma.idea.findUnique({
            where: { id: ideaId },
        });

        if (!idea || idea.isDeleted) {
            throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
        }

        if (idea.paymentStatus !== 'PAID') {
            return {
                hasPaid: true,
                message: 'This idea is free to access',
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

        if (!payment || payment.status !== 'COMPLETED') {
            throw new AppError(httpStatus.PAYMENT_REQUIRED, 'Payment required to access this idea');
        }

        return {
            hasPaid: true,
            payment,
        };
    },
};
