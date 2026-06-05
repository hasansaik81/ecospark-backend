export type TPaginationOptions = {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
};

export type TPaginationResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
};

/**
 * Build Prisma-compatible pagination & sorting options from raw query strings.
 *
 * @param options - raw query param values (all optional)
 * @param defaultSortBy - field to sort by when none is specified (default: 'createdAt')
 */
const calculatePagination = (
    options: TPaginationOptions,
    defaultSortBy = 'createdAt',
): TPaginationResult => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = options.sortBy || defaultSortBy;
    const sortOrder: 'asc' | 'desc' =
        options.sortOrder === 'asc' ? 'asc' : 'desc';

    return { page, limit, skip, sortBy, sortOrder };
};

export default calculatePagination;
