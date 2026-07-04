
// import express, { Application, Request, Response } from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import router from './routes'; // 👈 রাউটার ইমপোর্ট
// import { errorHandler } from './middlewares/globalErrorHandler';
// import notFound from './middlewares/notFound';

// const app: Application = express();

// // ==========================================
// // 🛠️ ১. গ্লোবাল পার্সার ও মিডলওয়্যার (সবার আগে থাকবে)
// // ==========================================
// app.use(cors({ origin: true, credentials: true }));
// app.use(cookieParser());

// // 💡 সবচেয়ে গুরুত্বপূর্ণ: এই দুটি লাইন অবশ্যই রাউটারের উপরে থাকতে হবে
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // ==========================================
// // 🛣️ ২. অ্যাপ্লিকেশনের রাউটসমূহ
// // ==========================================
// app.use('/api/v1', router);

// // রুট ইউআরএল টেস্ট
// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello from EcoSpark Hub Backend! 🌱⚡');
// });

// // ==========================================
// // 🚨 ৩. এরর হ্যান্ডলিং মিডলওয়্যার (সবচেয়ে শেষে থাকবে)
// // ==========================================
// app.use(errorHandler);
// app.use(notFound);

// export default app;



import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes'; 
import { errorHandler } from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';
import { PaymentController } from './modules/Payment/payment.controller'; // 👈 আপনার পেমেন্ট কন্ট্রোলারটি ইমপোর্ট করুন

const app: Application = express();

// ==========================================
// 🛠️ ১. গ্লোবাল পার্সার ও মিডলওয়্যার 
// ==========================================
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// 🎯 [CRITICAL FIX]: স্ট্রাইপ ওয়েবভুক রাউটটি সবার উপরে (express.json-এর আগে) থাকতে হবে
// এবং এটি অবশ্যই express.raw ব্যবহার করবে যাতে সিগনেচার ভেরিফিকেশন সফল হয়।
app.post(
  '/api/v1/payments/webhook', 
  express.raw({ type: 'application/json' }), 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const rawBody = req.body;
      const result = await PaymentController.handleStripeWebhook(rawBody, signature);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }
);
// 💡 অন্যান্য সাধারণ রাউটের জন্য JSON পার্সার (এটি ওয়েবভুকের নিচে থাকবে)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// 🛣️ ২. অ্যাপ্লিকেশনের রাউটসমূহ
// ==========================================
app.use('/api/v1', router);

// রুট ইউআরএল টেস্ট
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from EcoSpark Hub Backend! 🌱⚡');
});

// ==========================================
// 🚨 ৩. এরর হ্যান্ডলিং মিডলওয়্যার 
// ==========================================
app.use(errorHandler);
app.use(notFound);

export default app;