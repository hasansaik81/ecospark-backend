import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { NewsletterController } from './newsletter.controller';
import { newsletterValidationSchema } from './newsletter.validation';

const router = express.Router();

router.post(
    '/subscribe',
    validateRequest(newsletterValidationSchema.subscribe),
    NewsletterController.subscribe,
);

router.delete(
    '/unsubscribe',
    validateRequest(newsletterValidationSchema.unsubscribe),
    NewsletterController.unsubscribe,
);

export const NewsletterRoutes = router;
