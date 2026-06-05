/** Shape used when creating or updating a category */
export type TCategory = {
    name: string;
    description?: string;
};

/** Shape of accepted query parameters for GET /api/categories */
export type TCategoryQuery = {
    search?: string;    // full-text search across name and description
    name?: string;      // exact filter by name
    page?: string;      // pagination page (default 1)
    limit?: string;     // items per page (default 10)
    sortBy?: string;    // field to sort (name | createdAt | updatedAt)
    sortOrder?: string; // 'asc' | 'desc' (default 'asc' for categories)
};