export type TCreateIdea = {
    title: string;
    problemStatement: string;
    proposedSolution: string;
    description: string;
    images?: string[];
    categoryId: string;
    paymentStatus?: 'FREE' | 'PAID';
    price?: number | null;
};

export type TUpdateIdea = Partial<{
    title: string;
    problemStatement: string;
    proposedSolution: string;
    description: string;
    images: string[];
    categoryId: string;
    paymentStatus: 'FREE' | 'PAID';
    price: number | null;
}>;

export type TIdeaQuery = {
    page?: string;
    limit?: string;
    sort?: 'recent' | 'topVoted' | 'mostCommented';
    category?: string;
    isPaid?: 'free' | 'paid';
    search?: string;
    minVotes?: string;
};

export type TIdeaStatusPayload = {
    feedback: string;
};