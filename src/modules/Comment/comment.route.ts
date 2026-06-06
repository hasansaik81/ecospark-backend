import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CommentController } from './comment.controller';
import { commentValidationSchema } from './comment.validation';

const router = express.Router();

router.get(
    '/ideas/:id/comments',
    validateRequest(commentValidationSchema.getComments),
    CommentController.getComments,
);

router.post(
    '/ideas/:id/comments',
    auth('member'),
    validateRequest(commentValidationSchema.createComment),
    CommentController.createComment,
);

router.delete(
    '/comments/:id',
    auth(),
    validateRequest(commentValidationSchema.deleteComment),
    CommentController.deleteComment,
);

export const CommentRoutes = router;
