// import { NextFunction, Request, Response } from 'express';
// import { ZodTypeAny } from 'zod';

// const validateRequest = (schema: ZodTypeAny) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             // Default to an empty object if no body is provided. 
//             // This allows Zod to properly validate and report missing required fields.
//             const body = req.body || {};

//             const result = await schema.safeParseAsync({
//                 body: body,
//                 query: req.query,
//                 params: req.params,
//                 cookies: req.cookies,
//             });

//             // If Zod validation fails, return a detailed error response
//             if (!result.success) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Validation failed',
//                     errors: result.error.issues,
//                 });
//             }

//             // Validation passed! Move to the next middleware or controller
//             next();
//         } catch (error) {
//             next(error);
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
//             console.log('🔍 VALIDATE REQUEST');
//             console.log('📌 Original body:', req.body);
//             console.log('📌 Body type:', typeof req.body);
//             console.log('📌 Body keys:', req.body ? Object.keys(req.body) : 'No keys');

//             // ✅ যদি body undefined বা null হয়
//             if (!req.body) {
//                 console.log('❌ Body is undefined');
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Request body is missing',
//                     tip: 'Send JSON data with Content-Type: application/json'
//                 });
//             }

//             // ✅ যদি body object না হয়
//             if (typeof req.body !== 'object') {
//                 console.log('❌ Body is not an object');
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Request body must be an object',
//                     receivedType: typeof req.body
//                 });
//             }

//             // ✅ Zod validation - সরাসরি body পাঠান
//             const parsedData = schema.parse(req.body);
//             console.log('✅ Validation passed:', parsedData);

//             // ✅ validated data কে req.body তে সেট করুন
//             req.body = parsedData;

//             next();
//         } catch (error: any) {
//             console.log('❌ Validation Error:', error.errors || error);

//             if (error.name === 'ZodError') {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Validation failed',
//                     errors: error.errors.map((err: any) => ({
//                         path: err.path,
//                         message: err.message,
//                         expected: err.expected,
//                         received: err.received
//                     }))
//                 });
//             }

//             next(error);
//         }
//     };
// };

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
// import { NextFunction, Request, Response } from 'express';
// import { ZodTypeAny } from 'zod';

// const validateRequest = (schema: ZodTypeAny) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             console.log('📋 Validating:', req.body);

//             // যদি body খালি বা undefined হয়
//             if (!req.body || typeof req.body !== 'object') {
//                 req.body = {};
//             }

//             await schema.parseAsync({
//                 body: req.body,
//                 cookies: req.cookies,
//             });

//             console.log('✅ Validation passed');
//             next();
//         } catch (err) {
//             console.log('❌ Validation error:', err);
//             next(err);
//         }
//     };
// };

// export default validateRequest;





// import { NextFunction, Request, Response } from 'express';


// import { ZodTypeAny } from 'zod';

// const validateRequest = (schema: ZodTypeAny) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             console.log('📋 Validating Request Elements...');

//             // যদি body খালি বা undefined হয়
//             if (!req.body || typeof req.body !== 'object') {
//                 req.body = {};
//             }

//             // ✅ সমাধান: params এবং query-কেও Zod parse-এর ভেতরে দিয়ে দিন
//             await schema.parseAsync({
//                 body: req.body,
//                 query: req.query,
//                 params: req.params, 
//                 cookies: req.cookies,
//             });

//             console.log('✅ Validation passed');
//             next();
//         } catch (err) {
//             console.log('❌ Validation error:', err);
//             next(err);
//         }
//     };
// };

// export default validateRequest;



// import { NextFunction, Request, Response } from 'express';


// import { ZodTypeAny } from 'zod';


// const validateRequest = (schema: ZodTypeAny) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await schema.parseAsync(req.body); // 🔥 simple
//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// };
// export default validateRequest;




// import { NextFunction, Request, Response } from 'express';
// import { ZodTypeAny } from 'zod';

// const validateRequest = (schema: ZodTypeAny) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // 💡 এখানে নিশ্চিত করা হচ্ছে যে body, query বা params কোনোটিই যেন undefined না যায়।
//       // যদি ফাঁকা থাকে, তবে ডিফাল্ট হিসেবে খালি অবজেক্ট `{}` পাস হবে।
//       await schema.parseAsync({
//         body: req.body || {},
//         query: req.query || {},
//         params: req.params || {},
//       });
      
//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// };

// export default validateRequest;




// import { NextFunction, Request, Response } from 'express';
// import { ZodTypeAny } from 'zod'; // 💡 ZodTypeAny-ই থাকবে

// export const validateRequest = (schema: ZodTypeAny) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       if (req.body && req.body.data && typeof req.body.data === 'string') {
//         try {
//           req.body = JSON.parse(req.body.data);
//         } catch (parseErr) {
//           return next(new Error('Invalid JSON format inside body.data'));
//         }
//       }

//       // 💡 এখানে শেষে 'as any' যুক্ত করে টাইপস্ক্রিপ্টের কম্পাইল এররটি ফিক্স করা হয়েছে
//       const parsedResult = (await schema.parseAsync({
//         body: req.body || {},
//         query: req.query || {},
//         params: req.params || {},
//       })) as any;

//       // ✅ টাইপস্ক্রিপ্ট এখন আর এখানে 'unknown' বলবে না এবং কোনো এরর দেবে না!
//       req.body = parsedResult.body;
//       req.query = parsedResult.query;
//       req.params = parsedResult.params;

//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// };

// export default validateRequest;




// import { NextFunction, Request, Response } from 'express';
// import { ZodTypeAny } from 'zod';

// export const validateRequest = (schema: ZodTypeAny) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // ১. মাল্টার / ফাইল আপলোডের ক্ষেত্রে 'data' স্ট্রিং পার্স করার লজিক
//       if (req.body && req.body.data && typeof req.body.data === 'string') {
//         try {
//           req.body = JSON.parse(req.body.data);
//         } catch (parseErr) {
//           return next(new Error('Invalid JSON format inside body.data'));
//         }
//       }

//       // ২. Zod দিয়ে পুরো রিকোয়েস্ট অবজেক্ট ভ্যালিডেশন
//       const parsedResult = (await schema.parseAsync({
//         body: req.body || {},
//         query: req.query || {},
//         params: req.params || {},
//       })) as any;

//       // ৩. ডাটা স্যানিটাইজেশন (নিরাপদ উপায়ে ওভাররাইট করা)
//       req.body = parsedResult.body;
//       req.params = parsedResult.params;

//       // ✅ `req.query` কে সরাসরি নতুন অবজেক্ট না বানিয়ে, তার ভেতরের ভ্যালুগুলো মিউটেশন করা হলো
//       if (parsedResult.query) {
//         Object.assign(req.query, parsedResult.query);
//       }

//       next();
//     } catch (err) {
//       next(err); // ZodValidationError গ্লোবাল হ্যান্ডলারে চলে যাবে
//     }
//   };
// };

// export default validateRequest;



import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';

export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ১. মাল্টার / ফাইল আপলোডের ক্ষেত্রে 'data' স্ট্রিং পার্স করার লজিক
      if (req.body && req.body.data && typeof req.body.data === 'string') {
        try {
          req.body = JSON.parse(req.body.data);
        } catch (parseErr) {
          return next(new Error('Invalid JSON format inside body.data'));
        }
      }

      // ২. Zod দিয়ে পুরো রিকোয়েস্ট অবজেক্ট ভ্যালিডেশন (এখানে cookies যুক্ত করা হলো)
      const parsedResult = (await schema.parseAsync({
        body: req.body || {},
        query: req.query || {},
        params: req.params || {},
        cookies: req.cookies || {}, // 👈 এই লাইনটি যুক্ত করা হয়েছে
      })) as any;

      // ৩. ডাটা স্যানিটাইজেশন
      req.body = parsedResult.body;
      req.params = parsedResult.params;
      req.cookies = parsedResult.cookies; // 👈 কুকি স্যানিটাইজেশনও যুক্ত হলো

      if (parsedResult.query) {
        Object.assign(req.query, parsedResult.query);
      }

      next();
    } catch (err) {
      next(err); // ZodValidationError গ্লোবাল হ্যান্ডলারে চলে যাবে
    }
  };
};

export default validateRequest;