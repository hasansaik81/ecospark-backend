export const IdeaSearchableFields = [
    'title',
    'problemStatement',
    'proposedSolution',
    'description',
] as const;

export const IdeaSortableFields = ['recent', 'topVoted', 'mostCommented'] as const;

export const IdeaFilterableFields = ['category', 'isPaid'] as const;

export const PaymentStatusValues = ['FREE', 'PAID'] as const;

export const IdeaStatusValues = ['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const;
