import { z } from 'zod';

const castVoteSchema = z.object({
    body: z.object({
        type: z.enum(['UPVOTE', 'DOWNVOTE'], {
            required_error: 'Vote type is required',
            invalid_type_error: 'Vote type must be UPVOTE or DOWNVOTE',
        }),
    }),
});

export const voteValidationSchema = {
    castVote: castVoteSchema,
};