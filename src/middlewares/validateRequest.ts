



import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny } from 'zod';

export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
   
      if (req.body && req.body.data && typeof req.body.data === 'string') {
        try {
          req.body = JSON.parse(req.body.data);
        } catch (parseErr) {
          return next(new Error('Invalid JSON format inside body.data'));
        }
      }

      
      const parsedResult = (await schema.parseAsync({
        body: req.body || {},
        query: req.query || {},
        params: req.params || {},
        cookies: req.cookies || {},
      })) as any;

   
      
     
      if (parsedResult.body !== undefined) {
        req.body = parsedResult.body;
      }
      
      if (parsedResult.cookies !== undefined) {
        req.cookies = parsedResult.cookies;
      }

    
      if (parsedResult.params !== undefined) {
        req.params = parsedResult.params;
      }

      if (parsedResult.query !== undefined) {
     
        for (const key in req.query) {
          delete req.query[key];
        }
        Object.assign(req.query, parsedResult.query);
      }

      next();
    } catch (err) {
      next(err); // ZodValidationError
    }
  };
};

export default validateRequest;