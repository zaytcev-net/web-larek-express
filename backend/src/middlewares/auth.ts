import { Request, Response, NextFunction } from 'express';

import { verifyAccessToken } from '../utils/token';
import BaseError from '../errors/base-error';

const auth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return next(new BaseError('Необходима авторизация', 401));
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      return next(new BaseError('Необходима авторизация', 401));
    }

    const payload = verifyAccessToken(token);

    req.userId = payload._id;

    return next();
  } catch (error) {
    return next(new BaseError('Необходима авторизация', 401));
  }
};

export default auth;
