// import express, { Application, Request, Response } from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import router from './routes';
// import { errorHandler } from './middlewares/globalErrorHandler';
// import notFound from './middlewares/notFound';

// const app: Application = express();

// // parsers
// app.use(express.json());
// app.use(cors({ origin: true, credentials: true }));
// app.use(cookieParser());

// // application routes
// app.use('/api', router);

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello from EcoSpark Hub Backend!');
// });

// // global error handler
// app.use(errorHandler);

// // not found handler
// app.use(notFound);

// export default app;




// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes';
import { errorHandler } from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';

const app: Application = express();

// ⭐⭐⭐ ম্যানুয়াল বডি পার্সার - ১০০% কাজ করবে ⭐⭐⭐
app.use((req: Request, res: Response, next: NextFunction) => {
  // শুধু POST, PUT, PATCH মেথডের জন্য
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    let rawBody = '';

    req.on('data', (chunk) => {
      rawBody += chunk.toString();
    });

    req.on('end', () => {
      try {
        if (rawBody) {
          req.body = JSON.parse(rawBody);
          console.log('✅ Manual parse successful:', req.body);
        } else {
          console.log('⚠️ Empty body received');
          req.body = {};
        }
      } catch (error) {
        console.log('❌ JSON parse error:', error);
        req.body = {};
      }
      next();
    });

    req.on('error', (error) => {
      console.log('❌ Request error:', error);
      req.body = {};
      next();
    });
  } else {
    next();
  }
});

// অন্যান্য মিডলওয়্যার (এখন express.json() দরকার নেই)
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// 🔍 ডিবাগ মিডলওয়্যার
app.use((req, res, next) => {
  console.log('========================================');
  console.log(`🔍 ${req.method} ${req.url}`);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body:', req.body);
  console.log('Body keys:', req.body ? Object.keys(req.body) : 'undefined');
  console.log('========================================');
  next();
});

// application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from EcoSpark Hub Backend!');
});

// global error handler
app.use(errorHandler);

// not found handler
app.use(notFound);

export default app;
