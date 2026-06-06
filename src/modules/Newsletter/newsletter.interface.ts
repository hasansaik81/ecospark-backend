export type TNewsletterPayload = {
    email: string;
};

export type TNewsletter = {
    id: string;
    email: string;
    isActive: boolean;
    subscribedAt: Date;
};