export const PaymentSearchableFields = ['transactionId', 'status'] as const;

export const PaymentFilterableFields = ['status', 'userId', 'ideaId'] as const;

export const PaymentSortableFields = ['amount', 'createdAt', 'updatedAt'] as const;
