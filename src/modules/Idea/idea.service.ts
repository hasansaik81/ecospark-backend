// import httpStatus from 'http-status';
// import AppError from '../../errors/AppError';
// import { prisma } from '../../lib/prisma';
// import calculatePagination from '../../utils/pagination';
// import {
//     IdeaSearchableFields,
//     IdeaSortableFields,
// } from './idea.constant';

// import {
//     TCreateIdea,
//     TIdeaQuery,
//     TUpdateIdea,
//     TIdeaStatusPayload,
// } from './idea.interface';
// import { Prisma } from '../../../generated/prisma';


// ;

// // const buildIdeaWhereClause = (
// //   query: TIdeaQuery,
// //   isAdmin = false,
// //   userId?: string,
// // ): Prisma.IdeaWhereInput => {
// //   const conditions: Prisma.IdeaWhereInput[] = [];

// //   // always exclude deleted
// //   conditions.push({
// //     isDeleted: false,
// //   });

// //   // public filter
// //   if (!isAdmin) {
// //     conditions.push({
// //       status: 'APPROVED',
// //     });
// //   }

// //   if (query.category) {
// //     conditions.push({
// //       categoryId: query.category,
// //     });
// //   }

// //   if (query.search) {
// //     conditions.push({
// //       OR: [
// //         {
// //           title: {
// //             contains: query.search,
// //             mode: 'insensitive',
// //           },
// //         },
// //         {
// //           problemStatement: {
// //             contains: query.search,
// //             mode: 'insensitive',
// //           },
// //         },
// //         {
// //           proposedSolution: {
// //             contains: query.search,
// //             mode: 'insensitive',
// //           },
// //         },
// //       ],
// //     });
// //   }

// //   if (query.isPaid) {
// //     conditions.push({
// //       paymentStatus:
// //         query.isPaid === 'paid'
// //           ? 'PAID'
// //           : 'FREE',
// //     });
// //   }

// //   return {
// //     AND: conditions,
// //   };
// // };


// const buildIdeaWhereClause = (
//     query: TIdeaQuery,
//     isAdmin = false,
//     userId?: string,
// ): Prisma.IdeaWhereInput => {
//     const conditions: Prisma.IdeaWhereInput[] = [];

//     // always exclude deleted
//     conditions.push({
//         isDeleted: false,
//     });

//     // public filter
//     if (!isAdmin) {
//         conditions.push({
//             status: 'APPROVED',
//         });
//     }

//     if (query.category) {
//         conditions.push({
//             categoryId: query.category,
//         });
//     }

//     if (query.search) {
//         conditions.push({
//             OR: [
//                 { title: { contains: query.search, mode: 'insensitive' } },
//                 { problemStatement: { contains: query.search, mode: 'insensitive' } },
//                 { proposedSolution: { contains: query.search, mode: 'insensitive' } },
//             ],
//         });
//     }

//     // 💰 FIXED PAID/FREE LOGIC
//     if (query.isPaid === 'paid') {
//         conditions.push({
//             price: { gt: 0 },
//         });
//     }

//     if (query.isPaid === 'free') {
//         conditions.push({
//             OR: [
//                 { price: null },
//                 { price: 0 },
//             ],
//         });
//     }

//     return {
//         AND: conditions,
//     };
// };



// // const buildIdeaWhereClause = (query: TIdeaQuery, isAdmin = false) => {
// //     const conditions: object[] = [];

// //     if (!isAdmin) {
// //         conditions.push({ status: 'APPROVED' });
// //     }

// //     conditions.push({ isDeleted: false });

// //     if (query.category) {
// //         conditions.push({ categoryId: query.category });
// //     }

// //     if (query.isPaid) {
// //         conditions.push({
// //             paymentStatus: query.isPaid === 'paid' ? 'PAID' : 'FREE',
// //         });
// //     }

// //     if (query.search) {
// //         conditions.push({
// //             OR: IdeaSearchableFields.map((field) => ({
// //                 [field]: { contains: query.search, mode: 'insensitive' },
// //             })),
// //         });
// //     }

// //     if (query.minVotes) {
// //         conditions.push({
// //             votes: {
// //                 _count: {
// //                     gte: Number(query.minVotes),
// //                 },
// //             },
// //         });
// //     }

// //     return conditions.length > 0 ? { AND: conditions } : {};
// // };

// // const resolveOrderBy = (sort?: string) => {
// //     switch (sort) {
// //         case 'topVoted':
// //             return { votes: { _count: 'desc' as const } };
// //         case 'mostCommented':
// //             return { comments: { _count: 'desc' as const } };
// //         case 'recent':
// //         default:
// //             return { createdAt: 'desc' as const };
// //     }
// // };



// // const createIdea = async (payload: TCreateIdea, authorId: string) => {

// //     if (!authorId) {
// //         throw new AppError(
// //             httpStatus.UNAUTHORIZED,
// //             'Author ID is missing. Please login again.'
// //         );
// //     }

// //     // 🧠 build data safely
// //     const data = {
// //         title: payload.title,
// //         problemStatement: payload.problemStatement,
// //         proposedSolution: payload.proposedSolution,
// //         description: payload.description,
// //         images: payload.images || [],
// //         categoryId: payload.categoryId,
// //         paymentStatus: payload.paymentStatus || 'FREE',
// //         price:
// //             payload.paymentStatus === 'PAID'
// //                 ? payload.price ?? 0
// //                 : null,

// //         // 🔥 IMPORTANT FIX (relation fix)
// //         author: {
// //             connect: {
// //                 id: authorId
// //             }
// //         }
// //     };

// //     // 💰 validation for paid idea
// //     if (
// //         data.paymentStatus === 'PAID' &&
// //         (!data.price || data.price <= 0)
// //     ) {
// //         throw new AppError(
// //             httpStatus.BAD_REQUEST,
// //             'Paid ideas require a valid price'
// //         );
// //     }

// //     // 💾 create idea
// //    const result = await prisma.idea.create({
// //     data: {
// //         title: payload.title,
// //         problemStatement: payload.problemStatement,
// //         proposedSolution: payload.proposedSolution,
// //         description: payload.description,
// //         images: payload.images || [],
// //         categoryId: payload.categoryId,
// //         paymentStatus: payload.paymentStatus || 'FREE',
// //         price:
// //             payload.paymentStatus === 'PAID'
// //                 ? payload.price ?? 0
// //                 : null,
// //         authorId: authorId,
// //     },
// //     include: {
// //         category: true,
// //         author: true,
// //     },
// // });

// //     return result;
// // };

// // export default createIdea;




// // const createIdea = async (payload: TCreateIdea, authorId: string) => {

// //     if (!authorId) {
// //         throw new AppError(
// //             httpStatus.UNAUTHORIZED,
// //             'Author ID is missing. Please login again.'
// //         );
// //     }

// //     // 💰 validation first
// //     if (
// //         payload.paymentStatus === 'PAID' &&
// //         (!payload.price || payload.price <= 0)
// //     ) {
// //         throw new AppError(
// //             httpStatus.BAD_REQUEST,
// //             'Paid ideas require a valid price'
// //         );
// //     }

// //     const result = await prisma.idea.create({
// //         data: {
// //             title: payload.title,
// //             problemStatement: payload.problemStatement,
// //             proposedSolution: payload.proposedSolution,
// //             description: payload.description,
// //             images: payload.images || [],
// //             categoryId: payload.categoryId,
// //             paymentStatus: payload.paymentStatus || 'FREE',
// //             price:
// //                 payload.paymentStatus === 'PAID'
// //                     ? payload.price ?? 0
// //                     : null,

// //             // ✅ correct relation
// //             authorId: authorId,
// //         },
// //         include: {
// //             category: true,
// //             author: {
// //                 select: {
// //                     id: true,
// //                     name: true,
// //                     email: true,
// //                     role: true,
// //                     status: true,
// //                     createdAt: true,
// //                 },
// //             },
// //         },
// //     });

// //     return result;
// // };

// // export default createIdea;



// // const getAllIdeas = async (query: TIdeaQuery) => {
// //     const pagination = calculatePagination({
// //         page: query.page,
// //         limit: query.limit,
// //     });

// //     const where = buildIdeaWhereClause(query);
// //     const orderBy = resolveOrderBy(query.sort);

// //     const [ideas, total] = await Promise.all([
// //         prisma.idea.findMany({
// //             where,
// //             include: {
// //                 category: {
// //                     select: { id: true, name: true },
// //                 },
// //                 author: {
// //                     select: { id: true, name: true, email: true },
// //                 },
// //                 _count: {
// //                     select: { votes: true, comments: true },
// //                 },
// //             },
// //             orderBy,
// //             skip: pagination.skip,
// //             take: pagination.limit,
// //         }),
// //         prisma.idea.count({ where }),
// //     ]);

// //     return {
// //         meta: {
// //             page: pagination.page,
// //             limit: pagination.limit,
// //             total,
// //             totalPage: Math.ceil(total / pagination.limit),
// //         },
// //         data: ideas,
// //     };
// // };

// // deep seek ai 


// const createIdea = async (payload: TCreateIdea, authorId: string) => {

//     if (!authorId) {
//         throw new AppError(
//             httpStatus.UNAUTHORIZED,
//             'Author ID is missing. Please login again.'
//         );
//     }

//     // 🔥 Validation: PAID ideas must have a valid price
//     if (
//         payload.paymentStatus === 'PAID' &&
//         (!payload.price || payload.price <= 0)
//     ) {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'Paid ideas require a valid price (must be greater than 0)'
//         );
//     }

//     // 🔥 Validation: FREE ideas should not have a price
//     if (
//         payload.paymentStatus === 'FREE' &&
//         payload.price &&
//         payload.price > 0
//     ) {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'Free ideas cannot have a price. Please set price to null or 0'
//         );
//     }

//     const result = await prisma.idea.create({
//         data: {
//             title: payload.title,
//             problemStatement: payload.problemStatement,
//             proposedSolution: payload.proposedSolution,
//             description: payload.description,
//             images: payload.images || [],
//             categoryId: payload.categoryId,

//             // ✅ Payment logic - CORRECTED
//             paymentStatus: payload.paymentStatus || 'FREE',
//             price: payload.paymentStatus === 'PAID'
//                 ? payload.price  // PAID হলে price রাখুন
//                 : null,          // FREE হলে null সেট করুন

//             // ✅ correct relation
//             authorId: authorId,
//         },
//         include: {
//             category: true,
//             author: {
//                 select: {
//                     id: true,
//                     name: true,
//                     email: true,
//                     role: true,
//                     status: true,
//                     createdAt: true,
//                 },
//             },
//         },
//     });

//     return result;
// };

// export default createIdea;



// // const createIdea = async (payload: TCreateIdea, authorId: string) => {
// //     if (!authorId) {
// //         throw new AppError(
// //             httpStatus.UNAUTHORIZED,
// //             "Author ID is missing. Please login again."
// //         );
// //     }

// //     const paymentStatus = payload.paymentStatus || "FREE";
// //     const price = payload.price ?? 0;

// //     // 💰 validation
// //     if (paymentStatus === "PAID" && price <= 0) {
// //         throw new AppError(
// //             httpStatus.BAD_REQUEST,
// //             "Paid ideas require a valid price"
// //         );
// //     }

// //     const result = await prisma.idea.create({
// //         data: {
// //             title: payload.title,
// //             problemStatement: payload.problemStatement,
// //             proposedSolution: payload.proposedSolution,
// //             description: payload.description,
// //             images: payload.images || [],
// //             categoryId: payload.categoryId,
// //             paymentStatus,
// //             price: paymentStatus === "PAID" ? price : null,
// //             authorId,
// //         },
// //         include: {
// //             category: true,
// //             author: true,
// //         },
// //     });

// //     return result;
// // };


// const getAllIdeas = async (query: TIdeaQuery, userId?: string) => {
//     const pagination = calculatePagination({
//         page: query.page,
//         limit: query.limit,
//     });

//     const where = buildIdeaWhereClause(query, false, userId);
//     const orderBy = resolveOrderBy(query.sort);

//     const [ideas, total] = await Promise.all([
//         prisma.idea.findMany({
//             where,
//             include: {
//                 category: {
//                     select: { id: true, name: true },
//                 },
//                 author: {
//                     select: { id: true, name: true, email: true },
//                 },
//                 _count: {
//                     select: {
//                         votes: true,
//                         comments: true,
//                     },
//                 },
//             },
//             orderBy,
//             skip: pagination.skip,
//             take: pagination.limit,
//         }),

//         prisma.idea.count({ where }),
//     ]);

//     return {
//         meta: {
//             page: pagination.page,
//             limit: pagination.limit,
//             total,
//             totalPage: Math.ceil(total / pagination.limit),
//         },
//         data: ideas,
//     };
// };

// const getAllIdeasAdmin = async (query: TIdeaQuery) => {
//     const pagination = calculatePagination({
//         page: query.page,
//         limit: query.limit,
//     });

//     const where = buildIdeaWhereClause(query, true);
//     const orderBy = resolveOrderBy(query.sort);

//     const [ideas, total] = await Promise.all([
//         prisma.idea.findMany({
//             where,
//             include: {
//                 category: {
//                     select: { id: true, name: true },
//                 },
//                 author: {
//                     select: { id: true, name: true, email: true },
//                 },
//                 _count: {
//                     select: { votes: true, comments: true },
//                 },
//             },
//             orderBy,
//             skip: pagination.skip,
//             take: pagination.limit,
//         }),
//         prisma.idea.count({ where }),
//     ]);

//     return {
//         meta: {
//             page: pagination.page,
//             limit: pagination.limit,
//             total,
//             totalPage: Math.ceil(total / pagination.limit),
//         },
//         data: ideas,
//     };
// };

// const getIdeaById = async (
//     id: string,
//     currentUserId?: string,
//     currentUserRole?: string,
// ) => {
//     const idea = await prisma.idea.findUnique({
//         where: { id },
//         include: {
//             category: {
//                 select: { id: true, name: true },
//             },
//             author: {
//                 select: { id: true, name: true, email: true },
//             },
//             _count: {
//                 select: { votes: true, comments: true },
//             },
//         },
//     });

//     if (!idea || idea.isDeleted) {
//         throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
//     }

//     if (idea.paymentStatus === 'PAID') {
//         const isOwner = currentUserId === idea.authorId;
//         const isAdmin = currentUserRole === 'admin';

//         if (!isOwner && !isAdmin) {
//             if (!currentUserId) {
//                 throw new AppError(
//                     httpStatus.PAYMENT_REQUIRED,
//                     'Payment required to access this idea',
//                 );
//             }

//             const payment = await prisma.payment.findFirst({
//                 where: {
//                     ideaId: id,
//                     userId: currentUserId,
//                     status: {
//                         in: ['SUCCESS', 'PAID'],
//                     },
//                 },
//             });

//             if (!payment) {
//                 throw new AppError(
//                     httpStatus.PAYMENT_REQUIRED,
//                     'Payment required to access this idea',
//                 );
//             }
//         }
//     }

//     return idea;
// };

// const updateIdea = async (
//     id: string,
//     authorId: string,
//     payload: TUpdateIdea,
// ) => {
//     const idea = await prisma.idea.findUnique({
//         where: { id },
//     });

//     if (!idea || idea.isDeleted) {
//         throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
//     }

//     if (idea.authorId !== authorId) {
//         throw new AppError(httpStatus.UNAUTHORIZED, 'You are not the owner of this idea');
//     }

//     if (!['DRAFT', 'REJECTED'].includes(idea.status)) {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'Only draft or rejected ideas can be updated',
//         );
//     }

//     const updatedData: Record<string, unknown> = {
//         ...payload,
//     };

//     if (payload.paymentStatus === 'PAID') {
//         updatedData.price = payload.price ?? idea.price;
//     }

//     if (payload.paymentStatus === 'FREE') {
//         updatedData.price = null;
//     }

//     if (payload.paymentStatus === undefined && payload.price !== undefined) {
//         updatedData.price = payload.price;
//     }

//     return prisma.idea.update({
//         where: { id },
//         data: updatedData,
//     });
// };

// const deleteIdea = async (id: string, authorId: string) => {
//     const idea = await prisma.idea.findUnique({
//         where: { id },
//     });

//     if (!idea || idea.isDeleted) {
//         throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
//     }

//     if (idea.authorId !== authorId) {
//         throw new AppError(httpStatus.UNAUTHORIZED, 'You are not the owner of this idea');
//     }

//     if (!['DRAFT', 'REJECTED'].includes(idea.status)) {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'Only draft or rejected ideas can be deleted',
//         );
//     }

//     return prisma.idea.update({
//         where: { id },
//         data: { isDeleted: true },
//     });
// };

// const submitIdea = async (id: string, authorId: string) => {
//     const idea = await prisma.idea.findUnique({
//         where: { id },
//     });

//     if (!idea || idea.isDeleted) {
//         throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
//     }

//     if (idea.authorId !== authorId) {
//         throw new AppError(httpStatus.UNAUTHORIZED, 'You are not the owner of this idea');
//     }

//     if (!['DRAFT', 'REJECTED'].includes(idea.status)) {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'Only draft or rejected ideas may be submitted for review',
//         );
//     }

//     return prisma.idea.update({
//         where: { id },
//         data: {
//             status: 'UNDER_REVIEW',
//             adminFeedback: null,
//         },
//     });
// };

// const getMyIdeas = async (authorId: string) => {
//     return prisma.idea.findMany({
//         where: {
//             authorId,
//             isDeleted: false,
//         },
//         include: {
//             category: {
//                 select: { id: true, name: true },
//             },
//             _count: {
//                 select: { votes: true, comments: true },
//             },
//         },
//         orderBy: { createdAt: 'desc' },
//     });
// };

// const approveIdea = async (id: string) => {
//     const idea = await prisma.idea.findUnique({
//         where: { id },
//     });

//     if (!idea || idea.isDeleted) {
//         throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
//     }

//     return prisma.idea.update({
//         where: { id },
//         data: {
//             status: 'APPROVED',
//             adminFeedback: null,
//         },
//     });
// };

// const rejectIdea = async (id: string, payload: TIdeaStatusPayload) => {
//     const idea = await prisma.idea.findUnique({
//         where: { id },
//     });

//     if (!idea || idea.isDeleted) {
//         throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
//     }

//     return prisma.idea.update({
//         where: { id },
//         data: {
//             status: 'REJECTED',
//             adminFeedback: payload.feedback,
//         },
//     });
// };

// const adminDeleteIdea = async (id: string) => {
//     const idea = await prisma.idea.findUnique({
//         where: { id },
//     });

//     if (!idea || idea.isDeleted) {
//         throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
//     }

//     return prisma.idea.update({
//         where: { id },
//         data: { isDeleted: true },
//     });
// };

// export const IdeaService = {
//     createIdea,
//     getAllIdeas,
//     getAllIdeasAdmin,
//     getIdeaById,
//     updateIdea,
//     deleteIdea,
//     submitIdea,
//     getMyIdeas,
//     approveIdea,
//     rejectIdea,
//     adminDeleteIdea,
// };

// function resolveOrderBy(sort: string | undefined) {
//     switch (sort) {
//         case 'topVoted':
//             return { votes: { _count: 'desc' as const } };
//         case 'mostCommented':
//             return { comments: { _count: 'desc' as const } };
//         case 'recent':
//         default:
//             return { createdAt: 'desc' as const };
//     }
// }




import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import calculatePagination from '../../utils/pagination';


// import { Prisma } from '@prisma/client';

import {
    TCreateIdea,
    TIdeaQuery,
    TUpdateIdea,
    TIdeaStatusPayload,
} from './idea.interface';
import { PaymentStatus, Prisma } from '../../../generated/prisma';

// 🔍 ১. হোয়্যার ক্লজ বিল্ডার (পাবলিক ও অ্যাডমিন ফিল্টারিং এর জন্য)
const buildIdeaWhereClause = (
    query: TIdeaQuery,
    isAdmin = false,
    userId?: string,
): Prisma.IdeaWhereInput => {
    const conditions: Prisma.IdeaWhereInput[] = [];

    // সবসময় ডিলিট হওয়া আইডিয়া বাদ থাকবে
    conditions.push({
        isDeleted: false,
    });

    // পাবলিক ফিল্টার: অ্যাডমিন না হলে শুধুমাত্র APPROVED আইডিয়া দেখতে পাবে
    if (!isAdmin) {
        conditions.push({
            status: 'APPROVED',
        });
    }

    // মেম্বার নিজের আইডিয়া দেখতে চাইলে (ঐচ্ছিক ফিল্টার)
    if (userId) {
        conditions.push({
            authorId: userId,
        });
    }

    if (query.category) {
        conditions.push({
            categoryId: query.category,
        });
    }

    if (query.search) {
        conditions.push({
            OR: [
                { title: { contains: query.search, mode: 'insensitive' } },
                { problemStatement: { contains: query.search, mode: 'insensitive' } },
                { proposedSolution: { contains: query.search, mode: 'insensitive' } },
            ],
        });
    }

    // 💰 পেইড এবং ফ্রি আইডিয়া লজিক
    if (query.isPaid === 'paid') {
        conditions.push({
            price: { gt: 0 },
        });
    }

    if (query.isPaid === 'free') {
        conditions.push({
            OR: [
                { price: null },
                { price: 0 },
            ],
        });
    }

    return {
        AND: conditions,
    };
};

// 📝 ২. নতুন আইডিয়া তৈরি করা (সরাসরি APPROVED লজিকসহ)
const createIdea = async (payload: TCreateIdea, authorId: string) => {
    if (!authorId) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'Author ID is missing. Please login again.'
        );
    }

    // PAID আইডিয়ার জন্য ভ্যালিডেশন
    if (payload.paymentStatus === 'PAID' && (!payload.price || payload.price <= 0)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Paid ideas require a valid price (must be greater than 0)'
        );
    }

    // FREE আইডিয়ার জন্য ভ্যালিডেশন
    if (payload.paymentStatus === 'FREE' && payload.price && payload.price > 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Free ideas cannot have a price. Please set price to null or 0'
        );
    }

    const isPaid = payload.paymentStatus === 'PAID';

    const result = await prisma.idea.create({
        data: {
            title: payload.title,
            problemStatement: payload.problemStatement,
            proposedSolution: payload.proposedSolution,
            description: payload.description,
            images: payload.images || [],
            categoryId: payload.categoryId,
            paymentStatus: payload.paymentStatus || 'FREE',
            price: isPaid ? payload.price : null,
            authorId: authorId,
            status: 'APPROVED', // 👈 পেমেন্ট ফেইল বা ফ্রি দেখানোর ইস্যু ফিক্স করতে সরাসরি APPROVED করা হলো
        },
        include: {
            category: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true,
                },
            },
        },
    });

    return result;
};

// 📋 ৩. পাবলিক ইউজারদের জন্য সব আইডিয়া আনা
const getAllIdeas = async (query: TIdeaQuery, userId?: string) => {
    const pagination = calculatePagination({
        page: query.page,
        limit: query.limit,
    });

    const where = buildIdeaWhereClause(query, false, userId);
    const orderBy = resolveOrderBy(query.sort);

    const [ideas, total] = await Promise.all([
        prisma.idea.findMany({
            where,
            include: {
                category: { select: { id: true, name: true } },
                author: { select: { id: true, name: true, email: true } },
                _count: { select: { votes: true, comments: true } },
            },
            orderBy,
            skip: pagination.skip,
            take: pagination.limit,
        }),
        prisma.idea.count({ where }),
    ]);

    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            totalPage: Math.ceil(total / pagination.limit),
        },
        data: ideas,
    };
};

// 👑 ৪. অ্যাডমিন প্যানেলের জন্য সব আইডিয়া আনা
const getAllIdeasAdmin = async (query: TIdeaQuery) => {
    const pagination = calculatePagination({
        page: query.page,
        limit: query.limit,
    });

    const where = buildIdeaWhereClause(query, true);
    const orderBy = resolveOrderBy(query.sort);

    const [ideas, total] = await Promise.all([
        prisma.idea.findMany({
            where,
            include: {
                category: { select: { id: true, name: true } },
                author: { select: { id: true, name: true, email: true } },
                _count: { select: { votes: true, comments: true } },
            },
            orderBy,
            skip: pagination.skip,
            take: pagination.limit,
        }),
        prisma.idea.count({ where }),
    ]);

    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            totalPage: Math.ceil(total / pagination.limit),
        },
        data: ideas,
    };
};

// 🔍 ৫. নির্দিষ্ট আইডিয়া ডিটেইলস (পেমেন্ট গেটসহ চেক)
// const getIdeaById = async (id: string, currentUserId?: string, currentUserRole?: string) => {
//     const idea = await prisma.idea.findUnique({
//         where: { id },
//         include: {
//             category: { select: { id: true, name: true } },
//             author: { select: { id: true, name: true, email: true } },
//             _count: { select: { votes: true, comments: true } },
//         },
//     });

//     if (!idea || idea.isDeleted) {
//         throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
//     }

//     if (idea.paymentStatus === 'PAID') {
//         const isOwner = currentUserId === idea.authorId;
//         const isAdmin = currentUserRole === 'admin';

//         if (!isOwner && !isAdmin) {
//             if (!currentUserId) {
//                 throw new AppError(httpStatus.PAYMENT_REQUIRED, 'Payment required to access this idea');
//             }

//             const payment = await prisma.payment.findFirst({
//                 where: {
//                     ideaId: id,
//                     userId: currentUserId,
//                     status: { in: [Prisma.APPROVED ,Prisma.PaymentStatus.PAID] },
//                 },
//             });

//             if (!payment) {
//                 throw new AppError(httpStatus.PAYMENT_REQUIRED, 'Payment required to access this idea');
//             }
//         }
//     }

//     return idea;
// };





export const getIdeaById = async (
  id: string,
  currentUserId?: string,
  currentUserRole?: string
) => {
  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true },
      },
      author: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { votes: true, comments: true },
      },
    },
  });

  // ❌ not found
  if (!idea || idea.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Idea not found");
  }

  const isOwner = currentUserId === idea.authorId;
  const isAdmin = currentUserRole === "ADMIN";
  const isFree = idea.paymentStatus === "FREE";

  // ✅ FREE idea → always allow
  if (isFree) {
    return idea;
  }

  // ✅ owner/admin → always allow
  if (isOwner || isAdmin) {
    return idea;
  }

  // ❌ no user → block
  if (!currentUserId) {
    throw new AppError(
      httpStatus.PAYMENT_REQUIRED,
      "Payment required to access this idea"
    );
  }

  // 💳 check payment
  const payment = await prisma.payment.findFirst({
    where: {
      ideaId: id,
      userId: currentUserId,
      status: PaymentStatus.SUCCESS,// ✅ FIXED ENUM USAGE
    },
  });

  // ❌ not paid
  if (!payment) {
    throw new AppError(
      httpStatus.PAYMENT_REQUIRED,
      "Payment required to access this idea"
    );
  }

  // ✅ allowed
  return idea;
};


// 🔄 ৬. আইডিয়া আপডেট করা
const updateIdea = async (id: string, authorId: string, payload: TUpdateIdea) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
    });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    if (idea.authorId !== authorId) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not the owner of this idea');
    }

    const updatedData: Prisma.IdeaUpdateInput = {
        title: payload.title,
        problemStatement: payload.problemStatement,
        proposedSolution: payload.proposedSolution,
        description: payload.description,
        images: payload.images,
        paymentStatus: payload.paymentStatus,
    };

    if (payload.paymentStatus === 'PAID') {
        updatedData.price = payload.price ?? idea.price;
    } else if (payload.paymentStatus === 'FREE') {
        updatedData.price = null;
    } else if (payload.price !== undefined) {
        updatedData.price = payload.price;
    }

    return prisma.idea.update({
        where: { id },
        data: updatedData,
    });
};

// 🗑️ ৭. আইডিয়া সফট ডিলিট করা
const deleteIdea = async (id: string, authorId: string) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
    });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    if (idea.authorId !== authorId) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not the owner of this idea');
    }

    return prisma.idea.update({
        where: { id },
        data: { isDeleted: true },
    });
};

// 🚀 ৮. রিভিউ এর জন্য আইডিয়া সাবমিট করা
const submitIdea = async (id: string, authorId: string) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
    });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    if (idea.authorId !== authorId) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not the owner of this idea');
    }

    return prisma.idea.update({
        where: { id },
        data: {
            status: 'UNDER_REVIEW',
            adminFeedback: null,
        },
    });
};

// 👤 ৯. লগইন করা ইউজারের নিজস্ব আইডিয়া লিস্ট
const getMyIdeas = async (authorId: string) => {
    return prisma.idea.findMany({
        where: {
            authorId,
            isDeleted: false,
        },
        include: {
            category: { select: { id: true, name: true } },
            _count: { select: { votes: true, comments: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
};

// 🟢 ১০. অ্যাডমিন আইডিয়া অ্যাপ্রুভ করা
const approveIdea = async (id: string) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
    });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    return prisma.idea.update({
        where: { id },
        data: {
            status: 'APPROVED',
            adminFeedback: null,
        },
    });
};

// 🔴 ১১. অ্যাডমিন আইডিয়া রিজেক্ট করা
const rejectIdea = async (id: string, payload: TIdeaStatusPayload) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
    });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    return prisma.idea.update({
        where: { id },
        data: {
            status: 'REJECTED',
            adminFeedback: payload.feedback,
        },
    });
};

// ❌ ১২. অ্যাডমিন সরাসরি আইডিয়া ডিলিট করা
const adminDeleteIdea = async (id: string) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
    });

    if (!idea || idea.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
    }

    return prisma.idea.update({
        where: { id },
        data: { isDeleted: true },
    });
};

// 📊 সর্টিং হেল্পার ফাংশน
function resolveOrderBy(sort: string | undefined) {
    switch (sort) {
        case 'topVoted':
            return { votes: { _count: 'desc' as const } };
        case 'mostCommented':
            return { comments: { _count: 'desc' as const } };
        case 'recent':
        default:
            return { createdAt: 'desc' as const };
    }
}

export const IdeaService = {
    createIdea,
    getAllIdeas,
    getAllIdeasAdmin,
    getIdeaById,
    updateIdea,
    deleteIdea,
    submitIdea,
    getMyIdeas,
    approveIdea,
    rejectIdea,
    adminDeleteIdea,
};