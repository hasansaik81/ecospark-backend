// ─── Dashboard Types ────────────────────────────────────────────────────────────

export type TAdminStats = {
    totalUsers: number;
    totalIdeas: number;
    totalVotes: number;
    totalRevenue: number;
    ideasByStatus: {
        DRAFT: number;
        UNDER_REVIEW: number;
        APPROVED: number;
        REJECTED: number;
    };
};

export type TMemberStats = {
    totalIdeas: number;
    totalVotesReceived: number;
    totalCommentsReceived: number;
    ideasByStatus: {
        DRAFT: number;
        UNDER_REVIEW: number;
        APPROVED: number;
        REJECTED: number;
    };
};

export type TRejectIdeaPayload = {
    feedback: string;
};