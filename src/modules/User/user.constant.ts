export const UserSearchableFields = ['name', 'email'];

export const UserFilterableFields = ['role', 'status', 'email', 'name'];

export const UserSelectedFields = {
    id: true,
    name: true,
    email: true,
    profileImage: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    password: false,
} as const;