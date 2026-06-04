import { Role, UserStatus } from '../../../generated/prisma';

export type TUser = {
    id: string;
    email: string;
    name: string;
    password: string;
    profileImage?: string | null;
    role: Role;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
};

export type TUpdateProfile = {
    name?: string;
    profileImage?: string;
};

export type TChangePassword = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export type TUserPublic = Omit<TUser, 'password'>;