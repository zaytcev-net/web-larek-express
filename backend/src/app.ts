import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import config from './config';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import authRouter from './routes/auth';
import uploadRouter from './routes/upload';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/error-handler';
import notFound from './middlewares/not-found';

const app = express();

app.use(
  cors({
    origin: config.originAllow,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(requestLogger);

app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('/upload', uploadRouter);

app.use(errorLogger);

app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(config.dbAddress)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(config.port, () => {
      console.log(`Server started on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
