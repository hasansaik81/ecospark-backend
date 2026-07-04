


import { z } from 'zod';

const castVoteSchema = z.object({
    body: z.object({
        type: z.enum(['UPVOTE', 'DOWNVOTE'] as const),
    }),
});

export const voteValidationSchema = {
    castVote: castVoteSchema,
};