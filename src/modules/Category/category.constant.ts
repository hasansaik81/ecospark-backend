/** Fields that will be searched via OR-ILIKE when ?search= is provided */
export const CategorySearchableFields = ['name', 'description'] as const;

/** Fields that are allowed as sortBy values */
export const CategorySortableFields = ['name', 'createdAt', 'updatedAt'] as const;

/** Allowed query param keys that are used for filtering (not search/sort/pagination) */
export const CategoryFilterableFields = ['name'] as const;