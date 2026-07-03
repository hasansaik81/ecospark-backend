// import { z } from 'zod';
// import {
//     IdeaSortableFields,
//     PaymentStatusValues,
// } from './idea.constant';

// const createIdea = z.object({
//     body: z
//         .object({
//             title: z.string().min(3, 'Title must be at least 3 characters'),
//             problemStatement: z
//                 .string()
//                 .min(10, 'Problem statement must be at least 10 characters'),
//             proposedSolution: z
//                 .string()
//                 .min(10, 'Proposed solution must be at least 10 characters'),
//             description: z
//                 .string()
//                 .min(10, 'Description must be at least 10 characters'),
//             images: z.array(z.string().url()).optional(),
//             categoryId: z.string().uuid('categoryId must be a valid UUID'),
//             paymentStatus: z.enum(PaymentStatusValues).optional(),
//             price: z.number().positive('Price must be greater than zero').optional().nullable(),
//         })
//         .superRefine((data, ctx) => {
//             if (data.paymentStatus === 'PAID' && (data.price === undefined || data.price === null)) {
//                 ctx.addIssue({
//                     code: z.ZodIssueCode.custom,
//                     message: 'Price is required for paid ideas',
//                     path: ['price'],
//                 });
//             }

//             if (data.paymentStatus === 'FREE' && data.price != null) {
//                 ctx.addIssue({
//                     code: z.ZodIssueCode.custom,
//                     message: 'Free ideas should not include a price',
//                     path: ['price'],
//                 });
//             }
//         }),
// });

// const updateIdea = z.object({
//     params: z.object({
//         id: z.string().uuid('Idea id must be a valid UUID'),
//     }),
//     body: z
//         .object({
//             title: z.string().min(3).optional(),
//             problemStatement: z.string().min(10).optional(),
//             proposedSolution: z.string().min(10).optional(),
//             description: z.string().min(10).optional(),
//             images: z.array(z.string().url()).optional(),
//             categoryId: z.string().uuid('categoryId must be a valid UUID').optional(),
//             paymentStatus: z.enum(PaymentStatusValues).optional(),
//             price: z.number().positive('Price must be greater than zero').optional().nullable(),
//         })
//         .superRefine((data, ctx) => {
//             if (data.paymentStatus === 'PAID' && (data.price === undefined || data.price === null)) {
//                 ctx.addIssue({
//                     code: z.ZodIssueCode.custom,
//                     message: 'Price is required for paid ideas',
//                     path: ['price'],
//                 });
//             }

//             if (data.paymentStatus === 'FREE' && data.price != null) {
//                 ctx.addIssue({
//                     code: z.ZodIssueCode.custom,
//                     message: 'Free ideas should not include a price',
//                     path: ['price'],
//                 });
//             }
//         }),
// });

// const rejectIdea = z.object({
//     params: z.object({
//         id: z.string().uuid('Idea id must be a valid UUID'),
//     }),
//     body: z.object({
//         feedback: z.string().min(5, 'Feedback must be at least 5 characters'),
//     }),
// });

// const submitIdea = z.object({
//     params: z.object({
//         id: z.string().uuid('Idea id must be a valid UUID'),
//     }),
// });

// const getAllIdeas = z.object({
//     query: z.object({
//         page: z.string().optional(),
//         limit: z.string().optional(),
//         sort: z.enum(IdeaSortableFields).optional(),
//         category: z.string().uuid().optional(),
//         isPaid: z.enum(['free', 'paid']).optional(),
//         search: z.string().optional(),
//         minVotes: z
//             .string()
//             .regex(/^[0-9]+$/, 'minVotes must be a non-negative integer')
//             .optional(),
//     }),
// });

// export const ideaValidationSchema = {
//     createIdea,
//     updateIdea,
//     rejectIdea,
//     submitIdea,
//     getAllIdeas,
// };





// import { z } from 'zod';
// import {
//     IdeaSortableFields,
//     PaymentStatusValues,
// } from './idea.constant';

// // ১. ক্রিয়েট আইডিয়া স্কিমা
// const createIdea = z.object({
//     body: z
//         .object({
//             title: z.string().min(3, 'Title must be at least 3 characters'),
//             problemStatement: z
//                 .string()
//                 .min(10, 'Problem statement must be at least 10 characters'),
//             proposedSolution: z
//                 .string()
//                 .min(10, 'Proposed solution must be at least 10 characters'),
//             description: z
//                 .string()
//                 .min(10, 'Description must be at least 10 characters'),
//             images: z.array(z.string().url()).optional(),
//             categoryId: z.string().uuid('categoryId must be a valid UUID'),
//             paymentStatus: z.enum(PaymentStatusValues).optional(),
//             price: z.number().positive('Price must be greater than zero').optional().nullable(),
//         })
//         .superRefine((data, ctx) => {
//             if (data.paymentStatus === 'PAID' && (data.price === undefined || data.price === null)) {
//                 ctx.addIssue({
//                     code: z.ZodIssueCode.custom,
//                     message: 'Price is required for paid ideas',
//                     path: ['price'],
//                 });
//             }

//             if (data.paymentStatus === 'FREE' && data.price != null) {
//                 ctx.addIssue({
//                     code: z.ZodIssueCode.custom,
//                     message: 'Free ideas should not include a price',
//                     path: ['price'],
//                 });
//             }
//         }),
// });

// // ২. আপডেট আইডিয়া স্কিমা
// const updateIdea = z.object({
//     params: z.object({
//         id: z.string().uuid('Idea id must be a valid UUID'),
//     }),
//     body: z
//         .object({
//             title: z.string().min(3).optional(),
//             problemStatement: z.string().min(10).optional(),
//             proposedSolution: z.string().min(10).optional(),
//             description: z.string().min(10).optional(),
//             images: z.array(z.string().url()).optional(),
//             categoryId: z.string().uuid('categoryId must be a valid UUID').optional(),
//             paymentStatus: z.enum(PaymentStatusValues).optional(),
//             price: z.number().positive('Price must be greater than zero').optional().nullable(),
//         })
//         .superRefine((data, ctx) => {
//             if (data.paymentStatus === 'PAID' && (data.price === undefined || data.price === null)) {
//                 ctx.addIssue({
//                     code: z.ZodIssueCode.custom,
//                     message: 'Price is required for paid ideas',
//                     path: ['price'],
//                 });
//             }

//             if (data.paymentStatus === 'FREE' && data.price != null) {
//                 ctx.addIssue({
//                     code: z.ZodIssueCode.custom,
//                     message: 'Free ideas should not include a price',
//                     path: ['price'],
//                 });
//             }
//         }),
// });

// // ৩. রিজেক্ট আইডিয়া স্কিমা
// const rejectIdea = z.object({
//     params: z.object({
//         id: z.string().uuid('Idea id must be a valid UUID'),
//     }),
//     body: z.object({
//         feedback: z.string().min(5, 'Feedback must be at least 5 characters'),
//     }),
// });

// // ৪. সাবমিট আইডিয়া স্কিমা
// const submitIdea = z.object({
//     params: z.object({
//         id: z.string().uuid('Idea id must be a valid UUID'),
//     }),
// });

// // ৫. গেট অল আইডিয়া (কোয়েরি) স্কিমা
// const getAllIdeas = z.object({
//     query: z.object({
//     // 🛠️ idea.validation.ts ফাইলের ভেতর price ফিল্ডটি এভাবে আপডেট করুন:
// price: z
//     .preprocess(
//         (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)), 
//         z.number().positive('Price must be greater than zero')
//     )
//     .optional()
//     .nullable()
//     .optional()
//     .nullable(),
//         limit: z.string().optional(),
//         sort: z.enum(IdeaSortableFields).optional(),
//         category: z.string().uuid().optional(),
//         isPaid: z.enum(['free', 'paid']).optional(),
//         search: z.string().optional(),
//         minVotes: z
//             .string()
//             .regex(/^[0-9]+$/, 'minVotes must be a non-negative integer')
//             .optional(),
//     }),
// });

// export const ideaValidationSchema = {
//     createIdea,
//     updateIdea,
//     rejectIdea,
//     submitIdea,
//     getAllIdeas,
// };





import { z } from 'zod';
import {
    IdeaSortableFields,
    PaymentStatusValues,
} from './idea.constant';

// ==========================================
// ১. ক্রিয়েট আইডিয়া স্কিমা (Create Idea Schema)
// ==========================================
const createIdea = z.object({
    body: z
        .object({
            title: z.string().min(3, 'Title must be at least 3 characters'),
            problemStatement: z
                .string()
                .min(10, 'Problem statement must be at least 10 characters'),
            proposedSolution: z
                .string()
                .min(10, 'Proposed solution must be at least 10 characters'),
            description: z
                .string()
                .min(10, 'Description must be at least 10 characters'),
            images: z.array(z.string().url()).optional(),
            categoryId: z.string().uuid('categoryId must be a valid UUID'),
            
            // 🔄 এটিকে স্ট্রিং হিসেবে রিসিভ করে পরবর্তীতে সার্ভিসে আপারকেস হ্যান্ডেল করা হচ্ছে
            paymentStatus: z.string().optional(),
            
            // 🔢 প্রিপ্রসেস অ্যাড করা হলো যাতে স্ট্রিং বা নাম্বার যাই আসুক সঠিকভাবে কনভার্ট হয়
            price: z
                .preprocess(
                    (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)), 
                    z.number().nonnegative('Price must be a valid non-negative number')
                )
                .optional()
                .nullable(),
        })
        .superRefine((data, ctx) => {
            // ইনপুটকে ট্রিম এবং আপারকেস করে চেক করা হচ্ছে
            const normalizedStatus = data.paymentStatus?.trim().toUpperCase();

            if (normalizedStatus === 'PAID' && (data.price === undefined || data.price === null || data.price <= 0)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Price is required and must be greater than zero for paid ideas',
                    path: ['price'],
                });
            }
        }),
});

// ==========================================
// ২. আপডেট دیدار স্কিমা (Update Idea Schema)
// ==========================================
const updateIdea = z.object({
    params: z.object({
        id: z.string().uuid('Idea id must be a valid UUID'),
    }),
    body: z
        .object({
            title: z.string().min(3).optional(),
            problemStatement: z.string().min(10).optional(),
            proposedSolution: z.string().min(10).optional(),
            description: z.string().min(10).optional(),
            images: z.array(z.string().url()).optional(),
            categoryId: z.string().uuid('categoryId must be a valid UUID').optional(),
            paymentStatus: z.string().optional(),
            price: z
                .preprocess(
                    (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)), 
                    z.number().nonnegative()
                )
                .optional()
                .nullable(),
        })
        .superRefine((data, ctx) => {
            const normalizedStatus = data.paymentStatus?.trim().toUpperCase();
            if (normalizedStatus === 'PAID' && (data.price === undefined || data.price === null || data.price <= 0)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Price is required and must be greater than zero for paid ideas',
                    path: ['price'],
                });
            }
        }),
});

// ==========================================
// ৩. রিজেক্ট আইডিয়া স্কিমা (Reject Idea Schema)
// ==========================================
const rejectIdea = z.object({
    params: z.object({
        id: z.string().uuid('Idea id must be a valid UUID'),
    }),
    body: z.object({
        feedback: z.string().min(5, 'Feedback must be at least 5 characters'),
    }),
});

// ==========================================
// ৪. সাবমিট আইডিয়া স্কিমা (Submit Idea Schema)
// ==========================================
const submitIdea = z.object({
    params: z.object({
        id: z.string().uuid('Idea id must be a valid UUID'),
    }),
});

// ==========================================
// ৫. গেট অল আইডিয়া স্কিমা (Get All Ideas Schema)
// ==========================================
const getAllIdeas = z.object({
    query: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        sort: z.enum(IdeaSortableFields).optional(),
        category: z.string().uuid().optional(),
        isPaid: z.enum(['free', 'paid']).optional(),
        search: z.string().optional(),
        minVotes: z
            .string()
            .regex(/^[0-9]+$/, 'minVotes must be a non-negative integer')
            .optional(),
    }),
});

export const ideaValidationSchema = {
    createIdea,
    updateIdea,
    rejectIdea,
    submitIdea,
    getAllIdeas,
};