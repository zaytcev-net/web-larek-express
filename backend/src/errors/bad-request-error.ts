import { BaseError } from "./base-error";

export class BadRequestError extends BaseError {
  constructor(message = "Некорректные данные") {
    super(message, 400);
  }
}
