



import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes'; 
import { errorHandler } from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';
import { PaymentController } from './modules/Payment/payment.controller';

const app: Application = express();


app.use(cors());
app.use(cookieParser());

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.use(errorHandler);
app.use(notFound);

export default app;