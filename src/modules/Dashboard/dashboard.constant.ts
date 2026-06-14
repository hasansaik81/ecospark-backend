export const DashboardIdeaInclude = {
    category: {
        select: { id: true, name: true },
    },
    author: {
        select: { id: true, name: true, email: true },
    },
    _count: {
        select: { votes: true, comments: true },
    },
} as const;

export const DashboardUserSelect = {
    id: true,
    name: true,
    email: true,
    profileImage: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
} as const;