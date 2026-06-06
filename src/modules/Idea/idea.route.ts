import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { IdeaController } from './idea.controller';
import { ideaValidationSchema } from './idea.validation';

const router = express.Router();

// Public idea listing routes
router.get(
    '/',
    validateRequest(ideaValidationSchema.getAllIdeas),
    IdeaController.getAllIdeas,
);

// Member-specific idea routes
router.post(
    '/',
    auth('member'),
    validateRequest(ideaValidationSchema.createIdea),
    IdeaController.createIdea,
);
router.get('/my', auth('member'), IdeaController.getMyIdeas);
router.patch(
    '/:id',
    auth('member'),
    validateRequest(ideaValidationSchema.updateIdea),
    IdeaController.updateIdea,
);
router.patch(
    '/:id/submit',
    auth('member'),
    validateRequest(ideaValidationSchema.submitIdea),
    IdeaController.submitIdea,
);
router.delete('/:id', auth('member'), IdeaController.deleteIdea);

// Admin idea management
router.get('/admin/ideas', auth('admin'), IdeaController.getAllIdeasAdmin);
router.patch('/admin/ideas/:id/approve', auth('admin'), IdeaController.approveIdea);
router.patch(
    '/admin/ideas/:id/reject',
    auth('admin'),
    validateRequest(ideaValidationSchema.rejectIdea),
    IdeaController.rejectIdea,
);
router.delete('/admin/ideas/:id', auth('admin'), IdeaController.adminDeleteIdea);

// Public idea detail route (must come after specific member/admin routes)
router.get('/:id', IdeaController.getIdeaById);

export const IdeaRoutes = router;
