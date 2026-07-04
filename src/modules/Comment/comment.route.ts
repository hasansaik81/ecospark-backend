import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CommentController } from './comment.controller';
import { commentValidationSchema } from './comment.validation';



// src/app/modules/Comment/comment.route.ts
const router = express.Router();

// 📥 আইডিয়ার সব কমেন্ট গেট করার জন্য
router.get(
    '/:id', // 👈 শুধু '/:id' থাকবে (যেখানে id হলো ideaId)
    validateRequest(commentValidationSchema.getComments),
    CommentController.getComments,
);

// 📤 নতুন কমেন্ট পোস্ট করার জন্য
router.post(
    '/:id', // 👈 শুধু '/:id' থাকবে
    auth('MEMBER'),
    validateRequest(commentValidationSchema.createComment),
    CommentController.createComment,
);

// 🗑️ কমেন্ট ডিলিট করার জন্য
router.delete(
    '/:id', // 👈 এখানে id হলো কমেন্টের নিজস্ব id
    auth(),
    validateRequest(commentValidationSchema.deleteComment),
    CommentController.deleteComment,
);

// export const CommentRoutes = router;

export const CommentRoutes = router;
