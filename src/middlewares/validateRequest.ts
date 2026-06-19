// import { NextFunction, Request, Response } from 'express';
// import { ZodTypeAny } from 'zod';

// const validateRequest =
//     (schema: ZodTypeAny) =>
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             await schema.parseAsync({
//                 body: req.body,
//                 query: req.query,
//                 params: req.params,
//                 cookies: req.cookies,
//             });
//             next();
//         } catch (err) {
//             next(err);
//         }
//     };

// export default validateRequest;





// src/middlewares/validateRequest.ts
// import { NextFunction, Request, Response } from 'express';
// import { z } from 'zod';

// const validateRequest = (schema: z.ZodTypeAny) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             await schema.parseAsync({
//                 body: req.body,
//                 cookies: req.cookies,
//             });
//             next();
//         } catch (err) {
//             next(err);
//         }
//     };
// };

// export default validateRequest;





// src/middlewares/validateRequest.ts
// import { NextFunction, Request, Response } from 'express';
// import { ZodTypeAny } from 'zod';

// const validateRequest = (schema: ZodTypeAny) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             console.log('========================================');
//             console.log('📋 VALIDATE REQUEST MIDDLEWARE');
//             console.log('Body:', req.body);
//             console.log('Body type:', typeof req.body);
//             console.log('Body keys:', req.body ? Object.keys(req.body) : 'undefined');
//             console.log('Cookies:', req.cookies);
//             console.log('========================================');

//             // ⚠️ চেক করুন body undefined কিনা
//             if (!req.body || typeof req.body !== 'object') {
//                 console.log('❌ ERROR: req.body is undefined or not an object!');
//                 throw new Error('req.body is undefined. Please check express.json() middleware.');
//             }

//             // এখন ভ্যালিডেশন করান
//             const result = await schema.parseAsync({
//                 body: req.body,
//                 cookies: req.cookies,
//             });

//             console.log('✅ Validation successful');
//             next();
//         } catch (err) {
//             console.log('❌ Validation Error:', err);
//             next(err);
//         }
//     };
// };

// export default validateRequest;




// src/middlewares/validateRequest.ts
import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';

const validateRequest = (schema: ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('📋 Validating:', req.body);

            // যদি body খালি বা undefined হয়
            if (!req.body || typeof req.body !== 'object') {
                req.body = {};
            }

            await schema.parseAsync({
                body: req.body,
                cookies: req.cookies,
            });

            console.log('✅ Validation passed');
            next();
        } catch (err) {
            console.log('❌ Validation error:', err);
            next(err);
        }
    };
};

export default validateRequest;

