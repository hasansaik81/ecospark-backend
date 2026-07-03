// import express from 'express';
// import validateRequest from '../../middlewares/validateRequest';
// import { AuthController } from './auth.controller';
// import { authValidationSchema } from './auth.validation';

// const router = express.Router();

// router.post(
//     '/register',
//     validateRequest(authValidationSchema.register),
//     AuthController.register,
// );

// router.post(
//     '/login',
//     validateRequest(authValidationSchema.login),
//     AuthController.login,
// );

// router.post(
//     '/refresh-token',
//     validateRequest(authValidationSchema.refresh),
//     AuthController.refreshToken,
// );

// router.post(
//     '/logout',
//     AuthController.logout,
// );

// export const AuthRoutes = router;


import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { authValidationSchema } from './auth.validation';

import { Role } from '../../../generated/prisma';

const router = express.Router();

router.post(
    '/register',
    validateRequest(authValidationSchema.register),
    AuthController.register,
);

router.post(
    '/login',
    validateRequest(authValidationSchema.login),
    AuthController.loginUser
);

// router.post(
//     '/login',
//     AuthController.loginUser
// );



router.post(
    '/refresh-token',
    validateRequest(authValidationSchema.refresh),
    AuthController.refreshToken,
);

router.post(
    '/logout',
    AuthController.logout,
);

// প্রোফাইল বা বর্তমান ইউজারের ডাটা দেখার জন্য
// router.get(
//     '/me',
//     auth(Role.ADMIN, Role.MEMBER), // রোলগুলো আপনার ডাটাবেস অনুযায়ী দিবেন
//     AuthController.getMe,
// );

export const AuthRoutes = router;
