import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

export const NewsletterService = {
    async subscribe(email: string) {
        const existing = await prisma.newsletter.findUnique({
            where: { email },
        });

        if (existing && existing.isActive) {
            throw new AppError(httpStatus.CONFLICT, 'Email is already subscribed');
        }

        if (existing) {
            return prisma.newsletter.update({
                where: { email },
                data: { isActive: true },
            });
        }

        return prisma.newsletter.create({
            data: { email, isActive: true },
        });
    },

    async unsubscribe(email: string) {
        const existing = await prisma.newsletter.findUnique({
            where: { email },
        });

        if (!existing || !existing.isActive) {
            throw new AppError(httpStatus.NOT_FOUND, 'Email is not subscribed');
        }

        return prisma.newsletter.update({
            where: { email },
            data: { isActive: false },
        });
    },
};