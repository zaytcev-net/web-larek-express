import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { isCelebrateError } from 'celebrate';

import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

const errorHandler = (
  err: Error & { statusCode?: number; code?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (isCelebrateError(err)) {
    const error = new BadRequestError();

    res.status(error.statusCode).json({
      message: error.message,
    });

    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const error = new BadRequestError();

    res.status(error.statusCode).json({
      message: error.message,
    });

    return;
  }

  if (err.code === 11000) {
    const error = new ConflictError('Товар с таким названием уже существует');

    res.status(error.statusCode).json({
      message: error.message,
    });

    return;
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || 'Внутренняя ошибка сервера',
  });
};

export default errorHandler;
