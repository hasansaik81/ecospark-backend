export type TCommentPayload = {
    content: string;
    parentId?: string;
};

export type TCommentParams = {
    id: string;
};

export type TCommentTree = {
    id: string;
    content: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    parentId?: string | null;
    author: {
        id: string;
        name: string;
        profileImage?: string | null;
    };
    replies: TCommentTree[];
};