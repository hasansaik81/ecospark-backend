import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { authValidationSchema } from './auth.validation';

const router = express.Router();

router.post(
    '/register',
    validateRequest(authValidationSchema.register),
    AuthController.register,
);

router.post(
    '/login',
    validateRequest(authValidationSchema.login),
    AuthController.login,
);

router.post(
    '/refresh-token',
    validateRequest(authValidationSchema.refresh),
    AuthController.refreshToken,
);

router.post(
    '/logout',
    AuthController.logout,
);

export const AuthRoutes = router;
