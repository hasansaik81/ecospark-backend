import { VoteType } from '../../../generated/prisma';

export type TVotePayload = {
    type: VoteType;
};

export type TVoteParams = {
    id: string;
};
    };