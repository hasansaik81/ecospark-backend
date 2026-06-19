// import { z } from 'zod';

// const getCommentsSchema = z.object({
//     params: z.object({
//         id: z.string().uuid({ message: 'Idea id must be a valid UUID' }),
//     }),
// });

// const createCommentSchema = z.object({
//     params: z.object({
//         id: z.string().uuid({ message: 'Idea id must be a valid UUID' }),
//     }),
//     body: z.object({
//         content: z
//             .string({ message: 'Comment content must be a string' })
//             .min(1, 'Comment content is required')
//             .max(1000, 'Comment content must be at most 1000 characters'),
//         parentId: z
//             .string({ message: 'Parent comment id must be a UUID' })
//             .uuid('Parent comment id must be a valid UUID')
//             .optional(),
//     }),
// });

// const deleteCommentSchema = z.object({
//     params: z.object({
//         id: z.string().uuid({ message: 'Comment id must be a valid UUID' }),
//     }),
// });

// export const commentValidationSchema = {
//     getComments: getCommentsSchema,
//     createComment: createCommentSchema,
//     deleteComment: deleteCommentSchema,
// };



import { z } from 'zod';

const getCommentsSchema = z.object({
    params: z.object({
        id: z.string().uuid({ message: 'Idea id must be a valid UUID' }),
    }),
});

// 🚀 এখানে পরিবর্তন করা হয়েছে (params বাদ দেওয়া হয়েছে)
const createCommentSchema = z.object({
    body: z.object({
        content: z
            .string({ message: 'Comment content must be a string' })
            .min(1, 'Comment content is required')
            .max(1000, 'Comment content must be at most 1000 characters'),
        parentId: z
            .string({ message: 'Parent comment id must be a UUID' })
            .uuid('Parent comment id must be a valid UUID')
            .optional(),
    }),
});

const deleteCommentSchema = z.object({
    params: z.object({
        id: z.string().uuid({ message: 'Comment id must be a valid UUID' }),
    }),
});

export const commentValidationSchema = {
    getComments: getCommentsSchema,
    createComment: createCommentSchema, // 👈 এখন এটি শুধু body ভ্যালিডেট করবে
    deleteComment: deleteCommentSchema,
};