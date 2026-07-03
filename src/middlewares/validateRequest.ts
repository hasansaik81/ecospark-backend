
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

//       // ২. Zod দিয়ে পুরো রিকোয়েস্ট অবজেক্ট ভ্যালিডেশন (এখানে cookies যুক্ত করা হলো)
//       const parsedResult = (await schema.parseAsync({
//         body: req.body || {},
//         query: req.query || {},
//         params: req.params || {},
//         cookies: req.cookies || {}, // 👈 এই লাইনটি যুক্ত করা হয়েছে
//       })) as any;

//       // ৩. ডাটা স্যানিটাইজেশন
//       req.body = parsedResult.body;
//       req.params = parsedResult.params;
//       req.cookies = parsedResult.cookies; // 👈 কুকি স্যানিটাইজেশনও যুক্ত হলো

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

      // ২. Zod দিয়ে পুরো রিকোয়েস্ট অবজেক্ট ভ্যালিডেশন
      const parsedResult = (await schema.parseAsync({
        body: req.body || {},
        query: req.query || {},
        params: req.params || {},
        cookies: req.cookies || {},
      })) as any;

      // ৩. ডাটা স্যানিটাইজেশন (Read-only এরর এড়াতে নিরাপদ মেথড)
      
      // body এবং cookies সরাসরি রি-এসাইন করা যায়
      if (parsedResult.body !== undefined) {
        req.body = parsedResult.body;
      }
      
      if (parsedResult.cookies !== undefined) {
        req.cookies = parsedResult.cookies;
      }

      // params এবং query রি-এসাইন না করে ভেতরের অবজেক্ট মডিফাই করা (TypeError ফিক্স)
      if (parsedResult.params !== undefined) {
        req.params = parsedResult.params;
      }

      if (parsedResult.query !== undefined) {
        // প্রথমে পুরানো কোয়েরি ক্লিন করে জড এর স্যানিটাইজড কোয়েরি অ্যাসাইন করা
        for (const key in req.query) {
          delete req.query[key];
        }
        Object.assign(req.query, parsedResult.query);
      }

      next();
    } catch (err) {
      next(err); // ZodValidationError গ্লোবাল হ্যান্ডলারে চলে যাবে
    }
  };
};

export default validateRequest;