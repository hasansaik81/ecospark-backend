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
//     res.send('Hello from EcoSpark Hub Backend!');
// });

// // global error handler
// app.use(errorHandler);

// // not found handler
// app.use(notFound);

// export default app;




// import express, { Application, Request, Response } from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import router from './routes';
// import { errorHandler } from './middlewares/globalErrorHandler';
// import notFound from './middlewares/notFound';

// const app: Application = express();

// // 🛠️ গ্লোবাল পার্সার ও মিডলওয়্যার
// app.use(cors({ origin: true, credentials: true }));
// app.use(cookieParser());
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // 🛣️ অ্যাপ্লিকেশনের রাউটসমূহ
// app.use('/api', router);

// // রুট ইউআরএল টেস্ট
// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello from EcoSpark Hub Backend! 🌱⚡');
// });

// // 🚨 এরর হ্যান্ডলিং মিডলওয়্যার
// app.use(errorHandler);
// app.use(notFound);

// export default app;






// src/app.ts
// import express, { Application, Request, Response, NextFunction } from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import router from './routes';
// import { errorHandler } from './middlewares/globalErrorHandler';
// import notFound from './middlewares/notFound';

// const app: Application = express();

// // ✅ 1. CORS - প্রথমে বসান
// app.use(cors({ origin: true, credentials: true }));

// // ✅ 2. JSON Parser - সবচেয়ে গুরুত্বপূর্ণ
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // ✅ 3. Cookie Parser
// app.use(cookieParser());

// // ✅ 4. টেস্ট মিডলওয়্যার - দেখার জন্য body আসছে কিনা
// app.use((req: Request, res: Response, next: NextFunction) => {
//     console.log('🔍 TEST MIDDLEWARE:');
//     console.log('Method:', req.method);
//     console.log('URL:', req.url);
//     console.log('Content-Type:', req.headers['content-type']);
//     console.log('Body:', req.body);
//     console.log('Body is undefined?', req.body === undefined);
//     next();
// });

// // ✅ 5. রাউটস - সব মিডলওয়্যারের পরে
// app.use('/api', router);

// // ✅ 6. রুট টেস্ট
// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello from EcoSpark Hub Backend! 🌱⚡');
// });

// // ✅ 7. Error handlers - সবশেষে
// app.use(errorHandler);
// app.use(notFound);

// export default app;


// src/app.ts


// src/app.ts
// import express, { Application, Request, Response, NextFunction } from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';

// const app: Application = express();

// // ✅ সবচেয়ে গুরুত্বপূর্ণ মিডলওয়্যার - প্রথমে বসাতে হবে!
// console.log('🛠️ Configuring middlewares...');

// // 1. CORS
// app.use(cors({ origin: true, credentials: true }));

// // 2. JSON Parser - এটা ছাড়া Body আসবে না!
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // 3. Cookie Parser
// app.use(cookieParser());

// // 4. TEST MIDDLEWARE - দেখার জন্য Body আসছে কিনা
// app.use((req: Request, res: Response, next: NextFunction) => {
//     console.log('═══════════════════════════════════════');
//     console.log(`📡 ${req.method} ${req.url}`);
//     console.log(`📌 Content-Type: ${req.headers['content-type']}`);
//     console.log(`📌 Body:`, req.body);
//     console.log(`📌 Body is undefined? ${req.body === undefined}`);
//     console.log('═══════════════════════════════════════');
//     next();
// });

// // 5. IMPORT ROUTES
// import router from './routes';
// app.use('/api', router);

// // 6. ROOT ROUTE
// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello from EcoSpark Hub Backend! 🌱⚡');
// });

// // 7. ERROR HANDLERS
// import { errorHandler } from './middlewares/globalErrorHandler';
// import notFound from './middlewares/notFound';
// app.use(errorHandler);
// app.use(notFound);

// console.log('✅ App configured successfully!');

// export default app;




import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes'; // 👈 রাউটার ইমপোর্ট
import { errorHandler } from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';

const app: Application = express();

// ==========================================
// 🛠️ ১. গ্লোবাল পার্সার ও মিডলওয়্যার (সবার আগে থাকবে)
// ==========================================
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// 💡 সবচেয়ে গুরুত্বপূর্ণ: এই দুটি লাইন অবশ্যই রাউটারের উপরে থাকতে হবে
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// 🛣️ ২. অ্যাপ্লিকেশনের রাউটসমূহ
// ==========================================
app.use('/api', router);

// রুট ইউআরএল টেস্ট
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from EcoSpark Hub Backend! 🌱⚡');
});

// ==========================================
// 🚨 ৩. এরর হ্যান্ডলিং মিডলওয়্যার (সবচেয়ে শেষে থাকবে)
// ==========================================
app.use(errorHandler);
app.use(notFound);

export default app;