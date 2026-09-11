import BaseError from './base-error';

class BadRequestError extends BaseError {
  constructor(message: string = 'Некорректные данные') {
    super(message, 400);
  }
}

export default BadRequestError;
