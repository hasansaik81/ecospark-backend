






import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { IdeaController } from './idea.controller';
import { ideaValidationSchema } from './idea.validation';

const router = express.Router();


router.get("/public", IdeaController.getAllIdeas);
router.get("/my", auth("MEMBER"), IdeaController.getMyIdeas);
router.get("/admin/ideas", auth("ADMIN"), IdeaController.getAllIdeasAdmin);
router.get("/", IdeaController.getAllIdeas);


router.post(
    "/",
    auth("MEMBER", "ADMIN"),
    validateRequest(ideaValidationSchema.createIdea),
    IdeaController.createIdea
);


router.patch("/admin/ideas/:id/approve", auth("ADMIN"), IdeaController.approveIdea);
router.patch(
    "/admin/ideas/:id/reject",
    auth("ADMIN"),
    validateRequest(ideaValidationSchema.rejectIdea),
    IdeaController.rejectIdea
);
router.delete("/admin/ideas/:id", auth("ADMIN"), IdeaController.adminDeleteIdea);


router.patch("/:id/submit", auth("MEMBER"), validateRequest(ideaValidationSchema.submitIdea), IdeaController.submitIdea);
router.patch("/:id", auth("MEMBER"), validateRequest(ideaValidationSchema.updateIdea), IdeaController.updateIdea);
router.delete("/:id", auth("MEMBER"), IdeaController.deleteIdea);


router.get("/:id", IdeaController.getIdeaById);

export const IdeaRoutes = router;
