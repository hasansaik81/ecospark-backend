import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes';
import { errorHandler } from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

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
